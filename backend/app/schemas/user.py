from pydantic import BaseModel, EmailStr
from typing import Literal


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["researcher", "reviewer", "admin"] = "researcher"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str