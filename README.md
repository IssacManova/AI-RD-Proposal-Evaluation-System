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
🎯 Problem Statement

Research proposal evaluation involves multiple qualitative and quantitative criteria.

Manual evaluation can result in:

High reviewer workload
Long evaluation time
Inconsistent interpretation
Difficulty comparing large numbers of proposals
Difficulty identifying semantically related proposals
Repetitive feedback generation
Difficulty maintaining centralized evaluation records

The AI-Based Research Proposal Evaluation System aims to address these challenges by providing an AI-assisted platform for preliminary proposal analysis.

The system automates document processing and provides structured AI-generated evaluation while retaining human reviewers as the final decision-makers.

🎯 Project Objectives

The main objectives of the project are:

Develop a centralized research proposal evaluation platform.
Allow researchers to securely upload proposals in PDF format.
Automatically extract text from uploaded proposal documents.
Preprocess extracted proposal content.
Generate semantic representations using Sentence-BERT.
Calculate semantic similarity between proposals.
Identify potentially related or overlapping proposals.
Evaluate proposal quality using Google Gemini.
Generate structured proposal evaluation scores.
Generate proposal summaries.
Generate strengths and weaknesses.
Generate improvement suggestions.
Generate an overall recommendation.
Calculate an overall proposal score.
Calculate an overall percentage.
Store proposal information and AI results in MongoDB Atlas.
Provide separate interfaces for researchers, reviewers, and administrators.
Support human-in-the-loop evaluation.
Maintain separation between AI-generated evaluation and human review.
Provide a foundation for future advanced research-management features.
✨ System Features
🔐 1. Authentication and Role-Based Access

The system supports multiple user roles.

Current roles include:

Researcher
Reviewer
Administrator

Each role has access to different parts of the application.

The system is designed so that users can only access functionality appropriate to their assigned role.

🔬 2. Researcher Module

Researchers can use the platform to manage their research proposals.

The researcher interface includes functionality for:

Researcher login
Researcher dashboard
Proposal submission
PDF upload
Proposal history
Proposal details
AI evaluation results
Similarity information
Proposal status
Researcher profile

The researcher can submit a proposal and monitor its evaluation through the platform.

🧑‍⚖️ 3. Reviewer Module

The reviewer interface is designed for authorized reviewers who are responsible for examining submitted proposals.

Reviewer functionality includes:

Reviewer dashboard
Proposal listing
Proposal details
AI-generated evaluation
Similarity information
Proposal summary
AI-generated strengths
AI-generated weaknesses
AI-generated suggestions
Human evaluation
Reviewer comments
Review decision
Reviewer profile

The reviewer can use AI-generated information as supporting evidence before performing an independent assessment.

👨‍💼 4. Administrator Module

The administrator interface provides system-level management and monitoring.

Administrator functionality includes:

Administrator dashboard
User statistics
Proposal statistics
Evaluation statistics
User management
Proposal management
Research-domain statistics
System monitoring
Administrator profile

The administrator provides centralized oversight of the application.

📄 5. Proposal Upload

Researchers can upload research proposal documents in PDF format.

The proposal upload process includes:

PDF file selection
Proposal title
Research domain
Researcher email
File validation
Unique filename generation
File storage
Proposal metadata storage

Uploaded files are assigned a UUID-based filename.

Example:

Original File:
AI Research Proposal.pdf

Stored File:
b4813d65-a991-4c91-b615-4f276ed66cbc.pdf

This prevents filename conflicts between uploaded documents.

📑 6. PDF Text Extraction

The system extracts text from uploaded PDF documents using PyMuPDF.

The current processing pipeline is:

PDF File
    ↓
PDF Upload
    ↓
PDF Text Extraction
    ↓
Raw Proposal Text

The extracted text is then passed to the preprocessing stage.

🧹 7. Text Preprocessing

The extracted PDF text is passed through the preprocessing service.

The purpose of preprocessing is to prepare the content for downstream AI and NLP operations.

The processed text is used by:

Sentence-BERT
Gemini evaluation
Similarity comparison

The cleaned text is also stored with the proposal record.

🧠 8. Sentence-BERT Semantic Embeddings

The system currently uses:

sentence-transformers/all-MiniLM-L6-v2

to generate semantic representations of proposal documents.

The model generates:

384-dimensional embeddings

The embedding process is:

Proposal Text
      ↓
