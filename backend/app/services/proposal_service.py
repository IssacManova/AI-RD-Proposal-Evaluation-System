import shutil
from uuid import uuid4
from pathlib import Path

from app.services.pdf_service import extract_text
from app.services.preprocessing import preprocess_text
from app.services.embedding_service import generate_embedding
from app.services.evaluation_service import evaluate_proposal
from app.services.similarity_service import calculate_similarity

from app.config.database import db
from app.models.proposal import Proposal


BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_FOLDER = BASE_DIR / "uploads" / "proposals"

UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

proposal_collection = db["proposals"]


def save_proposal(file, title, domain, researcher_email):

    extension = file.filename.split(".")[-1]

    filename = f"{uuid4()}.{extension}"

    file_path = UPLOAD_FOLDER / filename

    # Save uploaded PDF
    with open(str(file_path), "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    raw_text = extract_text(str(file_path))

    # Preprocess extracted text
    clean_text = preprocess_text(raw_text)

    # Generate Sentence-BERT embedding
    embedding = generate_embedding(clean_text)

    # Find existing proposal embeddings
    stored_proposals = list(
        proposal_collection.find(
            {
                "embedding": {"$exists": True}
            },
            {
                "_id": 1,
                "title": 1,
                "embedding": 1
            }
        )
    )

    # Calculate similarity with existing proposals
    similarity_results = calculate_similarity(
        embedding,
        stored_proposals
    )

    # Keep top 5 most similar proposals
    similarity_results = similarity_results[:5]

    # Generate Gemini AI evaluation
    evaluation = evaluate_proposal(clean_text)

    # Create proposal object
    proposal = Proposal(
        title=title,
        domain=domain,
        filename=filename,
        file_path=str(file_path),
        researcher_email=researcher_email,
        extracted_text=clean_text
    )

    # Convert proposal to dictionary
    proposal_data = proposal.to_dict()

    # Add AI evaluation
    proposal_data["evaluation"] = evaluation

    # Add Sentence-BERT embedding
    proposal_data["embedding"] = embedding

    # Add similarity results
    proposal_data["similarity"] = similarity_results

    # Add highest similarity score
    if similarity_results:
        proposal_data["similarity_score"] = similarity_results[0]["similarity_score"]
    else:
        proposal_data["similarity_score"] = None

    # Store proposal in MongoDB
    result = proposal_collection.insert_one(proposal_data)

    proposal_data["_id"] = str(result.inserted_id)

    return proposal_data