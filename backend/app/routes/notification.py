from fastapi import APIRouter, HTTPException, Depends
from app.dependencies.auth import get_current_user
from app.services.notification_service import (
    get_user_notifications,
    mark_notification_as_read,
    mark_all_as_read
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/my-notifications")
def fetch_my_notifications(current_user: dict = Depends(get_current_user)):
    """Fetch notifications for the logged-in user."""
    data = get_user_notifications(current_user["email"])
    return data


@router.put("/{notification_id}/read")
def mark_read(notification_id: str, current_user: dict = Depends(get_current_user)):
    """Mark a single notification as read."""
    success = mark_notification_as_read(notification_id, current_user["email"])
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found or already read")
    return {"message": "Notification marked as read"}


@router.put("/mark-all-read")
def mark_all_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read for current user."""
    count = mark_all_as_read(current_user["email"])
    return {"message": f"Marked {count} notifications as read"}
