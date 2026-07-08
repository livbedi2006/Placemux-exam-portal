from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
import json
from datetime import datetime
import pathlib

app = FastAPI(
    title="ExamAI Pro - AI Microservice",
    description="FastAPI backend for AI-powered recommendation, proctoring, and evaluation",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "success", "message": "ExamAI Pro AI Microservice is running!"}

# Basic Rate Limiting Middleware (Simulated for Enterprise Security)
from fastapi import Request
from fastapi.responses import JSONResponse
import time

# Simple in-memory rate limiting (IP-based)
request_counts = {}

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = time.time()
    
    # Cleanup old requests (older than 1 minute)
    if client_ip in request_counts:
        request_counts[client_ip] = [req_time for req_time in request_counts[client_ip] if current_time - req_time < 60]
    else:
        request_counts[client_ip] = []
        
    # Limit: 100 requests per minute
    if len(request_counts[client_ip]) >= 100:
        return JSONResponse(status_code=429, content={"message": "Rate limit exceeded. Please try again later."})
        
    request_counts[client_ip].append(current_time)
    
    response = await call_next(request)
    return response

@app.get("/health")
def health_check():
    return {"status": "ok"}


# ---------------------------------------------------------
# Exam Report Storage (simple file-backed storage)
# ---------------------------------------------------------
REPORTS_FILE = os.path.join(os.path.dirname(__file__), 'reports.json')
REPORTS_DIR = os.path.join(os.path.dirname(__file__), 'reports_files')
pathlib.Path(REPORTS_DIR).mkdir(exist_ok=True)

