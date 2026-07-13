from jose import jwt
from datetime import datetime, timedelta

from app.config.settings import settings

SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM


def create_access_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=1)

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)