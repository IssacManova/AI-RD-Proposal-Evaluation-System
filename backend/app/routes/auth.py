from fastapi import APIRouter
from app.schemas.user import UserRegister, UserLogin
from app.services.auth_service import hash_password
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(user: UserRegister):

    hashed_password = hash_password(user.password)

    return {
        "message": "User registered successfully",
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "hashed_password": hashed_password
    }


@router.post("/login")
def login(user: UserLogin):

    token = create_access_token({"email": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }