"""
notification_service.py
-----------------------
Database service for managing user notifications in MongoDB.
"""

from datetime import datetime, timezone
from bson import ObjectId
from app.config.database import db

notifications_collection = db["notifications"]


def create_notification(
    user_email: str,
    title: str,
    message: str,
    proposal_id: str,
    notification_type: str = "review_submitted"
) -> dict:
    """Insert a new notification document into MongoDB."""
    doc = {
        "user_email": user_email,
        "title": title,
        "message": message,
        "proposal_id": str(proposal_id),
        "type": notification_type,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = notifications_collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


def get_user_notifications(user_email: str, limit: int = 25) -> dict:
    """Fetch notifications for a user sorted by newest first, with unread count."""
    cursor = notifications_collection.find(
        {"user_email": user_email}
    ).sort([("created_at", -1), ("_id", -1)]).limit(limit)

    notifications = []
    unread_count = 0

    for item in cursor:
        item["_id"] = str(item["_id"])
        if not item.get("read", False):
            unread_count += 1
        notifications.append(item)

    return {
        "notifications": notifications,
        "unread_count": unread_count
    }


def mark_notification_as_read(notification_id: str, user_email: str) -> bool:
    """Mark a single notification as read."""
    try:
        obj_id = ObjectId(notification_id)
    except Exception:
        return False

    res = notifications_collection.update_one(
        {"_id": obj_id, "user_email": user_email},
        {"$set": {"read": True}}
    )
    return res.modified_count > 0


def mark_all_as_read(user_email: str) -> int:
    """Mark all unread notifications for a user as read."""
    res = notifications_collection.update_many(
        {"user_email": user_email, "read": False},
        {"$set": {"read": True}}
    )
    return res.modified_count