Sentence-BERT
      ↓
384-Dimensional Vector
      ↓
Stored Proposal Representation

The embedding generation functionality has been successfully tested.

Example:

Embedding generated successfully!

Embedding dimensions: 384
🔎 9. Semantic Similarity Detection

The system calculates semantic similarity between the newly uploaded proposal and previously stored proposal embeddings.

Similarity is based on semantic representations rather than simple keyword matching.

The current approach uses:

Sentence-BERT Embeddings
          ↓
Cosine Similarity
          ↓
Similarity Score

The system can identify proposals that may be semantically related even when they use different terminology.

For example:

Proposal A:
Machine Learning for Underground Mining Safety

Proposal B:
Data-Driven Occupational Risk Prediction
in Underground Mining Environments

The wording is different, but the underlying research concepts may be related.

Semantic embeddings allow the system to identify this relationship.

📊 10. Similarity Score

The similarity result can contain information such as:

Proposal title
Proposal identifier
Similarity score
Highest similarity score
Related proposal information

Example:

{
    "title": "AI Based Research Proposal Evaluation System",
    "similarity_score": 23.46
}

Similarity results can be presented in descending order.

Example:

Similar Proposal 1    → 23.46%
Similar Proposal 2    → 18.72%
Similar Proposal 3    → 11.35%
⚠️ 11. Similarity Interpretation

A similarity score is an evidence signal and should not automatically be interpreted as plagiarism.

High similarity may occur because:

Two proposals address the same research problem.
Both proposals use common technical terminology.
Both proposals belong to the same research domain.
One proposal extends existing research.
Similar methodologies are used.

Therefore:

High Similarity
      ≠
Automatic Plagiarism Verdict

The final interpretation should be performed by an authorized human reviewer.

🤖 12. Google Gemini AI Evaluation

The system integrates the Google Gemini API for AI-assisted research proposal evaluation.

The extracted and preprocessed proposal text is passed to the Gemini evaluation service.

The AI evaluates the proposal according to predefined criteria.

The evaluation currently generates:

Summary
Novelty Score
Methodology Score
Feasibility Score
Clarity Score
Strengths
Weaknesses
Suggestions
Overall Recommendation
Overall Score
Overall Percentage
📋 13. Structured AI Evaluation

The AI evaluation follows a structured format.

Example:

{
    "summary": "Summary of the submitted research proposal.",

    "novelty_score": 8,

    "methodology_score": 7,

    "feasibility_score": 8,

    "clarity_score": 9,

    "strengths": [
        "Clear research objective",
        "Appropriate methodology",
        "Relevant research problem"
    ],

    "weaknesses": [
        "Limited experimental validation",
        "Further implementation details are required"
    ],

    "suggestions": [
        "Provide measurable evaluation metrics",
        "Expand the experimental methodology"
    ],

    "overall_recommendation": "Accept with minor revisions",

    "overall_score": 8.0,

    "overall_percentage": 80.0
}

The exact values depend on the uploaded proposal and the generated AI evaluation.

📊 14. Evaluation Criteria

The current evaluation uses four primary criteria.

Criterion	Maximum Score
Novelty	10
Methodology	10
Feasibility	10
Clarity	10

The system generates an overall score from these evaluation criteria.

🧮 15. Overall Score

The system provides a consolidated overall proposal score.

Example:

Novelty       : 9/10
Methodology   : 8/10
Feasibility   : 9/10
Clarity       : 9/10
--------------------------------
Overall Score : 8.75/10

The overall score provides a single numerical representation of the AI-assisted evaluation.

📈 16. Overall Percentage

The system also converts the overall evaluation into a percentage.

Example:

Overall Score      : 8.75/10
Overall Percentage : 87.5%

This makes the evaluation easier to interpret in dashboards and reports.

The percentage is generated from the evaluation scores and should be treated as an AI-assisted assessment rather than an objective scientific measurement.

💪 17. Strengths Generation

Gemini identifies positive aspects of the submitted proposal.

Examples may include:

- Clear research objective
- Relevant problem statement
- Appropriate technical approach
- Practical implementation plan

These strengths are displayed as structured feedback.

⚠️ 18. Weakness Generation

The AI also identifies potential weaknesses.

Examples may include:

- Insufficient experimental validation
- Limited dataset description
- Missing implementation details
- Incomplete evaluation methodology