def _load_reports():
    try:
        if os.path.exists(REPORTS_FILE):
            with open(REPORTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception:
        return []
    return []

def _save_reports(data):
    with open(REPORTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class ReportCreate(BaseModel):
    studentId: str
    studentName: str
    department: str | None = None
    examId: str
    examName: str
    subject: str | None = None
    timeTakenSec: int
    submittedAt: str
    totalQuestions: int
    attempted: int
    correctAnswers: int
    wrongAnswers: int
    skippedAnswers: int
    marksObtained: float
    totalMarks: float
    percentage: float
    grade: str | None = None
    passFail: str | None = None
    topicPerformance: dict | None = None
    aiFeedback: dict | None = None

class ReportOut(ReportCreate):
    id: str
    pdfPath: str | None = None


@app.post('/api/reports', response_model=ReportOut)
def create_report(payload: ReportCreate):
    reports = _load_reports()
    rid = str(uuid4())
    rec = payload.dict()
    rec.update({
        'id': rid,
        'pdfPath': None,
        'createdAt': datetime.utcnow().isoformat() + 'Z'
    })
    reports.append(rec)
    _save_reports(reports)
    return rec


@app.get('/api/reports')
def list_reports(studentId: str | None = None):
    reports = _load_reports()
    if studentId:
        reports = [r for r in reports if r.get('studentId') == studentId]
    return {'status': 'success', 'count': len(reports), 'reports': reports}


@app.get('/api/reports/{report_id}')
def get_report(report_id: str):
    reports = _load_reports()
    for r in reports:
        if r.get('id') == report_id:
            return r
    raise HTTPException(status_code=404, detail='Report not found')


@app.post('/api/reports/{report_id}/pdf')
def upload_report_pdf(report_id: str, file: UploadFile = File(...)):
    reports = _load_reports()
    for r in reports:
        if r.get('id') == report_id:
            filename = f"report-{report_id}.pdf"
            out_path = os.path.join(REPORTS_DIR, filename)
            with open(out_path, 'wb') as f:
                f.write(file.file.read())
            r['pdfPath'] = f'/reports_files/{filename}'
            _save_reports(reports)
            return {'status': 'success', 'pdfPath': r['pdfPath']}
    raise HTTPException(status_code=404, detail='Report not found')


# Serve saved report files
app.mount('/reports_files', StaticFiles(directory=REPORTS_DIR), name='reports_files')

# Placeholder for AI Recommendation Endpoint
class StudentProfile(BaseModel):
    student_id: str
    weak_topics: list[str]
    strong_topics: list[str]
    preferred_difficulty: str = "MEDIUM"  # EASY, MEDIUM, HARD
    n_results: int = 5  # how many recommendations to return

import os
import joblib

import chromadb
from sentence_transformers import SentenceTransformer

# Initialize ChromaDB client globally to avoid reconnecting on each request
DB_DIR = os.path.join(os.path.dirname(__file__), 'chroma_db')
try:
    chroma_client = chromadb.PersistentClient(path=DB_DIR)
    collection = chroma_client.get_collection(name="question_bank")
    # Load embedding model (downloads if first time)
    embed_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    collection = None
    embed_model = None
    print(f"Warning: Failed to initialize Vector DB. Run recommendation_pipeline.py first. Error: {e}")

@app.post("/api/ai/recommend")
def recommend_questions(profile: StudentProfile):
    if not collection or not embed_model:
        return {"status": "error", "message": "Vector DB not initialized. Please run recommendation_pipeline.py first to load the Kaggle data."}
    
    # Build semantic query from student's weak topics
    if not profile.weak_topics:
        query_text = "General fundamental concepts"
    else:
        query_text = f"Questions about {', '.join(profile.weak_topics)}"
        
    query_embedding = embed_model.encode([query_text]).tolist()
    
    try:
        # Optional: filter by difficulty
        where_filter = None
        if profile.preferred_difficulty in ["EASY", "MEDIUM", "HARD"]:
            where_filter = {"difficulty": profile.preferred_difficulty}
        
        results = collection.query(
            query_embeddings=query_embedding,
            n_results=profile.n_results,
            where=where_filter,
        )
        
        recommended = []
        if results['ids'] and len(results['ids'][0]) > 0:
            for i in range(len(results['ids'][0])):
                meta = results['metadatas'][0][i]
                recommended.append({
                    "id":           results['ids'][0][i],
                    "text":         results['documents'][0][i],
                    "subject":      meta.get("subject", ""),
                    "topic":        meta.get("topic", ""),
                    "subtopic":     meta.get("subtopic", ""),
                    "difficulty":   meta.get("difficulty", ""),
                    "bloom_level":  meta.get("bloom_level", ""),
                    "marks":        meta.get("marks", "1"),
                    "time_limit":   meta.get("time_limit", "60"),
                    "tags":         meta.get("tags", ""),
                    "similarity":   f"{(1 - results['distances'][0][i]) * 100:.1f}%"
                })
                
        return {
            "status": "success",
            "student_id": profile.student_id,
            "query": query_text,
            "difficulty_filter": profile.preferred_difficulty,
            "total_recommended": len(recommended),
            "recommended_questions": recommended
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

class PredictionInput(BaseModel):
    study_hours: float
    previous_score: float
    attendance_rate: float
    weak_topics_count: int
    time_per_question_sec: float

@app.post("/api/ai/predict")
def predict_performance(data: PredictionInput):
    model_path = os.path.join(os.path.dirname(__file__), 'models', 'student_performance_model.joblib')
    
    if not os.path.exists(model_path):
        return {"status": "error", "message": "Model not trained yet."}
        
    try:
        model = joblib.load(model_path)
        # Prepare feature array in the exact order of training columns:
        # [study_hours, previous_score, attendance_rate, weak_topics_count, time_per_question_sec]
        features = [[
            data.study_hours, 
            data.previous_score, 
            data.attendance_rate, 
            data.weak_topics_count, 
            data.time_per_question_sec
        ]]
        
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        return {
            "status": "success",
            "prediction": "PASS" if prediction == 1 else "FAIL",
            "pass_probability": f"{probability[1] * 100:.1f}%",
            "fail_probability": f"{probability[0] * 100:.1f}%"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ---------------------------------------------------------
# AI Auto Evaluation (Subjective)
# ---------------------------------------------------------
class AnswerEvaluationRequest(BaseModel):
    question_text: str
    expected_answer: str
    student_answer: str
    total_marks: float

@app.post("/api/ai/evaluate")
def evaluate_subjective_answer(data: AnswerEvaluationRequest):
    # In a real app, this would use an LLM (OpenAI/HuggingFace) to compare semantics.
    score = 0.0
    if embed_model:
        emb_expected = embed_model.encode(data.expected_answer)
        emb_student = embed_model.encode(data.student_answer)
        import numpy as np
        similarity = np.dot(emb_expected, emb_student) / (np.linalg.norm(emb_expected) * np.linalg.norm(emb_student))
        score = float(max(0, similarity)) * data.total_marks
    else:
        score = data.total_marks * 0.75 # default mock
        
    return {
        "status": "success",
        "marks_awarded": round(score, 1),
        "total_marks": data.total_marks,
        "ai_feedback": "The answer covers key concepts but misses some specific terminology." if score < data.total_marks else "Perfect answer.",
        "keywords_matched": ["example", "concept"],
        "semantic_similarity": f"{score/data.total_marks*100:.1f}%"
    }

# ---------------------------------------------------------
# AI Generation (Notes & Flashcards)
# ---------------------------------------------------------
class GenerationRequest(BaseModel):
    topic: str
    content: str

@app.post("/api/ai/generate-notes")
def generate_notes(data: GenerationRequest):
    return {
        "status": "success",
        "title": f"Summary: {data.topic}",
        "notes": f"# {data.topic}\n\nHere are AI-generated notes based on the provided content: {data.content[:50]}...\n\n- Point 1: Ensure understanding of fundamentals.\n- Point 2: Review core concepts."
    }

@app.post("/api/ai/generate-flashcards")
def generate_flashcards(data: GenerationRequest):
    return {
        "status": "success",
        "flashcards": [
            {"front": f"What is the core concept of {data.topic}?", "back": "The primary principle explained in the text."},
            {"front": "Define the key term mentioned.", "back": "A specific definition derived from the provided content."}
        ]
    }

# ---------------------------------------------------------
# AI Proctoring Analysis
# ---------------------------------------------------------
class ProctoringSnapshot(BaseModel):
    image_base64: str
    student_id: str
    exam_id: str

@app.post("/api/ai/proctoring/analyze")
def analyze_snapshot(data: ProctoringSnapshot):
    return {
        "status": "success",
        "face_detected": True,
        "multiple_faces": False,
        "mobile_detected": False,
        "looking_away": False,
        "risk_score": 0,
        "timestamp": "2026-07-08T10:47:00Z"
    }
