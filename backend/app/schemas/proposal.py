from pydantic import BaseModel
from datetime import datetime


class ProposalCreate(BaseModel):
    title: str
    domain: str


class ProposalResponse(BaseModel):
    id: str
    title: str
    domain: str
    filename: str
    uploaded_at: datetime