These weaknesses help researchers understand areas that may require improvement.

💡 19. Suggestions Generation

The system provides AI-generated suggestions for improving the proposal.

Examples:

- Define measurable research objectives.
- Provide additional implementation details.
- Include appropriate evaluation metrics.
- Expand the methodology section.

The suggestions are intended as guidance rather than mandatory instructions.

📝 20. Overall Recommendation

The AI provides an overall recommendation based on the proposal evaluation.

Possible recommendations may include:

Accept
Accept with minor revisions
Revise and resubmit
Reject

The recommendation is advisory.

The final decision remains with the authorized human reviewer or institution.

🧑‍⚖️ 21. Human-in-the-Loop Evaluation

The system follows a human-in-the-loop architecture.

The AI does not replace the reviewer.

Instead:

Research Proposal
       ↓
AI Evaluation
       ↓
Similarity Analysis
       ↓
Reviewer Examination
       ↓
Human Evaluation
       ↓
Final Human Decision

This approach is particularly important because research evaluation involves domain knowledge and institutional judgement.

🔄 22. AI Evaluation vs Human Review

The system is designed to keep AI-generated evaluation separate from human review.

AI Evaluation
AI Summary
AI Novelty Score
AI Methodology Score
AI Feasibility Score
AI Clarity Score
AI Overall Score
AI Percentage
AI Strengths
AI Weaknesses
AI Suggestions
AI Recommendation
Human Review
Reviewer Score
Reviewer Comments
Reviewer Decision
Reviewer Information
Review Timestamp

The AI score should not overwrite the human score.

Similarly, the human review should not modify the original AI-generated evaluation.

This allows future comparison between:

AI Assessment
       vs
Human Assessment
🗄️ 23. MongoDB Atlas Integration

The system uses MongoDB Atlas for persistent data storage.

Proposal information is stored in a MongoDB collection.

The proposal record can contain:

Title
Domain
Filename
File Path
Researcher Email
Uploaded At
Extracted Text
AI Evaluation
Embedding
Similarity Information
Human Review
📦 24. Proposal Data Flow

The proposal processing flow is:

Uploaded PDF
      ↓
FastAPI
      ↓
Proposal Service
      ↓
PDF Service
      ↓
Text Preprocessing
      ↓
       ┌─────────────────────┐
       │                     │
       ▼                     ▼
Sentence-BERT           Gemini AI
       │                     │
       ▼                     ▼
Embedding              Evaluation
       │                     │
       ▼                     ▼
Similarity              AI Scores
       │                 & Feedback
       └──────────┬──────────┘
                  ▼
             MongoDB Atlas
🔄 25. Complete Proposal Processing Workflow

The current backend workflow is:

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
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
      Sentence-BERT           Gemini AI
        Embedding              Evaluation
             │                     │
             ▼                     ▼
      Semantic Vector         AI Evaluation
             │                     │
             ▼                     ▼
       Similarity Score       Scores + Feedback
             │                     │
             └──────────┬──────────┘
                        ▼
                  MongoDB Atlas
                        │
                        ▼
                Frontend Dashboard
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
      Researcher      Reviewer      Admin
       Interface     Interface    Interface
🏗️ 26. System Architecture

The current system architecture consists of frontend, backend, AI services, NLP services, and database components.

┌────────────────────────────────────────────────────┐
│                    FRONTEND                        │
│                                                    │
│                React + TypeScript                  │
│                                                    │
│  Researcher │ Reviewer │ Administrator             │
└───────────────────────┬────────────────────────────┘
                        │
                        │ REST API
                        ▼
┌────────────────────────────────────────────────────┐
│                    FASTAPI                         │
│                    BACKEND                         │
│                                                    │
│ Authentication                                     │
│ Proposal Management                                │
│ PDF Processing                                     │
│ AI Evaluation                                      │
│ Embedding Generation                               │
│ Similarity Analysis                                │
│ Human Review                                       │
└──────────────┬──────────────────┬──────────────────┘
               │                  │
               ▼                  ▼
       ┌───────────────┐   ┌────────────────┐
       │ MongoDB Atlas │   │ AI / NLP Layer │
       └───────────────┘   └───────┬────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
             Sentence-BERT                  Google Gemini
                    │                             │
                    ▼                             ▼
             Embeddings                   AI Evaluation
                    │
                    ▼
             Cosine Similarity
