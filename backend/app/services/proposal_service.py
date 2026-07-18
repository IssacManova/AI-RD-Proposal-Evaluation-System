import os
import shutil
from uuid import uuid4

from app.config.database import db
from app.models.proposal import Proposal

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

    proposal = Proposal(
        title=title,
        domain=domain,
        filename=filename,
        file_path=str(file_path),
        researcher_email=researcher_email,
    )

    result = proposal_collection.insert_one(proposal.to_dict())

    proposal_data = proposal.to_dict()

    proposal_data["_id"] = str(result.inserted_id)

    return proposal_data