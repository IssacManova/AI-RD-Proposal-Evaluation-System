from datetime import datetime
from pathlib import Path
from bson import ObjectId
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends,
)

from app.dependencies.auth import require_role, get_current_user
from app.services.proposal_service import save_proposal
from app.services.evaluation_service import evaluate_proposal
from app.config.database import db

router = APIRouter(prefix="/proposal", tags=["Proposal"])

proposal_collection = db["proposals"]


def serialize_proposal(p: dict) -> dict:
    """Convert MongoDB document to JSON-safe dict."""
    p["_id"] = str(p["_id"])
    # Ensure uploaded_at is ISO string format
    uploaded_at = p.get("uploaded_at")
    if isinstance(uploaded_at, datetime):
        p["uploaded_at"] = uploaded_at.isoformat()
    elif not uploaded_at:
        p["uploaded_at"] = datetime.utcnow().isoformat()
    # Remove the raw embedding vector (large + not needed in UI)
    p.pop("embedding", None)
    return p


# ── Upload ────────────────────────────────────────────────────────────────────

@router.post("/upload")
def upload_proposal(
    title: str = Form(...),
    domain: str = Form(...),
    file: UploadFile = File(...),
    current_user=Depends(require_role("researcher"))
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    proposal = save_proposal(
        file=file,
        title=title,
        domain=domain,
        researcher_email=current_user["email"],
    )

    return {
        "message": "Proposal uploaded successfully.",
        "proposal": proposal,
    }


# ── Get all proposals (admin + reviewer) ─────────────────────────────────────

@router.get("/all")
def get_all_proposals(current_user=Depends(get_current_user)):
    if current_user["role"] not in ("admin", "reviewer"):
        raise HTTPException(status_code=403, detail="Access Denied")

    proposals = list(
        proposal_collection.find({}, {"embedding": 0}).sort(
            [("uploaded_at", -1), ("_id", -1)]
        )
    )
    return {"proposals": [serialize_proposal(p) for p in proposals]}


# ── Get researcher's own proposals ────────────────────────────────────────────

@router.get("/my-proposals")
def get_my_proposals(current_user=Depends(require_role("researcher"))):
    proposals = list(
        proposal_collection.find(
            {"researcher_email": current_user["email"]},
            {"embedding": 0}
        ).sort([("uploaded_at", -1), ("_id", -1)])
    )
    return {"proposals": [serialize_proposal(p) for p in proposals]}


# ── Re-evaluate AI for single proposal ────────────────────────────────────────

@router.post("/{proposal_id}/evaluate")
def evaluate_single_proposal(proposal_id: str, current_user=Depends(get_current_user)):
    try:
        obj_id = ObjectId(proposal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid proposal ID.")

    proposal = proposal_collection.find_one({"_id": obj_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found.")

    extracted_text = proposal.get("extracted_text", "")
    if not extracted_text:
        raise HTTPException(status_code=400, detail="No extracted text found in proposal.")

    evaluation = evaluate_proposal(extracted_text)

    proposal_collection.update_one(
        {"_id": obj_id},
        {"$set": {"evaluation": evaluation}}
    )

    updated = proposal_collection.find_one({"_id": obj_id}, {"embedding": 0})
    return {
        "message": "Proposal re-evaluated successfully.",
        "proposal": serialize_proposal(updated)
    }


# ── Get single proposal by ID ─────────────────────────────────────────────────

@router.get("/{proposal_id}")
def get_proposal(proposal_id: str, current_user=Depends(get_current_user)):
    try:
        obj_id = ObjectId(proposal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid proposal ID.")

    proposal = proposal_collection.find_one({"_id": obj_id}, {"embedding": 0})

    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found.")

    # Researchers can only access their own proposals
    if (
        current_user["role"] == "researcher"
        and proposal.get("researcher_email") != current_user["email"]
    ):
        raise HTTPException(status_code=403, detail="Access Denied")

    return {"proposal": serialize_proposal(proposal)}


# ── Delete proposal (admin only) ──────────────────────────────────────────────

@router.delete("/{proposal_id}")
def delete_proposal(proposal_id: str, current_user=Depends(require_role("admin"))):
    try:
        obj_id = ObjectId(proposal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid proposal ID.")

    proposal = proposal_collection.find_one({"_id": obj_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found.")

    # Remove physical PDF file if present
    file_path = proposal.get("file_path")
    if file_path:
        try:
            p_path = Path(file_path)
            if p_path.exists():
                p_path.unlink()
        except Exception:
            pass

    proposal_collection.delete_one({"_id": obj_id})
    return {"message": "Proposal deleted successfully."}