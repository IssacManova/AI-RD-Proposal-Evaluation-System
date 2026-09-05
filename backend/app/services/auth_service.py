from passlib.context import CryptContext
from app.config.database import users_collection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})


def create_user(user: dict):
    return users_collection.insert_one(user)


def update_user_password(email: str, new_password_hash: str):
    return users_collection.update_one(
        {"email": email},
        {"$set": {"password": new_password_hash}}
    )