🧩 27. Backend Service Architecture

The backend is organized into separate services.

backend/app
│
├── config
│
├── models
│
├── routes
│
├── schemas
│
├── repositories
│
├── services
│   │
│   ├── pdf_service.py
│   ├── preprocessing.py
│   ├── embedding_service.py
│   ├── similarity_service.py
│   ├── evaluation_service.py
│   └── proposal_service.py
│
└── main.py

Each service has a specific responsibility.

📄 28. PDF Service

The PDF service is responsible for extracting text from uploaded PDF files.

PDF
 ↓
PyMuPDF
 ↓
Raw Text
🧹 29. Preprocessing Service

The preprocessing service prepares extracted text before it is passed to AI and NLP components.

Raw Extracted Text
       ↓
Preprocessing
       ↓
Clean Text

The cleaned text is used by both:

Sentence-BERT
Gemini
🧠 30. Embedding Service

The embedding service loads the Sentence-BERT model and generates proposal embeddings.

Current model:

sentence-transformers/all-MiniLM-L6-v2

Output:

384-dimensional vector

The vector is stored with the proposal record.

🔎 31. Similarity Service

The similarity service compares proposal embeddings.

Current conceptual flow:

New Proposal Embedding
        ↓
Compare with Stored Embeddings
        ↓
Cosine Similarity
        ↓
Similarity Scores
        ↓
Ranked Similar Proposals

Future versions can use FAISS for large-scale vector retrieval.

🤖 32. Evaluation Service

The evaluation service integrates Google Gemini.

The service:

Receives cleaned proposal text.
Processes the evaluation input.
Creates a structured evaluation prompt.
Sends the prompt to Gemini.
Receives the generated evaluation.
Parses the structured result.
Returns the evaluation to the proposal service.

The resulting evaluation is stored with the proposal.

🗂️ 33. Proposal Service

The proposal service coordinates the complete proposal-processing workflow.

Conceptually:

save_proposal()
      │
      ├── Save PDF
      │
      ├── Extract Text
      │
      ├── Preprocess Text
      │
      ├── Generate Embedding
      │
      ├── Generate Gemini Evaluation
      │
      ├── Calculate Similarity
      │
      ├── Create Proposal Record
      │
      └── Store in MongoDB

This service acts as the main orchestration layer for proposal submission.

🖥️ 34. Frontend Architecture

The frontend is built using:

React
+
TypeScript

The frontend communicates with FastAPI through REST APIs.

The main role-based interfaces are:

React Application
       │
       ├── Researcher
       │
       ├── Reviewer
       │
       └── Administrator
🟦 35. Why TypeScript?

The frontend handles complex nested data returned by the backend.

For example:

Proposal
│
├── Evaluation
│   ├── Summary
│   ├── Scores
│   ├── Strengths
│   ├── Weaknesses
│   └── Suggestions
│
├── Similarity
│   ├── Similar Proposal
│   └── Similarity Score
│
└── Human Review
    ├── Reviewer
    ├── Score
    ├── Decision
    └── Comments

JavaScript can handle these structures.

However, TypeScript provides explicit types for the expected data structures.

This improves:

Type safety
API integration
Code maintainability
IDE support
Autocomplete
Refactoring
Error detection

Example:

interface Evaluation {
    summary: string;
    novelty_score: number;
    methodology_score: number;
    feasibility_score: number;
    clarity_score: number;
    overall_score: number;
    overall_percentage: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    overall_recommendation: string;
}
🔐 36. Security and Environment Variables

Sensitive credentials must never be committed to GitHub.

Sensitive values include:

GEMINI_API_KEY
MONGODB_URI
JWT_SECRET_KEY
Database passwords
Access tokens

These values should be stored in:

.env

Example:

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
JWT_SECRET_KEY=YOUR_SECRET_KEY

The actual .env file should be included in .gitignore.

⚠️ 37. GitHub Secret Protection

GitHub repository secret scanning should be respected.

If a secret is accidentally committed, simply deleting the file in a later commit is not sufficient because the secret can remain in Git history.

The secret should be:

Revoked or rotated.
Removed from Git history where necessary.
Replaced with an environment variable.
Verified before pushing again.

The project should never bypass GitHub secret protection by publishing a real API key.

