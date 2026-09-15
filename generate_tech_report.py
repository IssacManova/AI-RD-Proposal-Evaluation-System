import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 11 * 72 - 36, "AI-Based Research Proposal Evaluation System — Technical Defense & Review Document")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * 72 - 42, 8.5 * 72 - 54, 11 * 72 - 42)

        # Footer (all pages)
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 54, 36, page_text)
        self.drawString(54, 36, "CONFIDENTIAL — Prepared for Project Final Review Defense")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 8.5 * 72 - 54, 48)
        
        self.restoreState()


def build_pdf(filename="AI_RD_Evaluation_System_Technical_Report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#2563EB'),
        spaceAfter=15
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0F766E'),
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155'),
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#1E3A8A')
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    # Title Block
    story.append(Paragraph("AI-Based Research Proposal Evaluation System", title_style))
    story.append(Paragraph("Comprehensive Technical Defense Document: Tech Stack, Algorithms & AI Models", subtitle_style))
    story.append(Paragraph("<b>Project Role:</b> Final Year Engineering Project &nbsp;|&nbsp; <b>Prepared For:</b> Final Viva & Evaluation Panel Review &nbsp;|&nbsp; <b>Date:</b> September 2026", meta_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563EB"), spaceBefore=0, spaceAfter=14))

    # 1. Executive Summary & Overview
    story.append(Paragraph("1. Executive Summary & Core Philosophy", h1_style))
    story.append(Paragraph(
        "Evaluating research proposals manually is a time-intensive process prone to reviewer fatigue, subjective bias, "
        "and delayed funding cycles. The <b>AI-Based Research Proposal Evaluation System</b> is designed as an intelligent "
        "<b>Human-in-the-Loop (HITL) Decision Support Platform</b>. It automates structural format verification, semantic similarity detection, "
        "and multi-criteria qualitative evaluation, enabling academic committees and reviewers to make rapid, objective, and well-informed decisions.",
        body_style
    ))
    
    # Callout Box
    callout_data = [[Paragraph("<b>Key Design Principle — Human-in-the-Loop (HITL):</b> The system does NOT replace human expert reviewers or autonomously accept/reject proposals. Instead, it pre-screens structure, quantifies semantic novelty/overlap, generates multi-criteria baseline scores with rationale, and presents an interactive dashboard for expert reviewers to finalize scores and feedback.", callout_style)]]
    callout_table = Table(callout_data, colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BORDER', (0, 0), (-1, -1), 1, colors.HexColor("#93C5FD")),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 12))

    # 2. Complete Technical Stack
    story.append(Paragraph("2. Complete Technical Stack Architecture", h1_style))
    story.append(Paragraph(
        "The project is architected with a decoupled full-stack modular architecture, combining a high-performance Python FastAPI backend, "
        "a modern React + TypeScript frontend, cloud MongoDB database storage, and specialized deep learning / NLP frameworks.",
        body_style
    ))

    # Tech Stack Table
    tech_data = [
        [Paragraph("Layer / Subsystem", table_header_style), Paragraph("Technology Stack", table_header_style), Paragraph("Exact Role & Implementation Detail", table_header_style)],
        [Paragraph("Backend API Framework", table_cell_bold), Paragraph("Python 3.11+<br/>FastAPI 0.139.0<br/>Uvicorn 0.51.0", table_cell_style), Paragraph("Asynchronous REST API backend routing, data validation using Pydantic v2 schemas, CORS middleware, file uploads, and background tasks.", table_cell_style)],
        [Paragraph("Frontend Application", table_cell_bold), Paragraph("React 19.2<br/>TypeScript 5.8<br/>Vite 5.4", table_cell_style), Paragraph("Single Page Application (SPA) with strong type-safety, rapid Hot Module Replacement (HMR), component lifecycle management, and custom context state.", table_cell_style)],
        [Paragraph("Styling & UX", table_cell_bold), Paragraph("Tailwind CSS 3.4<br/>Lucide React<br/>React Hot Toast", table_cell_style), Paragraph("Utility-first responsive layout styling, modern visual icon set, real-time notification toasts, and clean dark/light UI palette.", table_cell_style)],
        [Paragraph("Database & Storage", table_cell_bold), Paragraph("MongoDB Atlas<br/>Motor 3.7 (Async)<br/>PyMongo 4.17", table_cell_style), Paragraph("Cloud NoSQL database storing user credentials, uploaded proposal metadata, vector embedding lists, review scores, and system notifications.", table_cell_style)],
        [Paragraph("Security & Auth", table_cell_bold), Paragraph("JWT (python-jose)<br/>Passlib (bcrypt 4.0)<br/>OAuth2 Bearer", table_cell_style), Paragraph("Stateless authentication using JWT Bearer Tokens (HS256), salted bcrypt password hashing, auth splash rehydration, and Role-Based Access Control (RBAC).", table_cell_style)],
        [Paragraph("AI / LLM Engine", table_cell_bold), Paragraph("Google Gemini API<br/>google-generativeai 0.8<br/>gemini-3.5-flash", table_cell_style), Paragraph("Large Language Model evaluation pipeline extracting structured JSON multi-criteria scorecards, qualitative strengths, weaknesses, and suggestions.", table_cell_style)],
        [Paragraph("Semantic Vector Engine", table_cell_bold), Paragraph("Sentence-Transformers<br/>PyTorch 2.13<br/>FAISS-CPU 1.14", table_cell_style), Paragraph("Pre-trained transformer embeddings generating 384-dimensional dense vectors with FAISS index search for real-time similarity matching.", table_cell_style)],
        [Paragraph("Document Parsing & NLP", table_cell_bold), Paragraph("PyMuPDF (fitz 1.28)<br/>SpaCy 3.8<br/>Scikit-Learn 1.9", table_cell_style), Paragraph("High-speed raw text extraction from PDF documents, text cleaning pipelines (regex whitespace/symbol removal), and Cosine Similarity scoring.", table_cell_style)],
        [Paragraph("Data Visualization", table_cell_bold), Paragraph("Recharts 3.10", table_cell_style), Paragraph("Interactive analytics charts (Bar charts, Radar score distribution, Status transition pie charts) in Admin and Reviewer dashboards.", table_cell_style)]
    ]

    t_tech = Table(tech_data, colWidths=[110, 114, 280])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 14))

    # 3. Algorithms Used in the Project
    story.append(Paragraph("3. Algorithms & Mathematical Formulations", h1_style))
    story.append(Paragraph(
        "The system relies on six core algorithms spanning natural language processing, vector linear algebra, pattern recognition, and multi-criteria decision scoring:",
        body_style
    ))

    # Algo 1
    story.append(Paragraph("3.1 Cosine Similarity Semantic Overlap Algorithm", h2_style))
    story.append(Paragraph(
        "To measure conceptual overlap between a newly submitted research proposal and historical proposals stored in MongoDB, "
        "both documents are converted into dense vector representations <b>u</b> and <b>v</b> in 384-dimensional space. "
        "The Cosine Similarity algorithm calculates the normalized inner dot product of the two vectors:",
        body_style
    ))
    story.append(Paragraph("<b>Formula:</b> &nbsp;&nbsp; <i>Similarity(u, v) = (u • v) / ( ||u|| * ||v|| ) = ( ∑ u_i * v_i ) / ( √(∑ u_i²) * √(∑ v_i²) )</i>", bullet_style))
    story.append(Paragraph("<b>Output Scaling:</b> The resulting cosine value [-1.0, 1.0] is converted to a percentage: <i>Score = round(Similarity * 100, 2)</i>.", bullet_style))

    # Algo 2
    story.append(Paragraph("3.2 IEEE Standard 8-Section Rule-Based Compliance Algorithm", h2_style))
    story.append(Paragraph(
        "Validates if uploaded proposal documents conform to standard IEEE academic structure. "
        "The algorithm executes high-performance regular expression (RegEx) word boundary checks across 8 mandated sections:",
        body_style
    ))
    story.append(Paragraph("• <b>IEEE Abstract:</b> <code>r'\\babstract\\b|\\bexecutive\\s+summary\\b'</code>", bullet_style))
    story.append(Paragraph("• <b>IEEE Index Terms / Keywords:</b> <code>r'\\bindex\\s+terms\\b|\\bkeywords\\b'</code>", bullet_style))
    story.append(Paragraph("• <b>IEEE Section I (Introduction):</b> <code>r'\\b(?:section\\s+i|1\\.)?\\s*introduction\\b'</code>", bullet_style))
    story.append(Paragraph("• <b>Problem Statement & Motivation:</b> <code>r'\\bproblem\\s+statement\\b|\\bmotivation\\b'</code>", bullet_style))
    story.append(Paragraph("• <b>IEEE Section II (Literature Review):</b> <code>r'\\b(?:section\\s+ii|2\\.)?\\s*literature\\s+review\\b|\\brelated\\s+work[s]?\\b'</code>", bullet_style))
    story.append(Paragraph("• <b>IEEE Section III (Proposed Methodology):</b> <code>r'\\b(?:section\\s+iii|3\\.)?\\s*methodology\\b|\\bsystem\\s+model\\b'</code>", bullet_style))
    story.append(Paragraph("• <b>IEEE Section IV (Expected Outcomes):</b> <code>r'\\b(?:section\\s+iv|4\\.)?\\s*expected\\s+outcome[s]?\\b|\\bdeliverable[s]?\\b'</code>", bullet_style))
    story.append(Paragraph("• <b>IEEE References & Citations:</b> <code>r'\\breference[s]?\\b|\\[\\d+\\]'</code>", bullet_style))
    story.append(Paragraph("<b>Compliance Score Formula:</b> <i>Compliance % = round( ( Found Sections / 8 ) * 100 )</i>. Flags <code>is_valid = True</code> if all required sections are present.", bullet_style))

    # Algo 3
    story.append(Paragraph("3.3 Multi-Criteria Evaluation & Weighted Score Aggregation", h2_style))
    story.append(Paragraph(
        "Google Gemini LLM evaluates proposals along four core qualitative dimensions on an integer scale of 0 to 10: "
        "<b>Novelty (N)</b>, <b>Methodology (M)</b>, <b>Feasibility (F)</b>, and <b>Clarity (C)</b>. "
        "The system aggregates these dimension scores to derive overall baseline metrics:",
        body_style
    ))
    story.append(Paragraph("<b>Overall Mean Score (Out of 10):</b> <i>S_overall = (N + M + F + C) / 4</i>", bullet_style))
    story.append(Paragraph("<b>Overall Percentage:</b> <i>Percentage = round(S_overall * 10, 2)</i>", bullet_style))

    # Algo 4
    story.append(Paragraph("3.4 Text Preprocessing & Cleaning Pipeline Algorithm", h2_style))
    story.append(Paragraph(
        "Raw PDF text extracted via PyMuPDF often contains line-break hyphens, non-printable font glyphs, and irregular spacing. "
        "The NLP cleaning pipeline normalizes text before vector embedding and LLM prompting:",
        body_style
    ))
    story.append(Paragraph("1. <b>Whitespace Normalization:</b> Replaces consecutive control characters/newlines with a single space (<code>re.sub(r'\\s+', ' ', text)</code>).", bullet_style))
    story.append(Paragraph("2. <b>Noise & Glyph Stripping:</b> Removes invalid unicode glyphs while preserving standard punctuation (<code>re.sub(r'[^\\w\\s.,!?()\\-:]', '', text)</code>).", bullet_style))
    story.append(Paragraph("3. <b>Token Truncation Safety:</b> Truncates text payload to initial 5,000 characters to prevent LLM context overflows while retaining essential proposal content.", bullet_style))

    # Algo 5 & 6
    story.append(Paragraph("3.5 FAISS Indexing & Nearest Neighbor Search Algorithm", h2_style))
    story.append(Paragraph(
        "Uses Facebook AI Similarity Search (FAISS) <code>IndexFlatL2</code> and <code>IndexFlatIP</code> data structures to build dense vector index lookup. "
        "Allows real-time sub-millisecond similarity comparison over large corpora of historical research proposals.",
        body_style
    ))
    story.append(Spacer(1, 14))

    # 4. Machine Learning & AI Models Used
    story.append(Paragraph("4. Machine Learning & AI Models Breakdown", h1_style))
    story.append(Paragraph(
        "The project integrates state-of-the-art Generative AI, Transformer Embeddings, and NLP model pipelines:",
        body_style
    ))

    models_data = [
        [Paragraph("Model Name", table_header_style), Paragraph("Model Type / Base Architecture", table_header_style), Paragraph("Key Parameters & Specifications", table_header_style), Paragraph("Specific Project Function & Workflow", table_header_style)],
        [
            Paragraph("Google Gemini<br/>(gemini-3.5-flash)", table_cell_bold),
            Paragraph("Generative Large Language Model (LLM)", table_cell_style),
            Paragraph("<b>Context Window:</b> 1M+ tokens<br/><b>JSON Mode:</b> Structured schema enforcement", table_cell_style),
            Paragraph("Acts as the multi-criteria evaluator. Processes text and outputs JSON containing Novelty, Methodology, Feasibility, Clarity scores, Strengths, Weaknesses, and Constructive Suggestions.", table_cell_style)
        ],
        [
            Paragraph("Sentence-BERT<br/>(all-MiniLM-L6-v2)", table_cell_bold),
            Paragraph("Sentence Transformer (BERT derivative)", table_cell_style),
            Paragraph("<b>Parameters:</b> 22.7M<br/><b>Output Dimension:</b> 384-d dense vector<br/><b>Max Sequence:</b> 256 tokens", table_cell_style),
            Paragraph("Converts raw proposal abstract and content into 384-dimensional dense semantic vectors to capture deep conceptual context beyond keyword matching.", table_cell_style)
        ],
        [
            Paragraph("FAISS Vector Index<br/>(faiss-cpu)", table_cell_bold),
            Paragraph("Dense Vector Index & Search Library", table_cell_style),
            Paragraph("<b>Metric:</b> L2 Euclidean & Inner Product (IP)<br/><b>Dimension:</b> 384", table_cell_style),
            Paragraph("Stores proposal embedding vectors in an indexed structure for sub-millisecond k-Nearest Neighbor (k-NN) similarity queries.", table_cell_style)
        ],
        [
            Paragraph("SpaCy NLP Pipeline<br/>(en_core_web_sm)", table_cell_bold),
            Paragraph("Convolutional Neural Network NLP Pipeline", table_cell_style),
            Paragraph("<b>Components:</b> Tok2Vec, Parser, NER, Attribute Ruler", table_cell_style),
            Paragraph("Performs tokenization, sentence segmentation, lemmatization, and text cleaning on raw extracted PDF strings.", table_cell_style)
        ],
        [
            Paragraph("XGBoost Classifier", table_cell_bold),
            Paragraph("Gradient Boosted Decision Trees (GBDT)", table_cell_style),
            Paragraph("<b>Objective:</b> Multi-class classification & score regression", table_cell_style),
            Paragraph("Capability module setup for supervised scoring refinement and secondary proposal rank classification.", table_cell_style)
        ]
    ]

    t_models = Table(models_data, colWidths=[100, 110, 120, 174])
    t_models.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F766E")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F0FDFA")]),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_models)
    story.append(Spacer(1, 14))

    # 5. System Architecture & End-to-End Execution Flow
    story.append(Paragraph("5. End-to-End Execution Flow", h1_style))
    story.append(Paragraph(
        "When a Researcher submits a proposal PDF, the system executes the following synchronous & asynchronous processing pipeline:",
        body_style
    ))
    story.append(Paragraph("1. <b>PDF Upload & Ingestion:</b> Frontend sends PDF multipart file to <code>/proposal/upload</code>. PyMuPDF extracts raw text.", bullet_style))
    story.append(Paragraph("2. <b>Text Cleaning & NLP Normalization:</b> SpaCy & Regex strip formatting noise, blank lines, and non-ASCII glyphs.", bullet_style))
    story.append(Paragraph("3. <b>IEEE Structural Audit:</b> 8-section RegEx matcher audits document formatting and generates section compliance report.", bullet_style))
    story.append(Paragraph("4. <b>Dense Embedding Generation:</b> Sentence-BERT (<code>all-MiniLM-L6-v2</code>) converts cleaned text into a 384-d vector.", bullet_style))
    story.append(Paragraph("5. <b>Vector Similarity Check:</b> Cosine Similarity & FAISS index search query past proposals in MongoDB Atlas to calculate semantic overlap %.", bullet_style))
    story.append(Paragraph("6. <b>Gemini LLM Multi-Criteria Scoring:</b> Gemini API evaluates text payload and returns structured JSON scorecard with qualitative feedback.", bullet_style))
    story.append(Paragraph("7. <b>MongoDB Atlas Persistence:</b> Complete proposal object (metadata, IEEE check, similarity score, Gemini evaluation) is saved.", bullet_style))
    story.append(Paragraph("8. <b>Role-Based Dashboards & Real-time Toast/Notifications:</b> Admin/Reviewers receive unread header notifications and review proposals.", bullet_style))
    story.append(Spacer(1, 14))

    # 6. Defense Cheatsheet & Review Questions
    story.append(Paragraph("6. Viva Defense Cheatsheet for Tomorrow's Review", h1_style))
    story.append(Paragraph(
        "Quick reference answers for potential technical questions from the project evaluation panel:",
        body_style
    ))

    qa_data = [
        [
            Paragraph("Q1: Why use Sentence-BERT instead of traditional TF-IDF or Word2Vec?", table_cell_bold),
            Paragraph("<b>Answer:</b> TF-IDF only matches literal keywords and fails when proposals use synonyms (e.g., 'machine learning' vs 'deep neural networks'). Word2Vec averages word vectors, losing sentence context. Sentence-BERT uses transformer self-attention to capture full contextual semantic meaning in a 384-d dense embedding space.", table_cell_style)
        ],
        [
            Paragraph("Q2: Why Google Gemini instead of OpenAI GPT-4?", table_cell_bold),
            Paragraph("<b>Answer:</b> Gemini 3.5 Flash offers extremely low latency, superior native JSON schema output enforcement (preventing malformed parsing errors), cost-efficiency, and a 1M+ token context window suitable for lengthy academic proposals.", table_cell_style)
        ],
        [
            Paragraph("Q3: How does the system handle AI hallucination or biased scoring?", table_cell_bold),
            Paragraph("<b>Answer:</b> Through our <b>Human-in-the-Loop (HITL)</b> design. AI scores serve solely as an automated baseline. Human expert reviewers inspect the proposal, review AI flags, and submit final authoritative human scores and recommendations.", table_cell_style)
        ],
        [
            Paragraph("Q4: How is IEEE section validation implemented?", table_cell_bold),
            Paragraph("<b>Answer:</b> It uses high-performance regex pattern matching across 8 mandatory IEEE sections (Abstract, Index Terms, Section I-IV, Citations [1]). It runs in milliseconds without requiring heavy ML inference.", table_cell_style)
        ],
        [
            Paragraph("Q5: How is database scalability ensured for vector searches?", table_cell_bold),
            Paragraph("<b>Answer:</b> Proposal embeddings (384-float arrays) are stored in MongoDB Atlas and indexed via FAISS (`faiss-cpu`), allowing logarithmic (O(log N)) search time as submission count grows.", table_cell_style)
        ],
        [
            Paragraph("Q6: Why TypeScript instead of JavaScript for the Frontend?", table_cell_bold),
            Paragraph("<b>Answer:</b> JavaScript can run everything TS does (TS compiles to JS). However, TypeScript was selected for high engineering quality: (1) <b>Compile-time Type Safety:</b> Catches runtime bugs (e.g. <code>undefined is not an object</code>) before deployment. (2) <b>Backend Contract Alignment:</b> TS Interfaces directly match FastAPI Pydantic schemas (Proposal, Evaluation, User). (3) <b>Maintainability & Refactoring:</b> Allows safe refactoring across complex multi-role dashboards (Researcher, Reviewer, Admin).", table_cell_style)
        ]
    ]

    t_qa = Table(qa_data, colWidths=[180, 324])
    t_qa.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_qa)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")

if __name__ == '__main__':
    build_pdf()
