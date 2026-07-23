from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    Depends,
)

from app.dependencies.auth import require_role
from app.services.proposal_service import save_proposal

router = APIRouter(prefix="/proposal", tags=["Proposal"])


@router.post("/upload")
def upload_proposal(
    title: str = Form(...),
    domain: str = Form(...),
    file: UploadFile = File(...),
    current_user=Depends(require_role("researcher"))
):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

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