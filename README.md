![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![AI](https://img.shields.io/badge/AI-Gemini-orange)
![NLP](https://img.shields.io/badge/NLP-Sentence--BERT-purple)
![License](https://img.shields.io/badge/License-Educational-orange)
![Status](https://img.shields.io/badge/Status-Active%20Development-yellow)

# 🤖 AI-Based Research Proposal Evaluation System

An AI-powered **Research Proposal Evaluation System** designed to assist researchers and reviewers in the preliminary assessment of research proposals.

The system allows users to upload research proposals in PDF format. The backend extracts and preprocesses the proposal text, generates semantic embeddings using **Sentence-BERT**, evaluates the proposal using **Google Gemini**, calculates similarity against previously stored proposals, and stores the generated results in **MongoDB Atlas**.

The system is designed as a **decision-support tool** rather than an autonomous decision-maker. AI-generated evaluations are intended to assist human reviewers and should not replace expert judgement.

---

# 📖 Project Overview

Evaluating research proposals manually can be time-consuming and may lead to differences in interpretation between reviewers.

This project aims to provide an AI-assisted platform that can perform preliminary proposal analysis by:

- Extracting text from research proposal PDFs
- Preprocessing extracted proposal content
- Generating semantic embeddings
- Comparing proposals using semantic similarity
- Evaluating proposal quality using Google Gemini
- Producing structured evaluation scores
- Generating strengths, weaknesses, suggestions, and recommendations
- Calculating an overall proposal score and percentage
- Storing proposal information and AI-generated results in MongoDB

The system is being developed as a **human-in-the-loop research proposal evaluation platform**.

---

# 🎯 Project Objectives

The main objectives of the system are:

1. Automate the initial processing of research proposal documents.
2. Reduce the manual effort required for preliminary proposal screening.
3. Provide structured AI-assisted proposal evaluation.
4. Identify potentially similar previously submitted proposals.
5. Generate consistent preliminary evaluation criteria.
6. Provide useful feedback to researchers and reviewers.
7. Maintain proposal information and evaluation results in a centralized database.
8. Keep final research evaluation and decision-making under human control.

---

# ✨ Current Features

## 📄 1. Proposal Upload

The backend currently supports:

- Research proposal PDF upload
- Unique filename generation using UUID
- Proposal metadata storage
- Researcher email storage
- File path management
- MongoDB proposal storage

Uploaded files are stored in the backend proposal upload directory.

---

# 📑 2. PDF Text Extraction

The system extracts text from uploaded PDF documents using **PyMuPDF**.

### Current pipeline

```text
PDF File
   ↓
PDF Validation
   ↓
PyMuPDF Text Extraction
   ↓
Raw Proposal Text
```

The extracted text is stored along with the proposal information.

---

# 🧹 3. Text Preprocessing

The extracted PDF content is passed through a preprocessing service before being used by the AI components.

The preprocessing stage prepares the proposal text for:

- Semantic embedding generation
- Gemini evaluation
- Similarity comparison

---

# 🧠 4. Sentence-BERT Embeddings

The system currently uses:

```text
sentence-transformers/all-MiniLM-L6-v2
```

to generate semantic representations of proposal documents.

The model produces:

```text
384-dimensional embeddings
```

These embeddings allow proposals to be compared based on semantic meaning rather than only exact keyword matching.

### Current embedding workflow

```text
Proposal Text
      ↓
Sentence-BERT
      ↓
384-Dimensional Vector
      ↓
MongoDB Storage
```

The embedding generation has been successfully tested.

---

# 🔎 5. Proposal Similarity Detection

The system currently calculates semantic similarity between the newly uploaded proposal and previously stored proposals.

Similarity is calculated using the generated Sentence-BERT embeddings and cosine similarity.

The results include:

- Proposal ID
- Proposal title
- Similarity score
- Highest similarity score

The similarity results are sorted in descending order.

### Example

```json
{
    "title": "AI Based Research Proposal Evaluation System",
    "similarity_score": 23.46
}
```

The current implementation treats similarity as an **evidence signal** rather than a plagiarism or duplication verdict.

A high similarity score indicates that proposals may be semantically related and should be reviewed by a human.

---

# 🤖 6. Google Gemini Proposal Evaluation

The system integrates the **Google Gemini API** for AI-assisted proposal evaluation.

Gemini evaluates the extracted proposal content using a structured evaluation prompt.

The evaluation currently generates:

- Summary
- Novelty Score
- Methodology Score
- Feasibility Score
- Clarity Score
- Strengths
- Weaknesses
- Suggestions
- Overall Recommendation
- Overall Score
- Overall Percentage

### Example evaluation structure

```json
{
    "summary": "...",

    "novelty_score": 9,

    "methodology_score": 8,

    "feasibility_score": 9,

    "clarity_score": 9,

    "strengths": [
        "...",
        "...",
        "..."
    ],

    "weaknesses": [
        "...",
        "...",
        "..."
    ],

    "suggestions": [
        "...",
        "...",
        "..."
    ],

    "overall_recommendation": "...",

    "overall_score": 8.75,

    "overall_percentage": 87.5
}
```

---

# 📊 7. Overall Proposal Score

The system currently generates an overall score based on the proposal evaluation criteria.

The current evaluation criteria are:

| Criterion | Maximum |
|---|---:|
| Novelty | 10 |
| Methodology | 10 |
| Feasibility | 10 |
| Clarity | 10 |

The system also calculates:

```text
Overall Score
Overall Percentage
```

### Example

```text
Novelty       : 9/10
Methodology   : 8/10
Feasibility   : 9/10
Clarity       : 9/10

Overall Score : 8.75/10
Percentage    : 87.5%
```

The generated recommendation is provided alongside the numerical evaluation.

---

# 🗄️ 8. MongoDB Atlas Integration

Proposal information is stored in MongoDB Atlas.

The proposal record can contain:

- Proposal title
- Domain
- Filename
- File path
- Researcher email
- Upload timestamp
- Extracted text
- Gemini evaluation
- Sentence-BERT embedding
- Similarity results

### Simplified data flow

```text
Uploaded Proposal
       ↓
FastAPI Backend
       ↓
Processing Services
       ↓
Evaluation + Embedding
       ↓
MongoDB Atlas
```

---

# 🔄 System Workflow

The current backend workflow is:

```text
                    Researcher
                        │
                        ▼
                 Upload PDF
                        │
                        ▼
                 FastAPI Backend
                        │
                        ▼
              Save Proposal File
                        │
                        ▼
             PDF Text Extraction
                        │
                        ▼
              Text Preprocessing
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       Sentence-BERT          Gemini AI
         Embedding            Evaluation
              │                   │
              ▼                   ▼
       Similarity Search    Scores + Feedback
              │                   │
              └─────────┬─────────┘
                        ▼
                 MongoDB Atlas
                        │
                        ▼
              Evaluation Response
```

---

# 🏗️ Current System Architecture

```text
Frontend / Swagger UI
          │
          ▼
      FastAPI API
          │
    ┌─────┴───────────────────────┐
    │                             │
    ▼                             ▼
Proposal Service             Database Layer
    │                             │
    ▼                             ▼
PDF Service                  MongoDB Atlas
    │
    ▼
Preprocessing Service
    │
    ├───────────────┐
    ▼               ▼
Embedding       Gemini Evaluation
Service             Service
    │               │
    ▼               ▼
Similarity       Evaluation
Calculation       Results
    │               │
    └───────┬───────┘
            ▼
       Final Response
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

## Artificial Intelligence

- Google Gemini API
- Sentence Transformers
- Sentence-BERT

## Natural Language Processing

- PyMuPDF
- Text preprocessing
- Semantic embeddings
- Cosine similarity

## Development Tools

- Git
- GitHub
- Visual Studio Code
- Swagger UI

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
│   │   │   ├── database.py
│   │   │   └── settings.py
│   │   │
│   │   ├── constants
│   │   │
│   │   ├── core
│   │   │
│   │   ├── dependencies
│   │   │
│   │   ├── exceptions
│   │   │
│   │   ├── middleware
│   │   │
│   │   ├── ml
│   │   │
│   │   ├── models
│   │   │
│   │   ├── repositories
│   │   │
│   │   ├── routes
│   │   │
│   │   ├── schemas
│   │   │
│   │   ├── services
│   │   │   ├── embedding_service.py
│   │   │   ├── evaluation_service.py
│   │   │   ├── pdf_service.py
│   │   │   ├── preprocessing.py
│   │   │   ├── proposal_service.py
│   │   │   └── similarity_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── uploads
│   │   └── proposals
│   │
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/IssacManova/AI-RD-Proposal-Evaluation-System.git

cd AI-RD-Proposal-Evaluation-System
```

---

# 🐍 2. Create Virtual Environment

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

# 📦 3. Install Dependencies

Navigate to the backend directory:

```bash
cd backend
```

Then install the required packages:

```bash
pip install -r requirements.txt
```

---

# 🔐 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

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

> **Important:** Never commit `.env` files, API keys, database credentials, or other secrets to GitHub.

---

# ▶️ 5. Run the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

---

# 📚 API Documentation

FastAPI automatically provides Swagger UI.

Open:

```text
http://127.0.0.1:8000/docs
```

The proposal upload endpoint can be tested directly from Swagger UI.

---

# 🧪 Current Testing

The backend has been tested using the FastAPI Swagger interface.

The following workflow has been successfully demonstrated:

```text
PDF Upload
     ↓
Successful HTTP 200 Response
     ↓
PDF Text Extraction
     ↓
Text Preprocessing
     ↓
Sentence-BERT Embedding
     ↓
Gemini Evaluation
     ↓
Overall Score
     ↓
Overall Percentage
     ↓
Similarity Calculation
     ↓
MongoDB Storage
```

---

# 📈 Development Progress

| Module | Status |
|---|---|
| Project Setup | ✅ Completed |
| FastAPI Backend | ✅ Completed |
| MongoDB Atlas Integration | ✅ Completed |
| Proposal Upload | ✅ Completed |
| PDF Storage | ✅ Completed |
| PDF Text Extraction | ✅ Completed |
| Text Preprocessing | ✅ Completed |
| Proposal Storage | ✅ Completed |
| Sentence-BERT Embedding | ✅ Completed |
| 384-Dimensional Embedding Generation | ✅ Completed |
| Cosine Similarity Calculation | ✅ Completed |
| Proposal Similarity Results | ✅ Completed |
| Google Gemini Integration | ✅ Completed |
| Gemini Proposal Evaluation | ✅ Completed |
| Novelty Scoring | ✅ Completed |
| Methodology Scoring | ✅ Completed |
| Feasibility Scoring | ✅ Completed |
| Clarity Scoring | ✅ Completed |
| Strengths Generation | ✅ Completed |
| Weaknesses Generation | ✅ Completed |
| Suggestions Generation | ✅ Completed |
| Overall Recommendation | ✅ Completed |
| Overall Score | ✅ Completed |
| Overall Percentage | ✅ Completed |
| FAISS Vector Search | 🚧 Planned |
| XGBoost Evaluation Model | 🚧 Planned |
| Reviewer Dashboard | 🚧 Planned |
| Researcher Dashboard | 🚧 Planned |
| Admin Dashboard | 🚧 Planned |
| Evaluation Report Generation | 🚧 Planned |
| Reviewer Assignment | 🚧 Planned |
| Cloud Deployment | 🚧 Planned |

---

# 🚧 Upcoming Development

## 🔎 FAISS Vector Search

The next stage can introduce FAISS for efficient similarity retrieval when the number of stored proposals becomes large.

Current implementation:

```text
Proposal
   ↓
Sentence-BERT
   ↓
Embedding
   ↓
Cosine Similarity
   ↓
Stored Proposals
```

Future implementation:

```text
Proposal
   ↓
Sentence-BERT
   ↓
Embedding
   ↓
FAISS Index
   ↓
Nearest Neighbour Search
   ↓
Similar Proposals
```

---

# 🤖 Future AI Improvements

Future versions may include:

- Improved proposal classification
- More advanced semantic similarity
- Duplicate proposal detection
- Research topic classification
- Research domain classification
- Reviewer recommendation
- Explainable AI feedback
- Retrieval-Augmented Generation (RAG)
- Human-AI evaluation comparison
- Evaluation confidence indicators

---

# 📊 Future Dashboard

A frontend dashboard is planned to display:

### Researcher Dashboard

- Uploaded proposals
- Proposal status
- Evaluation scores
- AI feedback
- Similarity results
- Overall percentage

### Reviewer Dashboard

- Submitted proposals
- AI evaluation
- Similarity alerts
- Proposal summaries
- Reviewer comments
- Human evaluation

### Admin Dashboard

- User management
- Proposal statistics
- Reviewer management
- System analytics
- Evaluation monitoring

---

# 📄 Future Evaluation Report

The system may generate downloadable evaluation reports containing:

```text
Proposal Information
        ↓
Summary
        ↓
Novelty Score
        ↓
Methodology Score
        ↓
Feasibility Score
        ↓
Clarity Score
        ↓
Overall Score
        ↓
Overall Percentage
        ↓
Strengths
        ↓
Weaknesses
        ↓
Suggestions
        ↓
Similarity Results
        ↓
Overall Recommendation
```

---

# 🔐 Security and Responsible AI

Research proposals may contain confidential or sensitive information.

The system therefore follows a human-in-the-loop design.

AI-generated output should be treated as:

```text
AI Assistance
     ≠
Final Decision
```

The system should not independently approve, reject, or fund a research proposal without human review.

Future security improvements include:

- Secure authentication
- Role-based permissions
- API key protection
- Database access control
- Encryption
- Audit logging
- Secure file handling
- Data retention policies
- Human override mechanisms

---

# ⚠️ Important Limitations

The current system is a prototype and has several limitations.

### 1. Gemini-generated scores

AI-generated scores are model-assisted assessments and should not be considered objective scientific measurements.

### 2. Similarity score

Semantic similarity does **not** prove plagiarism or duplication.

A high similarity score may occur because:

- Two proposals address the same research problem.
- Both proposals use common technical terminology.
- One proposal extends another.
- Both proposals belong to the same research domain.

Human review is required before making a conclusion.

### 3. Training data

The current evaluation system does not rely on a large institution-specific labelled dataset.

Future machine-learning models should be validated using an appropriate authorized dataset.

### 4. PDF extraction

Scanned PDFs, images, tables, unusual layouts, or poorly encoded documents may affect text extraction quality.

---

# 📌 Current Example

A successfully evaluated proposal can produce results such as:

```text
Novelty Score       : 9/10
Methodology Score   : 8/10
Feasibility Score   : 9/10
Clarity Score       : 9/10

Overall Score       : 8.75/10
Overall Percentage  : 87.5%
```

The system can also return semantic similarity results such as:

```text
Similar Proposal
-------------------------------
Title: AI Based Research Proposal Evaluation System
Similarity: 23.46%
```

These values are generated dynamically based on the uploaded proposal and the proposals currently stored in the database.

---

# 🧭 Development Roadmap

```text
PHASE 1
Project Setup
    ↓
FastAPI
    ↓
MongoDB
    ↓
PDF Upload
    ↓
PDF Extraction
    ↓
Preprocessing
        ✅ COMPLETED


PHASE 2
Sentence-BERT
    ↓
Embedding Generation
    ↓
Cosine Similarity
    ↓
Proposal Comparison
        ✅ COMPLETED


PHASE 3
Gemini Integration
    ↓
Proposal Summary
    ↓
Evaluation Scores
    ↓
Strengths / Weaknesses
    ↓
Suggestions
    ↓
Overall Recommendation
        ✅ COMPLETED


PHASE 4
FAISS
    ↓
Efficient Similarity Search
    ↓
Large Proposal Dataset
        🚧 NEXT


PHASE 5
Frontend
    ↓
Researcher Dashboard
    ↓
Reviewer Dashboard
    ↓
Admin Dashboard
        🚧 PLANNED


PHASE 6
Advanced AI
    ↓
Classification
    ↓
Reviewer Recommendation
    ↓
Explainability
    ↓
RAG
        🚧 PLANNED


PHASE 7
Deployment
    ↓
Cloud Backend
    ↓
Production Database
    ↓
Secure Deployment
        🚧 PLANNED
```

---

# 👨‍💻 Author

**Issac Manova Manoharan**

Final Year Undergraduate

Faculty of Computing

University Research Project

---

# 📄 License

This project is developed solely for educational and academic research purposes as part of a Final Year Undergraduate Project.

---

# ⭐ Project Status

**Current Status: Backend AI Evaluation Pipeline Operational**

The current prototype successfully demonstrates:

```text
✅ PDF Upload
✅ PDF Text Extraction
✅ Text Preprocessing
✅ Sentence-BERT Embeddings
✅ Semantic Similarity
✅ Gemini AI Evaluation
✅ Structured Evaluation Scores
✅ Overall Score
✅ Overall Percentage
✅ Strengths
✅ Weaknesses
✅ Suggestions
✅ Overall Recommendation
✅ MongoDB Storage
```

The next major development stage is to improve similarity retrieval using **FAISS** and then integrate the backend with the planned frontend dashboards.