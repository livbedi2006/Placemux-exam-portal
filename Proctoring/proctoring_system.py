import cv2
import numpy as np
import time
from datetime import datetime
from ultralytics import YOLO
import mediapipe as mp
from collections import defaultdict
import json
import os
import pyaudio
import threading
import queue

class ProctoringSystem:
    def __init__(self, config_path='config.json'):
        """
        Initialize the proctoring system with YOLO and MediaPipe
        """
        # Load configuration
        self.config = self.load_config(config_path)
        
        # Load YOLO model (using YOLOv8 with COCO pretrained weights)
        print("Loading YOLO model...")
        yolo_model_name = self.config.get('yolo', {}).get('model', 'yolov8n.pt')
        self.yolo_model = YOLO(yolo_model_name)
        
        # Initialize MediaPipe Face Detection
        print("Initializing MediaPipe Face Detection...")
        self.mp_face_detection = mp.solutions.face_detection
        mp_config = self.config.get('mediapipe', {})
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=mp_config.get('model_selection', 0),
            min_detection_confidence=mp_config.get('min_detection_confidence', 0.5)
        )
        
        # Initialize MediaPipe Face Mesh for gaze and lip detection
        print("Initializing MediaPipe Face Mesh...")
        self.mp_face_mesh = mp.solutions.face_mesh
        face_mesh_config = self.config.get('face_mesh', {})
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=face_mesh_config.get('min_detection_confidence', 0.5),
            min_tracking_confidence=face_mesh_config.get('min_tracking_confidence', 0.5)
        )
        
        # Initialize audio detection
        self.audio_enabled = self.config.get('audio', {}).get('enabled', False)
        self.audio_queue = queue.Queue()
        self.audio_thread = None
        self.speech_detected = False
        self.speech_threshold = self.config.get('audio', {}).get('speech_threshold', 0.02)
        
        if self.audio_enabled:
            print("Initializing Audio Detection...")
            self.init_audio_detection()
        
        # COCO class names for objects we want to detect
        self.coco_classes = {
            0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane',
            5: 'bus', 6: 'train', 7: 'truck', 8: 'boat', 9: 'traffic light',
            10: 'fire hydrant', 11: 'stop sign', 12: 'parking meter', 13: 'bench',
            14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 18: 'sheep', 19: 'cow',
            20: 'elephant', 21: 'bear', 22: 'zebra', 23: 'giraffe', 24: 'backpack',
            25: 'umbrella', 26: 'handbag', 27: 'tie', 28: 'suitcase', 29: 'frisbee',
            30: 'skis', 31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat',
            35: 'baseball glove', 36: 'skateboard', 37: 'surfboard', 38: 'tennis racket',
            39: 'bottle', 40: 'wine glass', 41: 'cup', 42: 'fork', 43: 'knife',
            44: 'spoon', 45: 'bowl', 46: 'banana', 47: 'apple', 48: 'sandwich',
            49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza',
            54: 'donut', 55: 'cake', 56: 'chair', 57: 'couch', 58: 'potted plant',
            59: 'bed', 60: 'dining table', 61: 'toilet', 62: 'tv', 63: 'laptop',
            64: 'mouse', 65: 'remote', 66: 'keyboard', 67: 'cell phone', 68: 'microwave',
            69: 'oven', 70: 'toaster', 71: 'sink', 72: 'refrigerator', 73: 'book',
            74: 'clock', 75: 'vase', 76: 'scissors', 77: 'teddy bear', 78: 'hair drier',
            79: 'toothbrush'
        }
        
        # Prohibited objects for exam environment (load from config)
        self.prohibited_objects = {}
        for obj_name, obj_config in self.config.get('prohibited_objects', {}).items():
            if obj_config.get('enabled', True):
                self.prohibited_objects[obj_name] = {
                    'color': tuple(obj_config.get('color', [0, 0, 255])),
                    'severity': obj_config.get('severity', 'medium')
                }
        
        # Violation tracking
        self.violations = []
        self.violation_counts = defaultdict(int)
        self.frame_count = 0
        self.start_time = datetime.now()
        
        # Face tracking
        self.face_history = []
        self.max_faces_allowed = self.config.get('detection', {}).get('max_faces_allowed', 1)
        
        # Gaze and lip tracking
        self.gaze_history = []
        self.lip_movement_history = []
        self.gaze_threshold = self.config.get('face_mesh', {}).get('gaze_threshold', 0.3)
        self.lip_movement_threshold = self.config.get('face_mesh', {}).get('lip_movement_threshold', 0.02)
        
    def detect_objects(self, frame):
        """
        Detect objects using YOLO model
        """
        results = self.yolo_model(frame, verbose=False)
        detections = []
        
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                bbox = box.xyxy[0].cpu().numpy()
                
                class_name = self.coco_classes.get(class_id, 'unknown')
                
                detections.append({
                    'class_name': class_name,
                    'class_id': class_id,
                    'confidence': confidence,
                    'bbox': bbox,
                    'is_prohibited': class_name in self.prohibited_objects
                })
        
        return detections
    
    def detect_faces(self, frame):
        """
        Detect faces using MediaPipe
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_detection.process(rgb_frame)
        
        faces = []
        if results.detections:
            for detection in results.detections:
                bbox = detection.location_data.relative_bounding_box
                h, w, _ = frame.shape
                
                # Convert relative coordinates to absolute
                x = int(bbox.xmin * w)
                y = int(bbox.ymin * h)
                width = int(bbox.width * w)
                height = int(bbox.height * h)
                
                confidence = detection.score[0]
                
                faces.append({
                    'bbox': (x, y, width, height),
                    'confidence': confidence
                })
        
        return faces
    
    def detect_gaze_and_lips(self, frame):
        """
        Detect gaze direction and lip movement using MediaPipe Face Mesh
        """
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        gaze_data = {
            'looking_away': False,
            'gaze_direction': 'center',
            'lip_movement': False,
            'mouth_open': False
        }
        
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                landmarks = face_landmarks.landmark
                
                # Eye landmarks for gaze detection
                left_eye = [landmarks[33], landmarks[133], landmarks[157], landmarks[463]]
                right_eye = [landmarks[362], landmarks[263], landmarks[386], landmarks[374]]
                
                # Calculate eye centers
                left_eye_center = np.mean([[p.x, p.y] for p in left_eye], axis=0)
                right_eye_center = np.mean([[p.x, p.y] for p in right_eye], axis=0)
                
                # Calculate gaze direction based on eye position relative to face center
                face_center = np.mean([[landmarks[i].x, landmarks[i].y] for i in range(468)], axis=0)
                gaze_vector = (left_eye_center + right_eye_center) / 2 - face_center
                
                # Determine if looking away
                if abs(gaze_vector[0]) > self.gaze_threshold:
                    gaze_data['looking_away'] = True
                    gaze_data['gaze_direction'] = 'left' if gaze_vector[0] < 0 else 'right'
                
                # Lip movement detection
                upper_lip = landmarks[13]
                lower_lip = landmarks[14]
                mouth_openness = abs(upper_lip.y - lower_lip.y)
                
                if mouth_openness > self.lip_movement_threshold:
                    gaze_data['lip_movement'] = True
                    gaze_data['mouth_open'] = True
                
                # Track lip movement over time
                self.lip_movement_history.append(mouth_openness)
                if len(self.lip_movement_history) > 30:
                    self.lip_movement_history.pop(0)
                
                # Check for sustained lip movement (speaking)
                if len(self.lip_movement_history) >= 30:
                    avg_movement = np.mean(self.lip_movement_history)
                    if avg_movement > self.lip_movement_threshold * 0.5:
                        gaze_data['lip_movement'] = True
        
        return gaze_data
    
    def init_audio_detection(self):
        """
        Initialize audio detection for speech detection
        """
        try:
            self.audio = pyaudio.PyAudio()
            self.stream = self.audio.open(
                format=pyaudio.paInt16,
                channels=1,
                rate=44100,
                input=True,
                frames_per_buffer=1024
            )
            
            # Start audio detection thread
            self.audio_thread = threading.Thread(target=self.audio_detection_loop, daemon=True)
            self.audio_thread.start()
            print("Audio detection initialized successfully")
        except Exception as e:
            print(f"Error initializing audio detection: {e}")
            self.audio_enabled = False
    
    def audio_detection_loop(self):
        """
        Continuous audio detection loop running in background thread
        """
        while self.audio_enabled:
            try:
                data = self.stream.read(1024, exception_on_overflow=False)
                audio_data = np.frombuffer(data, dtype=np.int16)
                
                # Calculate audio level (RMS)
                audio_level = np.sqrt(np.mean(audio_data**2))
                normalized_level = audio_level / 32768.0
                
                # Check if speech detected
                is_speech = normalized_level > self.speech_threshold
                self.speech_detected = is_speech
                
                # Put result in queue
                self.audio_queue.put({
                    'level': normalized_level,
                    'speech_detected': is_speech,
                    'timestamp': datetime.now().isoformat()
                })
                
                time.sleep(0.01)
            except Exception as e:
                print(f"Audio detection error: {e}")
                break
    
    def stop_audio_detection(self):
        """
        Stop audio detection and cleanup
        """
        self.audio_enabled = False
        if self.audio_thread:
            self.audio_thread.join(timeout=1)
        if hasattr(self, 'stream'):
            self.stream.stop_stream()
            self.stream.close()
        if hasattr(self, 'audio'):
            self.audio.terminate()
    
    def detect_audio_violations(self):
        """
        Check for audio violations (speech detected)
        """
        audio_violations = []
        
        if self.audio_enabled:
            try:
                # Get latest audio data
                while not self.audio_queue.empty():
                    audio_data = self.audio_queue.get()
                    
                    if audio_data['speech_detected']:
                        violation = {
                            'type': 'speech_detected',
                            'audio_level': audio_data['level'],
                            'severity': 'medium',
                            'timestamp': audio_data['timestamp']
                        }
                        audio_violations.append(violation)
                        self.violation_counts['speech_detected'] += 1
            except Exception as e:
                print(f"Error checking audio violations: {e}")
        
        return audio_violations
    
    def check_violations(self, detections, faces, gaze_data=None):
        """
        Check for violations based on detections, faces, and gaze data
        """
        current_violations = []
        
        # Check for prohibited objects
        for detection in detections:
            if detection['is_prohibited']:
                obj_name = detection['class_name']
                self.violation_counts[obj_name] += 1
                
                violation = {
                    'type': 'prohibited_object',
                    'object': obj_name,
                    'confidence': detection['confidence'],
                    'bbox': detection['bbox'],
                    'severity': self.prohibited_objects[obj_name]['severity'],
                    'timestamp': datetime.now().isoformat()
                }
                current_violations.append(violation)
        
        # Check for multiple faces
        if len(faces) > self.max_faces_allowed:
            violation = {
                'type': 'multiple_faces',
                'face_count': len(faces),
                'faces': faces,
                'severity': 'high',
                'timestamp': datetime.now().isoformat()
            }
            current_violations.append(violation)
            self.violation_counts['multiple_faces'] += 1
        
        # Check for no face (student left)
        if len(faces) == 0:
            violation = {
                'type': 'no_face',
                'severity': 'medium',
                'timestamp': datetime.now().isoformat()
            }
            current_violations.append(violation)
            self.violation_counts['no_face'] += 1
        
        # Check for gaze violations (looking away)
        if gaze_data and gaze_data.get('looking_away', False):
            violation = {
                'type': 'gaze_away',
                'direction': gaze_data.get('gaze_direction', 'unknown'),
                'severity': 'medium',
                'timestamp': datetime.now().isoformat()
            }
            current_violations.append(violation)
            self.violation_counts['gaze_away'] += 1
        
        # Check for lip movement (speaking)
        if gaze_data and gaze_data.get('lip_movement', False):
            violation = {
                'type': 'lip_movement',
                'mouth_open': gaze_data.get('mouth_open', False),
                'severity': 'medium',
                'timestamp': datetime.now().isoformat()
            }
            current_violations.append(violation)
            self.violation_counts['lip_movement'] += 1
        
        # Check for audio violations (speech detected)
        audio_violations = self.detect_audio_violations()
        current_violations.extend(audio_violations)
        
        return current_violations
    
    def load_config(self, config_path):
        """
        Load configuration from JSON file
        """
        default_config = {
            "camera": {"index": 0, "width": 1280, "height": 720, "fps": 30},
            "yolo": {"model": "yolov8n.pt", "confidence_threshold": 0.5, "iou_threshold": 0.45},
            "mediapipe": {"model_selection": 0, "min_detection_confidence": 0.5},
            "detection": {"max_faces_allowed": 1, "enable_object_detection": True, "enable_face_detection": True},
            "prohibited_objects": {},
            "output": {"display": True, "save_video": False, "video_path": "output.mp4", "save_report": True, "report_path": "violation_report.json"},
            "alerts": {"enable_sound": False, "enable_logging": True}
        }
        
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    user_config = json.load(f)
                    # Merge configs (user config overrides defaults)
                    for key, value in user_config.items():
                        if key in default_config and isinstance(default_config[key], dict):
                            default_config[key].update(value)
                        else:
                            default_config[key] = value
                print(f"Configuration loaded from {config_path}")
            except Exception as e:
                print(f"Error loading config: {e}. Using defaults.")
        else:
            print(f"Config file not found at {config_path}. Using defaults.")
        
        return default_config
    
    def draw_detections(self, frame, detections, faces, violations, gaze_data=None):
        """
        Draw detections and violations on frame
        """
        # Draw YOLO detections
        for detection in detections:
            bbox = detection['bbox'].astype(int)
            class_name = detection['class_name']
            confidence = detection['confidence']
            
            if detection['is_prohibited']:
                color = self.prohibited_objects[class_name]['color']
                label = f"PROHIBITED: {class_name} ({confidence:.2f})"
            else:
                color = (0, 255, 0)
                label = f"{class_name} ({confidence:.2f})"
            
            cv2.rectangle(frame, (bbox[0], bbox[1]), (bbox[2], bbox[3]), color, 2)
            cv2.putText(frame, label, (bbox[0], bbox[1] - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Draw MediaPipe faces
        for i, face in enumerate(faces):
            x, y, w, h = face['bbox']
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
            cv2.putText(frame, f"Face {i+1}", (x, y - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
        
        # Draw violation status
        if violations:
            status_text = f"VIOLATIONS DETECTED: {len(violations)}"
            cv2.putText(frame, status_text, (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            for i, violation in enumerate(violations):
                if violation['type'] == 'prohibited_object':
                    text = f"- {violation['object']} detected"
                elif violation['type'] == 'multiple_faces':
                    text = f"- Multiple faces: {violation['face_count']}"
                elif violation['type'] == 'no_face':
                    text = "- No face detected"
                elif violation['type'] == 'gaze_away':
                    text = f"- Looking {violation['direction']}"
                elif violation['type'] == 'lip_movement':
                    text = "- Lip movement detected"
                elif violation['type'] == 'speech_detected':
                    text = "- Speech detected"
                
                cv2.putText(frame, text, (10, 60 + i * 25),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        else:
            cv2.putText(frame, "STATUS: MONITORING", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Draw gaze and lip status
        if gaze_data:
            gaze_status = f"Gaze: {gaze_data.get('gaze_direction', 'center')}"
            lip_status = f"Lips: {'Moving' if gaze_data.get('lip_movement') else 'Still'}"
            audio_status = f"Audio: {'Speech' if self.speech_detected else 'Silent'}"
            
            cv2.putText(frame, gaze_status, (10, frame.shape[0] - 60),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)
            cv2.putText(frame, lip_status, (10, frame.shape[0] - 40),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)
            cv2.putText(frame, audio_status, (10, frame.shape[0] - 20),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)
        else:
            # Draw statistics
            stats_text = f"Faces: {len(faces)} | Objects: {len(detections)}"
            cv2.putText(frame, stats_text, (10, frame.shape[0] - 20),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        
        return frame
    
    def save_violation_report(self, output_path='violation_report.json'):
        """
        Save violation report to JSON file
        """
        report = {
            'start_time': self.start_time.isoformat(),
            'end_time': datetime.now().isoformat(),
            'total_frames': self.frame_count,
            'violation_counts': dict(self.violation_counts),
            'violations': self.violations
        }
        
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"Violation report saved to {output_path}")
    
    def run(self, camera_index=None, display=None, save_output=None, output_path=None):
        """
        Run the proctoring system
        """
        # Use config values if not specified
        camera_index = camera_index if camera_index is not None else self.config.get('camera', {}).get('index', 0)
        display = display if display is not None else self.config.get('output', {}).get('display', True)
        save_output = save_output if save_output is not None else self.config.get('output', {}).get('save_video', False)
        output_path = output_path if output_path is not None else self.config.get('output', {}).get('video_path', 'output.mp4')
        
        # Initialize video capture
        cap = cv2.VideoCapture(camera_index)
        
        if not cap.isOpened():
            print("Error: Could not open camera")
            return
        
        # Set resolution from config
        camera_config = self.config.get('camera', {})
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, camera_config.get('width', 1280))
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, camera_config.get('height', 720))
        
        # Video writer if saving output
        video_writer = None
        if save_output:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            video_writer = cv2.VideoWriter(output_path, fourcc, 20.0, (1280, 720))
        
        print("Starting proctoring system. Press 'q' to quit.")
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("Error: Could not read frame")
                    break
                
                self.frame_count += 1
                
                # Detect objects and faces
                detections = self.detect_objects(frame)
                faces = self.detect_faces(frame)
                
                # Detect gaze and lip movement
                gaze_data = self.detect_gaze_and_lips(frame)
                
                # Check for violations
                current_violations = self.check_violations(detections, faces, gaze_data)
                self.violations.extend(current_violations)
                
                # Draw results
                frame = self.draw_detections(frame, detections, faces, current_violations, gaze_data)
                
                # Display frame
                if display:
                    cv2.imshow('Proctoring System', frame)
                    
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                
                # Save frame if recording
                if save_output and video_writer:
                    video_writer.write(frame)
                
                # Print status every 30 frames
                if self.frame_count % 30 == 0:
                    print(f"Frame {self.frame_count}: Faces={len(faces)}, "
                          f"Objects={len(detections)}, Violations={len(current_violations)}")
        
        finally:
            cap.release()
            if video_writer:
                video_writer.release()
            if display:
                cv2.destroyAllWindows()
            
            # Stop audio detection
            if self.audio_enabled:
                self.stop_audio_detection()
            
            # Save violation report if enabled
            if self.config.get('output', {}).get('save_report', True):
                report_path = self.config.get('output', {}).get('report_path', 'violation_report.json')
                self.save_violation_report(report_path)
            
            print(f"\nProctoring session ended.")
            print(f"Total frames processed: {self.frame_count}")
            print(f"Total violations: {len(self.violations)}")
            print(f"Violation counts: {dict(self.violation_counts)}")

if __name__ == "__main__":
    # Create and run proctoring system
    import sys
    config_path = sys.argv[1] if len(sys.argv) > 1 else 'config.json'
    proctor = ProctoringSystem(config_path=config_path)
    proctor.run()