🛠️ 38. Technology Stack
Backend
Python 3.11
FastAPI
Uvicorn
Pydantic
Frontend
React
TypeScript
Vite
Responsive UI
Database
MongoDB Atlas
PyMongo
Artificial Intelligence
Google Gemini API
Large Language Model evaluation
Natural Language Processing
Sentence Transformers
Sentence-BERT
all-MiniLM-L6-v2
Semantic embeddings
Cosine similarity
PDF Processing
PyMuPDF
Text extraction
Text preprocessing
Authentication
JWT
Password hashing
Role-based access control
Development Tools
Git
GitHub
Visual Studio Code
Antigravity IDE
Swagger UI
📂 39. Project Structure
AI-RD-Proposal-Evaluation-System
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
│   │   ├── core
│   │   ├── dependencies
│   │   ├── exceptions
│   │   ├── middleware
│   │   ├── ml
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
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
├── frontend
│   │
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   ├── hooks
│   │   └── ...
│   │
│   ├── public
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore

The exact frontend directory structure may evolve as the UI implementation continues.

⚙️ 40. Installation
Step 1 — Clone Repository
git clone https://github.com/IssacManova/AI-RD-Proposal-Evaluation-System.git

Navigate to the project:

cd AI-RD-Proposal-Evaluation-System
🐍 41. Backend Setup

Create a virtual environment:

python -m venv venv
Windows
venv\Scripts\activate
Linux / macOS
source venv/bin/activate
📦 42. Install Backend Dependencies

Navigate to backend:

cd backend

Install dependencies:

pip install -r requirements.txt
🔐 43. Configure Environment Variables

Create:

backend/.env

Example:

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

Replace the placeholder values with your own credentials.

Do not commit the real .env file.

▶️ 44. Run Backend

From the backend directory:

uvicorn app.main:app --reload

The backend will normally be available at:

http://127.0.0.1:8000
📚 45. Swagger API Documentation

FastAPI automatically provides interactive API documentation.

Open:

http://127.0.0.1:8000/docs

Swagger UI can be used to:

Register users
Authenticate users
Upload proposals
Test API endpoints
Inspect request schemas
Inspect response schemas
Verify backend functionality
⚛️ 46. Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Run the development server:

npm run dev

The frontend development server will normally be available at:

http://localhost:5173
🔗 47. Frontend-Backend Communication

The frontend communicates with FastAPI through HTTP REST APIs.

The communication flow is:

React + TypeScript
        ↓
API Request
        ↓
FastAPI
        ↓
Service Layer
        ↓
MongoDB / AI / NLP
        ↓
API Response
        ↓
React UI
🧪 48. Testing

The backend has been tested using the FastAPI Swagger interface.

The AI evaluation integration has been tested successfully.

The Sentence-BERT embedding integration has also been tested successfully.

The embedding test produced:

Embedding generated successfully!

Embedding dimensions: 384
🧪 49. Proposal Upload Testing

The proposal upload pipeline has been tested with PDF documents.

The successful processing flow is:

PDF Upload
     ↓
HTTP 200 Response
     ↓
File Saved
     ↓
Text Extracted
     ↓
Text Preprocessed
     ↓
Sentence-BERT Embedding
     ↓
Gemini Evaluation
     ↓
Similarity Calculation
     ↓
MongoDB Storage
🧪 50. Invalid / Non-Proposal Document Testing

The AI evaluation has also been tested with a document that was not a research proposal.

For example, a community-service appreciation letter was uploaded.

The system correctly identified that the document was not a research proposal.

The generated evaluation returned zero evaluation scores and recommended submitting an actual research proposal.

This demonstrates that the AI evaluation considers the actual extracted document content.

📊 51. Example Successful AI Evaluation

Example:

Summary:
The proposal presents an AI-assisted research proposal
evaluation platform using NLP, semantic similarity,
and large language models.

Novelty Score:
8/10

Methodology Score:
7/10

Feasibility Score:
8/10

Clarity Score:
9/10

Overall Score:
8.0/10

Overall Percentage:
80%

Strengths:
- Clear research objective
- Appropriate technology stack
- Practical human-in-the-loop approach

Weaknesses:
- Limited experimental validation
- Further implementation details required

Suggestions:
- Add measurable evaluation metrics
- Improve experimental validation
- Expand the methodology section

Overall Recommendation:
Accept with minor revisions
📊 52. Example Similarity Output

Example:

Proposal:
AI-Based Research Proposal Evaluation System

