from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime


class HumanReviewSchema(BaseModel):
    reviewer_email: str
    novelty_score: int = Field(..., ge=0, le=10)
    methodology_score: int = Field(..., ge=0, le=10)
    feasibility_score: int = Field(..., ge=0, le=10)
    clarity_score: int = Field(..., ge=0, le=10)
    comments: str = ""
    final_recommendation: Literal[
        "accept", "accept_with_revisions", "revise", "reject", "pending"
    ]
    reviewed_at: str | None = None
