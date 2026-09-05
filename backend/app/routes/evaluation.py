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

    # Create notification for the researcher
    researcher_email = proposal.get("researcher_email")
    if researcher_email:
        proposal_title = proposal.get("title", "Research Proposal")
        rec = review_data.get("recommendation", "Decision made").replace("_", " ").title()
        score = review_data.get("score", 0)
        from app.services.notification_service import create_notification
        create_notification(
            user_email=researcher_email,
            title="Proposal Review Completed",
            message=f"Your proposal '{proposal_title}' was reviewed. Score: {score}/100 ({rec}).",
            proposal_id=proposal_id,
            notification_type="review_submitted"
        )

    return {"message": "Review submitted successfully."}