Similar Proposal:
AI-Based Research Evaluation Platform

Similarity:
23.46%

Multiple results can be displayed:

Proposal A → 23.46%
Proposal B → 18.72%
Proposal C → 11.35%
📈 53. Development Progress
Module	Status
Project Setup	✅ Completed
Git/GitHub Integration	✅ Completed
FastAPI Backend	✅ Completed
MongoDB Atlas Integration	✅ Completed
Authentication	✅ Completed
JWT Authentication	✅ Completed
Role-Based Access Control	✅ Completed
Researcher Role	✅ Completed
Reviewer Role	✅ Completed
Administrator Role	✅ Completed
Proposal Upload	✅ Completed
PDF Validation	✅ Completed
PDF Storage	✅ Completed
PDF Text Extraction	✅ Completed
Text Preprocessing	✅ Completed
Proposal Storage	✅ Completed
Sentence-BERT Integration	✅ Completed
all-MiniLM-L6-v2	✅ Completed
384-Dimensional Embedding	✅ Completed
Cosine Similarity	✅ Completed
Similarity Results	✅ Completed
Google Gemini Integration	✅ Completed
Gemini Proposal Evaluation	✅ Completed
Summary Generation	✅ Completed
Novelty Scoring	✅ Completed
Methodology Scoring	✅ Completed
Feasibility Scoring	✅ Completed
Clarity Scoring	✅ Completed
Strengths Generation	✅ Completed
Weakness Generation	✅ Completed
Suggestions Generation	✅ Completed
Overall Recommendation	✅ Completed
Overall Score	✅ Completed
Overall Percentage	✅ Completed
MongoDB Evaluation Storage	✅ Completed
Sentence-BERT Embedding Storage	✅ Completed
Researcher UI	✅ Implemented
Reviewer UI	✅ Implemented
Admin UI	✅ Implemented
Responsive UI	✅ Implemented
FAISS Vector Search	🚧 Planned
Advanced Reviewer Assignment	🚧 Planned
Explainable AI	🚧 Planned
Evaluation Report PDF	🚧 Planned
Advanced Analytics	🚧 Planned
RAG-Based Assistant	🚧 Planned
Cloud Deployment	🚧 Planned
🚧 54. Upcoming Development
🔎 FAISS Vector Search

The next stage can introduce FAISS for efficient similarity retrieval when the number of stored proposals becomes large.

Current implementation:

Proposal
   ↓
Sentence-BERT
   ↓
Embedding
   ↓
Cosine Similarity
   ↓
Stored Proposals

Future implementation:

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
🤖 55. Future AI Improvements

Future versions may include:

Improved proposal classification
Research topic classification
Research domain classification
Duplicate proposal detection
Reviewer recommendation
Explainable AI feedback
Evaluation confidence indicators
Retrieval-Augmented Generation
Human-AI evaluation comparison
Domain-specific evaluation models
Evidence-based AI scoring
👥 56. Future Reviewer Recommendation

A future reviewer recommendation system can recommend reviewers based on:

Research domain
Research expertise
Proposal semantic embeddings
Reviewer workload
Previous review history
Conflict-of-interest information

The final reviewer assignment should remain under administrator control.

📄 57. Future Evaluation Report

Future versions may generate downloadable evaluation reports containing:

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
AI Recommendation
        ↓
Human Review
        ↓
Final Assessment
📊 58. Future Dashboard Analytics

Future administrator dashboards can provide:

Total proposal count
Proposal count by domain
Average AI score
Average human score
AI-human score comparison
Review completion rate
Similarity statistics
Proposal submission trends
Reviewer workload
Evaluation trends
🧠 59. Explainable AI

Future versions can provide explanations for AI-generated scores.

Example:

Methodology Score: 6/10

Supporting Evidence:

- Methodology section lacks implementation details.
- Dataset information is incomplete.
- Evaluation metrics are not clearly defined.

This can make the AI evaluation more transparent and useful to reviewers.

🔍 60. Retrieval-Augmented Generation

A future RAG-based module could allow reviewers to ask questions about proposal content.

Example:

Reviewer:
"What methodology does this proposal use?"

        ↓

Relevant proposal sections retrieved

        ↓

AI generates answer

        ↓

Supporting content displayed

This could reduce the time required to manually search long proposals.

🌐 61. Cloud Deployment

Future deployment can include:

React Frontend
       ↓
Cloud Hosting
       ↓
FastAPI Backend
       ↓
MongoDB Atlas
       ↓
Google Gemini API

Additional production security and monitoring would be required.

🔐 62. Security and Responsible AI

Research proposals can contain confidential information.

The system therefore follows a human-in-the-loop design.

The AI should be considered:

AI Assistance
     ≠
Final Decision

Important considerations include:

Proposal confidentiality
Secure authentication
API key protection
Database security
Role-based access
Secure file handling
Human reviewer control
AI output logging
Data retention policies
Institutional approval for external AI services

Proposal information should not be sent to external AI services without appropriate authorization and safeguards.

⚠️ 63. Important Limitations
1. AI Evaluation Limitations

Large Language Models may produce:

Incorrect interpretations
Inconsistent scores
Hallucinated information
Overly positive or negative feedback
Different results for similar prompts

Therefore, AI-generated evaluation should always be reviewed by humans.

2. Similarity Limitations

Semantic similarity does not prove:

Plagiarism

or:

Duplicate Research

It only indicates semantic relatedness.

3. PDF Extraction Limitations

Text extraction may be affected by:

Scanned PDFs
Images
Tables
Complex layouts
Poor text encoding
Multi-column documents

Future OCR and document-layout processing can improve this.

4. Dataset Limitations

The current system does not depend on a large institution-specific labelled dataset for proposal scoring.

Future machine-learning models should only be introduced after obtaining an appropriate and authorized dataset.

🧭 64. Development Roadmap
PHASE 1
──────────────────────────────
Project Setup
       ↓
FastAPI Backend
       ↓
MongoDB Atlas
       ↓
Authentication
       ↓
Proposal Upload
       ↓
PDF Extraction
       ↓
Preprocessing
       ↓
       ✅ COMPLETED


PHASE 2
──────────────────────────────
Sentence-BERT
       ↓
Embedding Generation
       ↓
384-Dimensional Vectors
       ↓
Cosine Similarity
       ↓
Proposal Comparison
       ↓
       ✅ COMPLETED


PHASE 3
──────────────────────────────
Google Gemini
       ↓
Proposal Summary
       ↓
Novelty
       ↓
Methodology
       ↓
Feasibility
       ↓
Clarity
       ↓
Strengths
       ↓
Weaknesses
       ↓
Suggestions
       ↓
Overall Score
       ↓
Overall Percentage
       ↓
Recommendation
       ↓
       ✅ COMPLETED


PHASE 4
──────────────────────────────
React
       ↓
TypeScript
       ↓
Authentication UI
       ↓
Researcher Dashboard
       ↓
Reviewer Dashboard
       ↓
Admin Dashboard
       ↓
       ✅ IMPLEMENTED


PHASE 5
──────────────────────────────
FAISS
       ↓
Efficient Similarity Search
       ↓
Large Proposal Dataset
       ↓
       🚧 PLANNED


PHASE 6
──────────────────────────────
Human Review
       ↓
AI vs Human Comparison
       ↓
Reviewer Assignment
       ↓
Explainable AI
       ↓
       🚧 PLANNED


PHASE 7
──────────────────────────────
Advanced Analytics
       ↓
PDF Reports
       ↓
RAG Assistant
       ↓
Cloud Deployment
       ↓
       🚧 PLANNED
📌 65. Current System Status

The current project has progressed from a basic proposal upload system to an integrated AI-assisted research proposal evaluation platform.

The operational pipeline currently includes:

✅ User Authentication
✅ JWT Authentication
✅ Role-Based Access
✅ Researcher Role
✅ Reviewer Role
✅ Administrator Role
✅ Proposal Upload
✅ PDF Validation
✅ PDF Storage
✅ PDF Text Extraction
✅ Text Preprocessing
✅ Sentence-BERT Embeddings
✅ 384-Dimensional Embeddings
✅ Semantic Similarity
✅ Similarity Score
✅ Google Gemini Integration
✅ Structured AI Evaluation
✅ Proposal Summary
✅ Novelty Score
✅ Methodology Score
✅ Feasibility Score
✅ Clarity Score
✅ Strengths
✅ Weaknesses
✅ Suggestions
✅ Overall Recommendation
✅ Overall Score
✅ Overall Percentage
✅ MongoDB Storage
✅ Researcher Interface
✅ Reviewer Interface
✅ Admin Interface
✅ Responsive Frontend
📊 66. Current AI Evaluation Pipeline

