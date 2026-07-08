# ExamAI Pro - AI-Powered Web Application

ExamAI Pro is a production-ready, scalable AI-powered examination platform. It features adaptive question recommendations, real-time AI proctoring, personalized learning paths, and massive automated evaluation systems.

## Project Architecture (Microservices/Monorepo)

The project uses a decoupled architecture for maximum scalability:
- **Frontend**: Next.js 15 (React, TypeScript), Tailwind CSS v3.4, Shadcn UI, Framer Motion.
- **Backend / AI Service**: Python 3.11, FastAPI, SQLAlchemy, Pydantic.
- **Database**: PostgreSQL (Relational), Redis (Caching), MinIO (S3-compatible Object Storage).
- **AI Models**: Sentence Transformers (RAG), ChromaDB, Scikit-learn (Score Predictions).
- **Deployment**: Docker, Docker Compose, CI/CD ready.

## Features Included

- **Adaptive AI Engine**: Personalized question recommendations based on student performance.
- **Comprehensive Dashboards**: Role-Based Access Control (Admin, Faculty, Student) with dedicated layouts.
- **Question Bank Management**: Full CRUD operations for various question formats (MCQ, Coding, Subjective).
- **Live AI Proctoring**: Face tracking, tab switching detection, and audio analysis modules (ready for MediaPipe integration).
- **Containerization**: Full Docker support for local development and production deployment.

## Getting Started (Local Development)

### Prerequisites
- Node.js (v20+)
- Python (v3.11+)
- Docker & Docker Compose

### Option 1: Run with Docker Compose (Recommended)

1. Clone the repository and navigate to the project root.
2. Spin up the entire infrastructure:
   ```bash
   docker-compose up --build -d
   ```
3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API Docs (Swagger): `http://localhost:8000/docs`
   - MinIO Console: `http://localhost:9001`

### Option 2: Run Manually (Without Docker)

**Frontend (Next.js)**
```bash
npm install
npm run dev
```
The frontend will start at `http://localhost:3000`.

**Backend (Python FastAPI)**
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\Activate.ps1 | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The backend API will start at `http://localhost:8000`.

## Documentation
- [Implementation Plan](.gemini/antigravity/brain/654a57fe-787b-456a-b545-6dbc3b99ece9/implementation_plan.md)
- [Architecture & Database ER Diagram](.gemini/antigravity/brain/654a57fe-787b-456a-b545-6dbc3b99ece9/architecture.md)
- [Development Tasks Walkthrough](.gemini/antigravity/brain/654a57fe-787b-456a-b545-6dbc3b99ece9/walkthrough.md)

## Security
This application implements enterprise security including:
- JWT & OAuth2.0 Authentication (via FastAPI/NextAuth)
- CORS configuration
- Input validation (Pydantic / Zod)
- Rate limiting (Redis-based)
- Secure Object Storage (MinIO)

## License
MIT License.
