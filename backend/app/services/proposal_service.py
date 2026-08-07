import os
import shutil
from uuid import uuid4
from app.services.pdf_service import extract_text
from app.services.preprocessing import preprocess_text
from app.config.database import db
from app.models.proposal import Proposal
from app.services.evaluation_service import evaluate_proposal

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_FOLDER = BASE_DIR / "uploads" / "proposals"

UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

proposal_collection = db["proposals"]


def save_proposal(file, title, domain, researcher_email):

    extension = file.filename.split(".")[-1]

    filename = f"{uuid4()}.{extension}"

    file_path = UPLOAD_FOLDER / filename

    with open(str(file_path), "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from uploaded PDF
    raw_text = extract_text(str(file_path))

    # Clean extracted text
    clean_text = preprocess_text(raw_text)
    evaluation = evaluate_proposal(clean_text)

    proposal = Proposal(
    title=title,
    domain=domain,
    filename=filename,
    file_path=str(file_path),
    researcher_email=researcher_email,
    extracted_text=clean_text
    )

    proposal_data = proposal.to_dict()
    proposal_data["evaluation"] = evaluation

    result = proposal_collection.insert_one(proposal_data)

    proposal_data["_id"] = str(result.inserted_id)

    return proposal_data