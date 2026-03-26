from fastapi import Header, HTTPException
from src.config.settings import settings


async def verify_token(authorization: str = Header(default=None)) -> str:
    """Verify authentication token.
    
    In development mode, accepts any non-empty authorization header.
    When Clerk tokens are sent, extracts the Bearer token.
    In production, this should validate Clerk JWT tokens.
    """
    if settings.environment == "development":
        # Development mode: accept any auth or return anonymous
        if not authorization:
            return "anonymous"
        # Strip "Bearer " prefix if present
        token = authorization.replace("Bearer ", "").strip()
        return token if token else "anonymous"

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")

    try:
        token = authorization.replace("Bearer ", "").strip()
        if not token:
            raise ValueError("Empty token")
        # In production: validate Clerk JWT using clerk-backend-api
        # from clerk_backend_api import Clerk
        # clerk = Clerk(bearer_auth=settings.clerk_secret_key)
        # session = clerk.sessions.verify_token(token)
        # return session.user_id
        return token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")