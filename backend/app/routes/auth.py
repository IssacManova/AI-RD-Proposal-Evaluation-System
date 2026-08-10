from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.schemas.user import UserRegister, UserLogin
from app.services.auth_service import (
    hash_password,
    verify_password,
    get_user_by_email,
    create_user
)
from app.utils.jwt import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserRegister):

    existing_user = get_user_by_email(user.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user_dict = user.model_dump()
    user_dict["password"] = hash_password(user.password)
    user_dict["created_at"] = datetime.utcnow().isoformat()
    user_dict["status"] = "active"

    create_user(user_dict)

    return {
        "message": "User Registered Successfully"
    }


@router.post("/login")
def login(user: UserLogin):

    db_user = get_user_by_email(user.email)

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    token = create_access_token({
        "email": db_user["email"],
        "role": db_user["role"],
        "name": db_user.get("name", "")
    })

    return {
        "access_token": token,
        "token_type": "Bearer"
    }