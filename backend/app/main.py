from fastapi import FastAPI

from app.config.settings import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)


@app.get("/")
def root():
    return {
        "message": "Welcome to AI-RD Proposal Evaluation System"
    }


@app.get("/health")
def health():
    return {
        "status": "Running",
        "version": settings.APP_VERSION
    }