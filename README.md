![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-blueviolet)
![License](https://img.shields.io/badge/License-Educational-orange)
![Status](https://img.shields.io/badge/Status-Active%20Development-yellow)

# 🤖 AI-Based Research Proposal Evaluation System

An AI-powered **Research Proposal Evaluation System** that automates the preliminary assessment of research proposals using **Artificial Intelligence (AI)**, **Natural Language Processing (NLP)**, **Machine Learning**, and **Large Language Models (Google Gemini)**.

Researchers can securely upload research proposals in PDF format. The system automatically extracts and preprocesses the proposal text, performs AI-based evaluation, generates structured reviewer feedback, and stores all proposal data securely in MongoDB Atlas. Future enhancements include semantic similarity detection, duplicate proposal identification, and intelligent reviewer assignment.

---

# 📖 Project Overview

Evaluating research proposals manually is often time-consuming, subjective, and inconsistent. This project provides an AI-assisted decision-support platform that helps reviewers by automatically analyzing research proposals and generating structured evaluation reports.

The system is designed to **assist reviewers**, not replace them.

The project integrates modern AI technologies including:

- Google Gemini API
- Natural Language Processing (NLP)
- Sentence-BERT Embeddings *(Upcoming)*
- FAISS Semantic Similarity *(Upcoming)*
- XGBoost Machine Learning *(Upcoming)*

The objective is to improve evaluation consistency, reduce manual effort, and provide transparent AI-assisted recommendations.

---

# ✨ Current Features

## 🔐 Authentication & Security

- User Registration
- User Login
- Role-Based Access Control
  - Researcher
  - Reviewer
  - Administrator
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

## 🤖 AI Proposal Evaluation

- Google Gemini API Integration
- Automatic Proposal Evaluation
- Proposal Summary Generation
- Novelty Score
- Methodology Score
- Feasibility Score
- Clarity Score
- AI-generated Strengths
- AI-generated Weaknesses
- AI-generated Suggestions
- Overall Recommendation
- Structured JSON Evaluation Output

---

## 🚧 AI Features (In Development)

- Sentence-BERT Embedding Generation
- Semantic Similarity Detection
- FAISS Vector Search
- Duplicate Proposal Detection
- Reviewer Recommendation Module

---

## 📊 Dashboard (Upcoming)

- Researcher Dashboard
- Reviewer Dashboard
- Administrator Dashboard
- Proposal Analytics
- Evaluation Reports
- Similarity Reports
- Proposal Statistics

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
Google Gemini AI Evaluation
      │
      ▼
Structured JSON Evaluation
      │
      ▼
Sentence-BERT Embeddings (Upcoming)
      │
      ▼
FAISS Similarity Detection (Upcoming)
      │
      ▼
Reviewer Dashboard (Upcoming)
```

---

# 🛠️ Technology Stack

## Backend

- Python 3.11
- FastAPI
- Uvicorn

---

## Database

- MongoDB Atlas
- PyMongo

---

## Authentication

- JWT
- Python-JOSE
- Passlib (bcrypt)

---

## Artificial Intelligence

### Implemented

- Google Gemini API
- JSON Structured AI Evaluation

### Planned

- Sentence Transformers (Sentence-BERT)
- FAISS
- XGBoost
- Scikit-learn

---

## Natural Language Processing

- PyMuPDF (fitz)
- Regular Expressions (Regex)
- Text Preprocessing

---

## Development Tools

- Git
- GitHub
- VS Code
- Swagger UI
- Postman

---

# 📂 Project Structure

```text
AI-RD-Evaluation-System
│
├── backend
│   │
│   ├── app
│   │   │
│   │   ├── config
│   │   ├── dependencies
│   │   ├── models
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   │   ├── evaluation_service.py
│   │   │   ├── pdf_service.py
│   │   │   ├── preprocessing.py
│   │   │   └── proposal_service.py
│   │   │
│   │   ├── utils
│   │   └── main.py
│   │
│   ├── uploads
│   │   └── proposals
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend (Upcoming)
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

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
cd backend

pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file inside the **backend** folder.

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

```bash
uvicorn app.main:app --reload
```

---

## API Documentation

Swagger UI

```text
http://127.0.0.1:8000/docs
```

---

# 📊 Sample AI Evaluation Output

```json
{
  "summary": "This proposal presents an AI-assisted research proposal evaluation platform designed to automate preliminary proposal screening while maintaining human reviewer oversight.",

  "novelty_score": 8,

  "methodology_score": 9,

  "feasibility_score": 8,

  "clarity_score": 9,

  "strengths": [
    "Well-defined research objectives",
    "Appropriate AI technologies",
    "Practical implementation plan"
  ],

  "weaknesses": [
    "Limited dataset description",
    "Evaluation metrics require expansion"
  ],

  "suggestions": [
    "Include benchmark comparisons",
    "Provide dataset statistics"
  ],

  "overall_recommendation": "Accept with Minor Revisions"
}
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
| PDF Storage | ✅ Completed |
| PDF Text Extraction | ✅ Completed |
| Text Preprocessing | ✅ Completed |
| Google Gemini AI Evaluation | ✅ Completed |
| Structured JSON Evaluation | ✅ Completed |
| AI Proposal Scoring | ✅ Completed |
| Sentence-BERT Embeddings | 🚧 In Development |
| Semantic Similarity (FAISS) | 🚧 In Development |
| Duplicate Proposal Detection | ⏳ Planned |
| Reviewer Dashboard | ⏳ Planned |
| Admin Dashboard | ⏳ Planned |
| React Frontend | ⏳ Planned |
| Cloud Deployment | ⏳ Planned |

---

# 🎯 Planned Features

- Sentence-BERT Semantic Embeddings
- FAISS Similarity Search
- Duplicate Proposal Detection
- Reviewer Recommendation System
- Proposal Ranking
- Explainable AI Dashboard
- Downloadable Evaluation Report (PDF)
- Proposal Analytics Dashboard
- Email Notifications
- Multi-language Proposal Support
- React Frontend
- Docker Containerization
- Cloud Deployment (AWS / Azure)

---

# 🚀 Future Roadmap

### Phase 1 ✅
- Authentication
- Proposal Upload
- PDF Processing
- Google Gemini Evaluation

### Phase 2 🚧
- Sentence-BERT Embeddings
- FAISS Similarity Search
- Duplicate Detection

### Phase 3 ⏳
- React Frontend
- Researcher Dashboard
- Reviewer Dashboard
- Admin Dashboard

### Phase 4 ⏳
- Report Generation
- Deployment
- Final Testing
- Performance Optimization

---

# 👨‍💻 Author

**Issac Manova Manoharan**

Final Year Undergraduate

Faculty of Computing

AI & Machine Learning Specialization

---

# 📄 License

This project is developed solely for educational and academic research purposes as part of a Final Year Undergraduate Project.