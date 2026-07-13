from fastapi import FastAPI
from app.config.database import db
from app.config.settings import settings
from app.routes.auth import router as auth_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "Welcome to AI-RD Proposal Evaluation System"}


@app.get("/health")
def health():
    return {
        "status": "Running",
        "version": settings.APP_VERSION
    }