from bson import ObjectId
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends

from app.dependencies.auth import get_current_user
from app.config.database import db
from app.schemas.evaluation import HumanReviewSchema

router = APIRouter(prefix="/evaluation", tags=["Evaluation"])

proposal_collection = db["proposals"]


@router.post("/{proposal_id}/review")
def submit_human_review(
    proposal_id: str,
    review: HumanReviewSchema,
    current_user=Depends(get_current_user),
):
    """
    Reviewer (or admin) submits a human evaluation for a given proposal.
    Saves the review object to the proposal document in MongoDB.
    """
    if current_user["role"] not in ("reviewer", "admin"):
        raise HTTPException(status_code=403, detail="Only reviewers can submit reviews.")

    try:
        obj_id = ObjectId(proposal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid proposal ID.")

    proposal = proposal_collection.find_one({"_id": obj_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found.")

    review_data = review.model_dump()
    review_data["reviewer_email"] = current_user["email"]
    review_data["reviewed_at"] = datetime.now(timezone.utc).isoformat()

    result = proposal_collection.update_one(
        {"_id": obj_id},
        {"$set": {"human_review": review_data}},
    )

    # matched_count==0 means the proposal wasn't found (shouldn't happen since we checked above)
    if result.matched_count == 0:
        raise HTTPException(status_code=500, detail="Failed to save review.")

    return {"message": "Review submitted successfully."}

