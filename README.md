# Placemux Exam Portal

Placemux Exam Portal is a full-stack, AI-powered exam and learning platform built for students, faculty, and administrators. The project combines adaptive testing, personalized study recommendations, performance analytics, AI-assisted evaluation, and real-time proctoring in a single experience.

## Overview

This repository contains:

- A modern Next.js and TypeScript frontend for the student and admin experience
- A FastAPI-based AI backend for recommendations, prediction, and evaluation
- Python scripts for training ML models and running adaptive exam simulations
- A computer-vision proctoring system using OpenCV, YOLO, and MediaPipe

The platform is designed to make online assessments smarter, more secure, and more personalized.

## Key Features

- Student dashboard with exams, practice, analytics, recommendations, and study tools
- Adaptive question flow that adjusts difficulty based on student performance
- AI-based question recommendation using embeddings and vector search
- Performance prediction for exam readiness and success probability
- AI-assisted evaluation for subjective answers
- Real-time proctoring with face detection, motion tracking, and violation detection
- Role-based experience for students, faculty, and administrators

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

### Backend and APIs
- FastAPI
- Python
- Pydantic
- Prisma
- PostgreSQL support via Prisma

### AI and Machine Learning
- scikit-learn
- joblib
- sentence-transformers
- ChromaDB
- pandas and NumPy

### Proctoring
- OpenCV
- YOLOv8
- MediaPipe
- PyAudio

## Project Structure

- Fullstack/ - main web application frontend and backend services
- Proctoring/ - webcam-based proctoring system
- data/ - question dataset used for training and testing
- models/ - trained ML model artifacts
- api.py - Python API for question difficulty prediction and adaptive exam flow
- recommend.py - adaptive test simulator logic
- train_model.py - model training pipeline
- evaluate.py - evaluation/reporting utilities

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Placemux-exam-portal
```

### 2. Set up Python environment

```bash
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install -r Fullstack/backend/requirements.txt
```

### 3. Train the difficulty model

```bash
python train_model.py
```

This creates the model artifacts used by the prediction and recommendation modules.

### 4. Run the AI backend

```bash
cd Fullstack/backend
uvicorn main:app --reload
```

### 5. Run the frontend

```bash
cd Fullstack
npm install
npm run dev
```

Then open the local Next.js app in your browser.

## Notes

- Some AI features may require downloading models on first run, so the initial startup may take a little longer.
- The proctoring module depends on webcam and computer vision libraries, so it works best in a local development environment with camera access.
- The current version is intended for learning, prototyping, and academic demo purposes.

## Purpose

Placemux Exam Portal aims to demonstrate how modern web development, machine learning, and computer vision can work together to create an intelligent assessment platform that supports both learning and integrity.
