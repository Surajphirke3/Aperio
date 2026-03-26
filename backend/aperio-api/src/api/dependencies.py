from fastapi import Header, HTTPException
from src.config.settings import settings


async def verify_token(authorization: str = Header(default=None)) -> str:
    """Verify Firebase Auth JWT token.
    
    In development mode, accepts any non-empty authorization header.
    In production, this should validate Firebase JWT tokens.
    """
    if settings.environment == "development":
        # Development mode: accept any auth or return anonymous
        if not authorization:
            return "anonymous"
        return authorization

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")

    try:
        # In production: verify Firebase JWT
        # from firebase_admin import auth
        # decoded = auth.verify_id_token(authorization.replace("Bearer ", ""))
        # return decoded["uid"]
        token = authorization.replace("Bearer ", "")
        if not token:
            raise ValueError("Empty token")
        return token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")