from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel

from app.config.database import users_collection
from app.dependencies.auth import get_current_user, require_role

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


def serialize_user(user: dict) -> dict:
    """Convert MongoDB document to JSON-serialisable dict (strip password)."""
    return {
        "_id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "researcher"),
        "status": user.get("status", "active"),
        "created_at": user.get("created_at", ""),
    }


# ── List all users (admin only) ──────────────────────────────────────────────

@router.get("/")
def get_all_users(current_user=Depends(require_role("admin"))):
    users = list(users_collection.find({}, {"password": 0}))
    return {"users": [serialize_user(u) for u in users]}


# ── Get single user (admin only) ────────────────────────────────────────────

@router.get("/{user_id}")
def get_user(user_id: str, current_user=Depends(require_role("admin"))):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = users_collection.find_one({"_id": oid}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return serialize_user(user)


# ── Update user (admin only) ─────────────────────────────────────────────────

class UserUpdateRequest(BaseModel):
    role: Optional[str] = None
    status: Optional[str] = None
    name: Optional[str] = None


@router.patch("/{user_id}")
def update_user(user_id: str, data: UserUpdateRequest, current_user=Depends(require_role("admin"))):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = users_collection.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully"}


# ── Delete user (admin only) ──────────────────────────────────────────────────

@router.delete("/{user_id}")
def delete_user(user_id: str, current_user=Depends(require_role("admin"))):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    # Prevent admin from deleting themselves
    user = users_collection.find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user["email"] == current_user["email"]:
        raise HTTPException(status_code=403, detail="You cannot delete your own account")

    users_collection.delete_one({"_id": oid})
    return {"message": "User deleted successfully"}
