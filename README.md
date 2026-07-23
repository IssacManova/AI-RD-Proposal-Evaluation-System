![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-Educational-orange)
![Status](https://img.shields.io/badge/Status-Active%20Development-yellow)

# 🤖 AI-Based Research Proposal Evaluation System

An AI-powered Research Proposal Evaluation System that automates the preliminary assessment of research proposals using Artificial Intelligence, Natural Language Processing (NLP), and Machine Learning techniques.

Researchers can securely upload research proposals in PDF format, after which the system extracts and preprocesses the proposal text for further AI-based evaluation. Upcoming modules will evaluate proposal quality, detect semantic similarity with existing proposals, and generate intelligent reviewer feedback using Large Language Models.

---

# 📖 Project Overview

Evaluating research proposals manually is often time-consuming, subjective, and inconsistent. This project aims to assist reviewers by providing an intelligent evaluation system capable of analyzing proposal content, identifying similar submissions, and generating automated evaluation reports.

The system leverages modern AI technologies including:

- Google Gemini API
- Sentence-BERT Embeddings
- FAISS Similarity Search
- XGBoost Machine Learning
- Natural Language Processing (NLP)

The objective is to improve consistency, reduce evaluation time, and support evidence-based decision-making during research proposal assessment.

---

# ✨ Current Features

## 🔐 Authentication & Security

- User Registration
- User Login
- Role-Based Access Control (Researcher, Reviewer, Admin)
- JWT Authentication
- Password Encryption using bcrypt

---

## 📄 Proposal Management

- Upload Research Proposals (PDF)
- Automatic PDF Validation
- Store Proposal Metadata
- MongoDB Atlas Integration
- Proposal Upload History

---

## 📑 PDF Processing

- Automatic PDF Text Extraction
- Text Preprocessing
- Cleaned Proposal Text Storage
- AI-Ready Proposal Dataset

---

## 🚧 AI Evaluation (In Development)

- Sentence-BERT Embedding Generation
- Semantic Similarity Detection
- FAISS Vector Search
- Google Gemini Proposal Evaluation
- Automated Proposal Scoring
- AI Reviewer Feedback
- Recommendation Generation

---

## 📊 Dashboard (Upcoming)

- Researcher Dashboard
- Reviewer Dashboard
- Admin Dashboard
- Proposal Analytics
- Evaluation Reports
- Similarity Reports

---

# 🏗️ System Workflow

```text
Researcher
      │
      ▼
Secure Login
      │
      ▼
Upload Proposal (PDF)
      │
      ▼
FastAPI Backend
      │
      ▼
MongoDB Atlas
      │
      ▼
PDF Text Extraction
      │
      ▼
Text Preprocessing
      │
      ▼
Sentence-BERT Embeddings
      │
      ▼
FAISS Similarity Detection
      │
      ▼
Gemini AI Evaluation
      │
      ▼
Proposal Score & Feedback
      │
      ▼
Reviewer Dashboard
```

---

# 🛠️ Technology Stack

## Backend

- Python 3.11
- FastAPI
- Uvicorn

## Database

- MongoDB Atlas
- PyMongo

## Authentication

- JWT
- Passlib (bcrypt)
- Python-JOSE

## AI & Machine Learning

- Google Gemini API
- Sentence Transformers (Sentence-BERT)
- FAISS
- XGBoost
- Scikit-learn
- NumPy
- Pandas

## Natural Language Processing

- PyMuPDF (fitz)
- Regular Expressions (Regex)
- Text Preprocessing

## Development Tools

- Git
- GitHub
- VS Code
- Swagger UI

---

# 📂 Project Structure

```
AI-RD-Evaluation-System
│
├── backend
│   ├── app
│   │   ├── config
│   │   ├── constants
│   │   ├── core
│   │   ├── dependencies
│   │   ├── exceptions
│   │   ├── middleware
│   │   ├── ml
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   ├── static
│   │   ├── uploads
│   │   ├── utils
│   │   └── main.py
│   │
│   ├── models_saved
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/IssacManova/AI-RD-Proposal-Evaluation-System.git

cd AI-RD-Proposal-Evaluation-System
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file inside the `backend` directory.

```env
APP_NAME=AI-RD Proposal Evaluation System
APP_VERSION=1.0.0

DEBUG=True

HOST=127.0.0.1
PORT=8000

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
DATABASE_NAME=ai_rd_evaluation

JWT_SECRET_KEY=YOUR_SECRET_KEY
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

## Run the Application

Navigate to the backend directory.

```bash
cd backend

uvicorn app.main:app --reload
```

---

## API Documentation

Swagger UI

```
http://127.0.0.1:8000/docs
```

---

# 📊 Development Progress

| Module | Status |
|---------|--------|
| Project Setup | ✅ Completed |
| MongoDB Atlas Integration | ✅ Completed |
| User Authentication | ✅ Completed |
| JWT Authentication | ✅ Completed |
| Role-Based Access Control | ✅ Completed |
| Proposal Upload | ✅ Completed |
| PDF Text Extraction | ✅ Completed |
| Text Preprocessing | ✅ Completed |
| Proposal Storage | ✅ Completed |
| Sentence-BERT Embeddings | 🚧 In Development |
| Semantic Similarity (FAISS) | 🚧 In Development |
| Google Gemini Evaluation | ⏳ Planned |
| Proposal Scoring | ⏳ Planned |
| Reviewer Dashboard | ⏳ Planned |
| Admin Dashboard | ⏳ Planned |

---

# 🎯 Planned Features

- AI Proposal Quality Scoring
- Novelty Detection
- Semantic Similarity Detection
- Duplicate Proposal Detection
- AI Reviewer Comments
- Automated Recommendation Generation
- Downloadable Evaluation Report (PDF)
- Proposal Ranking
- Email Notifications
- Reviewer Assignment
- Research Analytics Dashboard
- Cloud Deployment

---

# 👨‍💻 Author

**Issac Manova Manoharan**

Final Year Undergraduate

Faculty of Computing

University Research Project

---

# 📄 License

This project is developed solely for educational and academic research purposes as part of a Final Year Undergraduate Project.