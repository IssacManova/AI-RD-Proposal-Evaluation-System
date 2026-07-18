![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-Educational-orange)

# 🤖 AI R&D Proposal Evaluation System

An AI-powered Research & Development (R&D) Proposal Evaluation System that automatically evaluates research proposals using Natural Language Processing (NLP), Machine Learning, and Large Language Models (LLMs).

The system enables researchers to upload research proposals in PDF format, automatically extracts and analyzes the content, compares it with existing proposals, and generates intelligent evaluation reports and recommendations.

---

## 📖 Project Overview

Research proposal evaluation is traditionally a manual, time-consuming process that may be affected by inconsistency and human bias.

This project automates the evaluation process using Artificial Intelligence techniques including:

- Sentence-BERT Embeddings
- FAISS Similarity Search
- Google Gemini AI
- XGBoost Prediction Model

The system provides fast, consistent, and intelligent evaluations while assisting reviewers in decision-making.

---

## 🚀 Features

### ✅ User Authentication
- User Registration
- User Login
- JWT Authentication
- Password Encryption (bcrypt)

### ✅ Proposal Management
- Upload PDF Research Proposals
- Store Proposal Metadata
- MongoDB Database Integration

### 🚧 AI Evaluation (In Progress)
- PDF Text Extraction
- Text Preprocessing
- Sentence-BERT Embeddings
- Similarity Detection using FAISS
- AI Evaluation using Google Gemini
- Proposal Quality Prediction using XGBoost

### 🚧 Dashboard (Upcoming)
- Proposal Statistics
- Similarity Scores
- AI Evaluation Report
- Recommendation Dashboard

---

## 🏗️ System Architecture

```
Researcher
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
Sentence-BERT Embeddings
      │
      ▼
FAISS Similarity Search
      │
      ▼
Gemini AI Evaluation
      │
      ▼
XGBoost Prediction
      │
      ▼
Evaluation Dashboard
```

---

## 🛠️ Technology Stack

### Backend
- FastAPI
- Python 3.11

### Database
- MongoDB Atlas
- PyMongo

### AI & Machine Learning
- Sentence Transformers
- FAISS
- Google Gemini API
- XGBoost
- Scikit-learn

### Authentication
- JWT
- Passlib (bcrypt)

### PDF Processing
- PyMuPDF (fitz)

### Development Tools
- Git
- GitHub
- Swagger UI
- Uvicorn

---

## 📂 Project Structure

```
AI-RD-Evaluation-System/
│
├── backend/
│   ├── app/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── ml/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── uploads/
│   │   └── proposals/
│   │
│   ├── requirements.txt
│   └── .env
│
├── dataset/
│
├── documentation/
│
├── reports/
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/IssacManova/AI-RD-Proposal-Evaluation-System.git

cd AI-RD-Proposal-Evaluation-System/backend
```

---

### Create Virtual Environment

```bash
python -m venv venv
```

Activate:

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Configure Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
APP_NAME=AI-RD Proposal Evaluation System
APP_VERSION=1.0.0

DEBUG=True

HOST=127.0.0.1
PORT=8000

MONGODB_URI=your_mongodb_connection_string

DATABASE_NAME=ai_rd_evaluation

JWT_SECRET_KEY=your_secret_key

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

GEMINI_API_KEY=your_gemini_api_key
```

---

### Run the Application

```bash
uvicorn app.main:app --reload
```

API Documentation

```
http://127.0.0.1:8000/docs
```

---

## 📊 Current Progress

| Module | Status |
|---------|--------|
| Project Structure | ✅ Completed |
| MongoDB Integration | ✅ Completed |
| Authentication | ✅ Completed |
| JWT Security | ✅ Completed |
| Proposal Upload | ✅ Completed |
| PDF Text Extraction | 🚧 In Progress |
| Sentence-BERT | ⏳ Planned |
| FAISS Similarity | ⏳ Planned |
| Gemini AI Evaluation | ⏳ Planned |
| XGBoost Prediction | ⏳ Planned |
| Dashboard | ⏳ Planned |

---

## 🎯 Future Improvements

- Research Proposal Versioning
- Reviewer Assignment Module
- AI Chat Assistant
- Email Notifications
- Advanced Analytics Dashboard
- Multi-language Proposal Support
- Cloud Deployment

---

## 👨‍💻 Author

**Issac Manova Manoharan**

Final Year Undergraduate

Faculty of Computing

---

## 📄 License

This project is developed for educational and research purposes as part of a Final Year Undergraduate Project.