The current AI pipeline can be summarized as:

                   PDF Proposal
                        │
                        ▼
                Text Extraction
                        │
                        ▼
                 Preprocessing
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       Sentence-BERT          Google Gemini
              │                   │
              ▼                   ▼
       384-D Embedding       AI Evaluation
              │                   │
              ▼                   ├── Summary
      Cosine Similarity           ├── Novelty
              │                   ├── Methodology
              ▼                   ├── Feasibility
     Similar Proposals            ├── Clarity
                                  ├── Strengths
                                  ├── Weaknesses
                                  ├── Suggestions
                                  ├── Overall Score
                                  ├── Percentage
                                  └── Recommendation
              │                   │
              └─────────┬─────────┘
                        ▼
                  MongoDB Atlas
                        │
                        ▼
               Frontend Dashboard
                        │
                        ▼
                  Human Reviewer
🎓 67. Academic Significance

This project demonstrates the practical integration of several modern technologies into a single research-management application.

The project covers:

Full-stack web development
REST API development
Database management
Authentication
Role-based authorization
PDF processing
Natural Language Processing
Semantic embeddings
Semantic similarity
Large Language Models
AI-assisted evaluation
Human-in-the-loop systems
Responsive frontend development
TypeScript-based application architecture

The system demonstrates how AI can be used to assist research proposal evaluation while preserving human responsibility for final decisions.

🧪 68. Example End-to-End Scenario

A researcher submits a proposal.

Researcher
    ↓
Login
    ↓
Researcher Dashboard
    ↓
Upload Proposal

The backend processes the proposal:

PDF
 ↓
Extract Text
 ↓
Preprocess

The system then performs two AI/NLP operations:

                    Clean Text
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
       Sentence-BERT          Google Gemini
             │                     │
             ▼                     ▼
        Embedding             Evaluation
             │                     │
             ▼                     ▼
       Similarity Score      AI Scores
             │                     │
             └──────────┬──────────┘
                        ▼
                   MongoDB
                        │
                        ▼
                 Reviewer View
                        │
                        ▼
                  Human Review

The researcher can view the AI-generated evaluation while the reviewer can perform the final human assessment.

📋 69. Example Final Evaluation View
────────────────────────────────────────
        AI PROPOSAL EVALUATION
────────────────────────────────────────

Summary
----------------------------------------
AI-generated proposal summary...

Scores
----------------------------------------
Novelty          8/10
Methodology      7/10
Feasibility      8/10
Clarity          9/10

Overall Score    8.00/10
Percentage       80%

Strengths
----------------------------------------
• Clear research objective
• Relevant problem
• Appropriate methodology

Weaknesses
----------------------------------------
• Limited validation
• Additional implementation details needed

Suggestions
----------------------------------------
• Add measurable evaluation metrics
• Expand experimental methodology

Recommendation
----------------------------------------
Accept with minor revisions

Similarity
----------------------------------------
Similar Proposal A       23.46%
Similar Proposal B       18.72%
Similar Proposal C       11.35%

────────────────────────────────────────
      HUMAN REVIEW REQUIRED
────────────────────────────────────────
🔗 70. Repository

GitHub Repository:

https://github.com/IssacManova/AI-RD-Proposal-Evaluation-System

👨‍💻 71. Author

Issac Manova Manoharan

Final Year Undergraduate

Computer Science and Engineering

Final Year Project

📄 72. License

This project is developed solely for educational and academic research purposes as part of a Final Year Undergraduate Project.

⭐ 73. Project Summary

The AI-Based Research Proposal Evaluation System is a full-stack AI-assisted research proposal management and evaluation platform.

The system combines:

React
+
TypeScript
+
FastAPI
+
MongoDB Atlas
+
PyMuPDF
+
Sentence-BERT
+
Cosine Similarity
+
Google Gemini
+
Human Review

The platform provides a complete preliminary evaluation workflow:

Upload
  ↓
Extract
  ↓
Preprocess
  ↓
Embed
  ↓
Compare
  ↓
Evaluate
  ↓
Score
  ↓
Store
  ↓
Review

The core objective is not to replace expert reviewers, but to reduce preliminary evaluation workload and provide structured evidence that can assist human decision-making.

The current implementation provides a working foundation for further development into a scalable institutional research proposal evaluation platform.