<div align="center">

# 🤖 AI-Based Research Proposal Evaluation System

<p align="center">
  <strong>An Intelligent Human-in-the-Loop Decision Support System for Research Proposal Assessment</strong>
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation--getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-role-based-workflows">User Roles</a>
</p>

---

<!-- BADGES SECTION -->
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
<br/>
![IEEE Standard](https://img.shields.io/badge/IEEE-Standard_Validation-00629B?style=for-the-badge&logo=ieee&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-LLM-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-Sentence--BERT-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-00599C?style=for-the-badge&logo=facebook&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-orange?style=for-the-badge)

---

</div>

## 📖 Project Overview

Evaluating academic and industrial research proposals is traditionally a manual, time-intensive process requiring extensive domain expertise. As submission volumes grow, peer reviewers and funding committees face significant bottlenecks in assessing novelty, methodological rigor, budget feasibility, structural compliance, and overlap with existing literature.

The **AI-Based Research Proposal Evaluation System** solves this challenge by serving as an advanced **Human-in-the-Loop Decision Support Platform**. It integrates Natural Language Processing (NLP), Deep Learning semantic vector embeddings (**Sentence-BERT** & **FAISS**), Generative AI (**Google Gemini**), rule-based **IEEE Standard Format Validation**, and real-time **Researcher Notifications** to preprocess PDF research proposals, check structural compliance, detect similarity, score proposal dimensions, and assist reviewers and administrators.

> [!IMPORTANT]  
> **Human-in-the-Loop Philosophy**: This platform is designed to assist and empower reviewers and administrators. It does **not** replace expert human judgment or make autonomous funding decisions.

---

## 🔥 Key Features

- 📄 **Automated PDF Parsing & Extraction**: Uses PyMuPDF (`fitz`) and SpaCy text cleaning pipelines to dynamically ingest research documents and parse title, abstract, problem statement, methodology, expected outcomes, budget, and timeline.
- 📘 **IEEE Standard Format Validation**: High-performance rule-based validation engine checking uploaded PDF proposals against 8 IEEE Standard sections:
  - IEEE Abstract
  - IEEE Index Terms / Keywords
  - IEEE Section I: Introduction & Motivation
  - Problem Statement & Research Definition
  - IEEE Section II: Literature Review / Related Work
  - IEEE Section III: Proposed Methodology & System Architecture
  - IEEE Section IV: Expected Outcomes & Discussion
  - IEEE References & In-text Citations (`[1]`, `[2]`).
- 🔔 **Real-Time Researcher Review Notifications**: Automatically notifies researchers when expert reviewers evaluate proposals, featuring an interactive top Navbar notification bell, unread badge counter, popover dropdown list, and one-click navigation to proposal detail views.
- 🧬 **Sentence-BERT Semantic Embeddings**: Converts raw proposal text into high-dimensional dense vector embeddings using `sentence-transformers` to capture deeper conceptual meaning beyond simple keyword searches.
- 🔍 **Vector Similarity & Overlap Detection**: Powered by **FAISS** and Cosine Similarity to compare incoming proposals against previously stored proposals in MongoDB Atlas, flagging potential duplication or overlapping research.
- 💡 **Google Gemini Multi-Criteria LLM Evaluator**: Generates structured, multi-dimensional scorecards assessing:
  - 🌟 **Novelty & Innovation**
  - 🔬 **Scientific Methodology**
  - ⚡ **Feasibility & Execution Risk**
  - 💰 **Budget Realism**
  - 📈 **Potential Impact**
  - 📝 **Qualitative Feedback** (Strengths, Weaknesses, Constructive Recommendations).
- 📑 **Comprehensive PDF Report Generation**: Allows researchers, reviewers, and administrators to download full PDF evaluation reports containing Proposal Overview, AI Multi-Criteria Evaluation, Human Expert Review, Semantic Similarity Analysis, and IEEE Format Check results.
- 👥 **Role-Based Access Control (RBAC)**: Custom dashboard interfaces engineered specifically for three distinct user roles (Researchers, Reviewers, Administrators).
- 🔐 **Secure Auth & Self-Service Password Management**: JWT Bearer token authentication with bcrypt password hashing, auth splash rehydration, and self-service password update endpoint.
- 📊 **Dynamic Analytics Dashboards**: Interactive charts built with `Recharts` displaying evaluation metric breakdowns, score distributions, and proposal status transitions.

---

## 🏗️ System Architecture

```text
[ Researcher / User ] ──► Upload PDF Proposal
                               │
                               ▼
        ┌───────────────────────────────────────────┐
        │        FastAPI Backend Processing         │
        └───────────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
 [ PyMuPDF & SpaCy ]   [ IEEE Validator ]    [ Sentence-BERT ]
Text Extraction & NLP  8-Section IEEE Check  Dense Vector Embeddings
         │                     │                     │
         ▼                     ▼                     ▼
[ Google Gemini AI ]  [ PDF Report Engine ] [ FAISS Vector Index ]
Multi-criteria LLM    Comprehensive Reports Cosine Similarity Check
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
                      [ MongoDB Atlas ]
         Stored Proposals, Reviews & Notifications
                               │
                               ▼
        ┌───────────────────────────────────────────┐
        │   Role-Based React + TypeScript Frontend  │
        │   (Researcher | Reviewer | Admin Views)   │
        └───────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend Framework & AI Engine
| Technology | Role |
| :--- | :--- |
| **Python 3.11+** | Core Backend Programming Language |
| **FastAPI** | High-performance Asynchronous REST API Framework |
| **Google Gemini API** | Large Language Model (LLM) for Deep Qualitative Proposal Evaluation |
| **IEEE Standard Engine** | Rule-Based Regex Validator for IEEE Section & Citation Compliance |
| **Sentence-Transformers** | Sentence-BERT model (`all-MiniLM-L6-v2`) for Semantic Embeddings |
| **FAISS & Scikit-Learn** | Fast Vector Indexing & Cosine Similarity Computation |
| **PyMuPDF & SpaCy** | PDF Document Parsing, Text Extraction, and NLP Preprocessing |
| **MongoDB Atlas (Motor / PyMongo)** | Cloud NoSQL Database for Proposals, Users, Reviews & Notifications |
| **Passlib & Python-Jose** | Password Hashing (Bcrypt) & JWT Token Authentication |

### Frontend Application
| Technology | Role |
| :--- | :--- |
| **React 19** | Modern Component-based UI Library |
| **TypeScript 5.8+** | Type-safe Application Development |
| **Vite 5+** | Next-generation Frontend Tooling & Fast HMR |
| **Tailwind CSS 3.4+** | Utility-first Modern Responsive Styling System |
| **Recharts** | Interactive Analytics & Evaluation Data Visualization |
| **Lucide React** | Sleek & Consistent Iconography |
| **React Hot Toast** | Real-time User Notification System |
| **Axios** | HTTP Client for API Communications |

---

## 👥 Role-Based Workflows

### 🔬 1. Researcher Dashboard
- **Proposal Submission**: Upload research proposal PDFs along with metadata (Title, Domain, Abstract, Keywords).
- **IEEE Format Inspection**: View real-time IEEE Standard Format compliance breakdown (sections found, missing required headings, citation checks).
- **Track Status & Notifications**: Monitor proposal lifecycle and receive instant header notifications when reviewers submit evaluations.
- **AI Score & Download Reports**: Access multi-criteria scorecards, similarity score alerts, reviewer scores, and export PDF evaluation reports.

### 🧑‍⚖️ 2. Reviewer Dashboard
- **Assigned Proposals**: Access proposals specifically delegated by Administrators.
- **IEEE Format & Similarity Insight**: Inspect IEEE structural validation alongside Sentence-BERT similarity match percentages.
- **Human Assessment**: Submit final reviewer scores, qualitative notes, decision recommendations, and revision requests.

### 👨‍💼 3. Administrator Dashboard
- **Executive Analytics**: Global project status tracking, average evaluation scores, and domain breakdowns.
- **Proposal Management & Format Filtering**: Filter proposals by AI status, review status, or IEEE Format Issues (`All`, `Valid`, `Issues`).
- **User Management**: Manage user registrations, assign role permissions (`Researcher`, `Reviewer`, `Admin`), and toggle active status.

---

## 📁 Repository Directory Structure

```text
AI-RD-Evaluation-System/
├── backend/                      # FastAPI Python Backend
│   ├── app/                      # Main Application Package
│   │   ├── config/               # DB Connection & App Environment Settings
│   │   ├── dependencies/         # Auth & Role Guards
│   │   ├── ml/                   # Sentence-BERT Embedding & FAISS Engine
│   │   ├── routes/               # API Endpoints (Auth, Proposals, Evaluation, Notifications, Users)
│   │   ├── schemas/              # Pydantic Request & Response Schemas
│   │   ├── services/             # Gemini AI, IEEE Format Checker, Notifications & Proposal Services
│   │   ├── utils/                # PDF Extraction & SpaCy Text Preprocessing
│   │   └── main.py               # FastAPI App Initialization
│   ├── create_admin.py           # Admin User Initialization Script
│   ├── requirements.txt          # Python Dependencies
│   └── .env                      # Backend Environment Variables
├── frontend/                     # React + TypeScript Frontend
│   ├── src/                      # Frontend Application Source Code
│   │   ├── api/                  # Axios API Clients (Auth, Proposals, Evaluation, Notifications, Users)
│   │   ├── components/           # Reusable UI Components (Navbar, NotificationBell, Cards, Modals)
│   │   ├── context/              # React Context (Auth State)
│   │   ├── pages/                # Role-Based Page Views (Admin, Reviewer, Researcher, Public, 404)
│   │   ├── utils/                # PDF Report Generator (`generateReport.ts`) & Formatters
│   │   └── App.tsx               # Main Application Router
│   ├── package.json              # Node.js Dependencies & Scripts
│   ├── tailwind.config.js        # Tailwind CSS Configuration
│   └── vite.config.ts            # Vite Build Tool Configuration
├── dataset/                      # Sample Proposals & Research Data
├── documentation/              # Architecture Diagrams & Project Specs
└── README.md                     # Root System Documentation
```

---

## 🚀 Installation & Getting Started

### Prerequisites
- **Python**: Version 3.11 or higher
- **Node.js**: Version 18.x or higher (with `npm`)
- **MongoDB**: Active MongoDB Atlas Cluster or local MongoDB instance
- **Google Gemini API Key**: API key for Gemini LLM access

---

### 1. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - *Windows (PowerShell)*:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - *Linux / macOS*:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   APP_NAME="AI-RD Proposal Evaluation System"
   APP_VERSION="1.0.0"
   DEBUG=True
   HOST="127.0.0.1"
   PORT=8000
   MONGODB_URI="your_mongodb_connection_string"
   DATABASE_NAME="ai_rd_evaluation"
   JWT_SECRET_KEY="your_secure_jwt_secret_key"
   JWT_ALGORITHM="HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```

5. **Initialize Admin User**:
   ```bash
   python create_admin.py
   ```

6. **Start Backend Server**:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   The backend interactive Swagger documentation will be available at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

4. **Start Vite Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🔌 API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Register a new user (`researcher`, `reviewer`, `admin`) | ❌ |
| `POST` | `/auth/login` | Authenticate user & obtain JWT Access Token | ❌ |
| `POST` | `/auth/change-password` | Update current user account password | ✅ |
| `POST` | `/proposal/upload` | Upload PDF proposal & parse content + IEEE check | ✅ (Researcher) |
| `GET` | `/proposal/all` | List all proposals (Admin & Reviewer) | ✅ (Admin/Reviewer) |
| `GET` | `/proposal/my-proposals` | List researcher's own proposals | ✅ (Researcher) |
| `POST` | `/proposal/{id}/evaluate` | Re-evaluate AI for single proposal | ✅ |
| `POST` | `/evaluation/{id}/review` | Submit human reviewer score & decision (Triggers Notification) | ✅ (Reviewer/Admin) |
| `GET` | `/notifications/my-notifications` | Fetch user notifications & unread counter | ✅ |
| `PUT` | `/notifications/{id}/read` | Mark single notification as read | ✅ |
| `PUT` | `/notifications/mark-all-read` | Mark all notifications as read | ✅ |
| `GET` | `/users/` | List all system users (Admin only) | ✅ (Admin) |
| `PUT` | `/users/{id}/role` | Update user role or active status | ✅ (Admin) |
| `GET` | `/health` | Server Health Status Check | ❌ |

---

## 🛡️ License

This project is developed for educational and academic research purposes as a Final Year Project.

---

<div align="center">
  <p>Built with ❤️ using FastAPI, React, Sentence-BERT, IEEE Standard Validation & Google Gemini AI</p>
</div>