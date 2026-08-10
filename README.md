![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-green)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![AI](https://img.shields.io/badge/AI-Gemini-orange)
![NLP](https://img.shields.io/badge/NLP-Sentence--BERT-purple)
![Similarity](https://img.shields.io/badge/Similarity-Cosine%20Similarity-blueviolet)
![GitHub](https://img.shields.io/badge/GitHub-Version%20Control-black)
![License](https://img.shields.io/badge/License-Educational-orange)
![Status](https://img.shields.io/badge/Status-Active%20Development-yellow)

# 🤖 AI-Based Research Proposal Evaluation System

An AI-powered **Research Proposal Evaluation System** designed to assist researchers, reviewers, and administrators in the preliminary assessment and management of research proposals.

The system provides an end-to-end workflow for submitting, processing, evaluating, comparing, reviewing, and managing research proposals.

Researchers can upload research proposals in PDF format. The backend extracts and preprocesses the proposal text, generates semantic embeddings using **Sentence-BERT**, calculates semantic similarity against previously stored proposals, evaluates the proposal using **Google Gemini**, and stores the generated results in **MongoDB Atlas**.

The frontend provides separate interfaces for:

- 🔬 Researchers
- 🧑‍⚖️ Reviewers
- 👨‍💼 Administrators

The system is designed as a **human-in-the-loop decision-support platform**. AI-generated evaluation is intended to support reviewers during preliminary assessment and should not replace expert human judgement.

---

# 📖 Project Overview

Research proposal evaluation is traditionally performed manually by domain experts.

Although human expertise is essential, manual evaluation can become time-consuming when the number of proposals increases.

Reviewers may need to:

- Read lengthy research proposals
- Identify the research problem
- Understand the proposed methodology
- Assess novelty
- Determine feasibility
- Compare proposals
- Identify potentially similar submissions
- Provide strengths and weaknesses
- Suggest improvements
- Make recommendations

The proposed system uses Artificial Intelligence and Natural Language Processing to assist with these preliminary activities.

The system combines:

- PDF document processing
- Natural Language Processing
- Sentence-BERT semantic embeddings
- Cosine similarity
- Google Gemini Large Language Model
- Automated proposal scoring
- MongoDB Atlas
- FastAPI
- React
- TypeScript
- Role-based dashboards

The system does not attempt to make autonomous funding or research approval decisions.

Instead, it follows the principle:

```text
AI Analysis
     +
Semantic Similarity
     +
Human Review
     ↓
Decision Support