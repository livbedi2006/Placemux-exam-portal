"""
api.py

A FastAPI server that exposes the trained difficulty model as a web API.

Run with: uvicorn api:app --reload
Then visit https://wobbly-rut-sanctuary.ngrok-free.dev/docs to try it interactively.
"""

import joblib
import numpy as np
import pandas as pd
import uuid
import base64
import cv2
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scipy.sparse import hstack
from evaluate import calculate_report
from recommend import AdaptiveTest
from Proctoring.proctoring_system import ProctoringSystem

app = FastAPI(title="Question Difficulty Predictor")

# Allow the HTML page to call the API from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model and vectorizer ONCE when the server starts,
# not on every request -- that would be slow and wasteful.
print("Loading model...")
model = joblib.load("models/difficulty_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
print("Model loaded, ready to serve predictions.")

print("Loading question bank for adaptive testing...")
QUESTIONS_DF = pd.read_csv("data/clean_questions.csv")

# In-memory storage for ongoing test sessions.
# Key = session_id, Value = AdaptiveTest object tracking that student's progress.
# NOTE: this resets if the server restarts -- fine for learning/demo purposes,
# a real production system would use a database instead.
ACTIVE_SESSIONS = {}

# In-memory storage for proctoring sessions
PROCTORING_SESSIONS = {}

# Initialize proctoring system (singleton)
print("Initializing proctoring system...")
proctoring_system = ProctoringSystem(config_path='Proctoring/configur.json')
print("Proctoring system initialized.")


# This defines the exact shape of data the API expects to receive.
# FastAPI uses this to validate incoming requests automatically.
class QuestionRequest(BaseModel):
    question: str


# This defines the exact shape of data the API sends back.
class DifficultyResponse(BaseModel):
    question: str
    predicted_band: str


class StartTestRequest(BaseModel):
    domain: str
    start_band: str = "Intermediate"


class QuestionOut(BaseModel):
    question_id: str
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    band: str


class StartTestResponse(BaseModel):
    session_id: str
    question: QuestionOut


class SubmitAnswerRequest(BaseModel):
    session_id: str
    answer: str  # "a", "b", "c", or "d"


class SubmitAnswerResponse(BaseModel):
    was_correct: bool
    correct_answer: str
    new_band: str
    next_question: QuestionOut | None  # None means the test ran out of questions


# Proctoring API models
class StartProctoringRequest(BaseModel):
    session_id: str  # Link to exam session


class StartProctoringResponse(BaseModel):
    proctoring_session_id: str
    status: str
    message: str


class FrameRequest(BaseModel):
    proctoring_session_id: str
    frame_data: str  # Base64 encoded image


class Violation(BaseModel):
    type: str
    severity: str
    timestamp: str
    details: dict = {}


class FrameResponse(BaseModel):
    has_violations: bool
    violations: list[Violation]
    face_count: int
    object_count: int
    gaze_direction: str = "center"
    lip_movement: bool = False
    speech_detected: bool = False


class EndProctoringResponse(BaseModel):
    proctoring_session_id: str
    total_frames: int
    total_violations: int
    violation_counts: dict
    violations: list[dict]


def extract_features(question_text: str):
    text_features = vectorizer.transform([question_text])
    word_count = len(question_text.split())
    has_code = 1 if "```" in question_text else 0
    extra_features = np.array([[word_count, has_code]])
    return hstack([text_features, extra_features])


@app.get("/")
def read_root():
    return {"message": "Question Difficulty Predictor API is running"}


@app.get("/exam")
def serve_exam():
    return FileResponse("exam.html")


@app.post("/predict", response_model=DifficultyResponse)
def predict(request: QuestionRequest):
    features = extract_features(request.question)
    predicted_band = model.predict(features)[0]

    return DifficultyResponse(
        question=request.question,
        predicted_band=predicted_band,
    )


def _question_row_to_out(row, band: str) -> QuestionOut:
    return QuestionOut(
        question_id=row["question_id"],
        question=row["question"],
        option_a=row["option_a"],
        option_b=row["option_b"],
        option_c=row["option_c"],
        option_d=row["option_d"],
        band=band,
    )


@app.post("/start_test", response_model=StartTestResponse)
def start_test(request: StartTestRequest):
    try:
        test = AdaptiveTest(QUESTIONS_DF, domain=request.domain, start_band=request.start_band)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    first_question = test.get_next_question()
    if first_question is None:
        raise HTTPException(status_code=404, detail="No questions available for this domain/band.")

    session_id = str(uuid.uuid4())
    ACTIVE_SESSIONS[session_id] = test

    return StartTestResponse(
        session_id=session_id,
        question=_question_row_to_out(first_question, test.current_band),
    )


@app.get("/get_report/{session_id}")
def get_report(session_id: str):
    test = ACTIVE_SESSIONS.get(session_id)
    if test is None:
        raise HTTPException(status_code=404, detail="Session not found.")
    return calculate_report(test)


@app.post("/submit_answer", response_model=SubmitAnswerResponse)
def submit_answer(request: SubmitAnswerRequest):
    test = ACTIVE_SESSIONS.get(request.session_id)
    if test is None:
        raise HTTPException(status_code=404, detail="Session not found. Did you call /start_test first?")

    # We need to know which question was just answered to check correctness.
    # We stored the asked question IDs, but not which one was "current" -- so
    # the client must tell us via session state. Simplify: track last question on the test object.
    if test.last_question is None:
        raise HTTPException(status_code=400, detail="No active question for this session.")

    correct_letter = str(test.last_question["correct_answer"]).strip().lower()
    was_correct = request.answer.strip().lower() == correct_letter

    test.submit_answer(was_correct)
    next_question = test.get_next_question()

    return SubmitAnswerResponse(
        was_correct=was_correct,
        correct_answer=correct_letter,
        new_band=test.current_band,
        next_question=_question_row_to_out(next_question, test.current_band) if next_question is not None else None,
    )


# Proctoring endpoints
@app.post("/proctoring/start", response_model=StartProctoringResponse)
def start_proctoring(request: StartProctoringRequest):
    """Start a proctoring session for an exam session"""
    proctoring_session_id = str(uuid.uuid4())
    
    # Create a new proctoring session state
    PROCTORING_SESSIONS[proctoring_session_id] = {
        "exam_session_id": request.session_id,
        "start_time": pd.Timestamp.now().isoformat(),
        "frame_count": 0,
        "violations": [],
        "violation_counts": {}
    }
    
    return StartProctoringResponse(
        proctoring_session_id=proctoring_session_id,
        status="active",
        message="Proctoring session started successfully"
    )


def decode_base64_frame(base64_string: str) -> np.ndarray:
    """Decode base64 encoded image to numpy array"""
    # Remove data URL prefix if present
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    
    # Decode base64
    image_data = base64.b64decode(base64_string)
    
    # Convert to numpy array
    nparr = np.frombuffer(image_data, np.uint8)
    
    # Decode to BGR format (OpenCV default)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    return frame


@app.post("/proctoring/process_frame", response_model=FrameResponse)
def process_frame(request: FrameRequest):
    """Process a video frame and detect violations"""
    session = PROCTORING_SESSIONS.get(request.proctoring_session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Proctoring session not found")
    
    try:
        # Decode the base64 frame
        frame = decode_base64_frame(request.frame_data)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid frame data")
        
        # Process frame with proctoring system
        detections = proctoring_system.detect_objects(frame)
        faces = proctoring_system.detect_faces(frame)
        gaze_data = proctoring_system.detect_gaze_and_lips(frame)
        
        # Check for violations
        current_violations = proctoring_system.check_violations(detections, faces, gaze_data)
        
        # Update session state
        session["frame_count"] += 1
        session["violations"].extend(current_violations)
        
        # Count violations by type
        for violation in current_violations:
            v_type = violation["type"]
            session["violation_counts"][v_type] = session["violation_counts"].get(v_type, 0) + 1
        
        # Convert violations to API response format
        api_violations = []
        for violation in current_violations:
            api_violations.append(Violation(
                type=violation["type"],
                severity=violation["severity"],
                timestamp=violation["timestamp"],
                details={k: v for k, v in violation.items() if k not in ["type", "severity", "timestamp"]}
            ))
        
        return FrameResponse(
            has_violations=len(current_violations) > 0,
            violations=api_violations,
            face_count=len(faces),
            object_count=len(detections),
            gaze_direction=gaze_data.get("gaze_direction", "center"),
            lip_movement=gaze_data.get("lip_movement", False),
            speech_detected=proctoring_system.speech_detected
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing frame: {str(e)}")


@app.post("/proctoring/end", response_model=EndProctoringResponse)
def end_proctoring(proctoring_session_id: str):
    """End a proctoring session and return violation report"""
    session = PROCTORING_SESSIONS.get(proctoring_session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Proctoring session not found")
    
    # Get session data
    total_frames = session["frame_count"]
    violations = session["violations"]
    violation_counts = session["violation_counts"]
    
    # Remove session from active sessions
    del PROCTORING_SESSIONS[proctoring_session_id]
    
    # Stop audio detection if enabled
    if proctoring_system.audio_enabled:
        proctoring_system.stop_audio_detection()
    
    return EndProctoringResponse(
        proctoring_session_id=proctoring_session_id,
        total_frames=total_frames,
        total_violations=len(violations),
        violation_counts=violation_counts,
        violations=violations
    )


@app.get("/proctoring/status/{proctoring_session_id}")
def get_proctoring_status(proctoring_session_id: str):
    """Get current status of a proctoring session"""
    session = PROCTORING_SESSIONS.get(proctoring_session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Proctoring session not found")
    
    return {
        "proctoring_session_id": proctoring_session_id,
        "exam_session_id": session["exam_session_id"],
        "start_time": session["start_time"],
        "frame_count": session["frame_count"],
        "total_violations": len(session["violations"]),
        "violation_counts": session["violation_counts"]
    }