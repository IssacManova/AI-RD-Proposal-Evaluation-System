from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import db
from app.config.settings import settings
from app.routes.auth import router as auth_router
from app.routes.proposal import router as proposal_router
from app.routes.evaluation import router as evaluation_router
from app.routes.users import router as users_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(proposal_router)
app.include_router(evaluation_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "Welcome to AI-RD Proposal Evaluation System"}


@app.get("/health")
def health():
    return {
        "status": "Running",
        "version": settings.APP_VERSION
    }