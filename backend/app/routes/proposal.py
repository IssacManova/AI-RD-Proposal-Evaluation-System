from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.proposal_service import save_proposal

router = APIRouter(prefix="/proposal", tags=["Proposal"])


@router.post("/upload")
def upload_proposal(
    title: str = Form(...),
    domain: str = Form(...),
    researcher_email: str = Form(...),
    file: UploadFile = File(...)
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
        researcher_email=researcher_email,
    )

    return {
        "message": "Proposal uploaded successfully.",
        "proposal": proposal,
    }