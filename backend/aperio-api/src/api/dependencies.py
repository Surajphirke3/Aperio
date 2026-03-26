from fastapi import Header, HTTPException
from src.config.settings import settings
import base64
import json

async def verify_token(authorization: str = Header(default=None)) -> str:
    """Verify authentication token.
    
    In development mode, accepts any non-empty authorization header and parses the payload.
    In production, this should validate Clerk JWT tokens via pyjwt or clerk SDK.
    """
    if not authorization or not authorization.startswith("Bearer "):
        if settings.environment == "development":
            return "anonymous"
        raise HTTPException(status_code=401, detail="Valid Bearer Authorization header required")

    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Empty token")

    if settings.environment == "development":
        try:
            # Simple decode for dev mode to extract the Clerk user ID (sub)
            payload_b64 = token.split('.')[1]
            padded = payload_b64 + '=' * (4 - len(payload_b64) % 4)
            payload = json.loads(base64.urlsafe_b64decode(padded))
            return payload.get("sub", "anonymous")
        except Exception:
            return "anonymous"

    # In production: validate Clerk JWT properly
    try:
        # Example using clerk-backend-api:
        # from clerk_backend_api import Clerk
        # clerk = Clerk(bearer_auth=settings.clerk_secret_key)
        # session = clerk.sessions.verify_token(token)
        # return session.user_id
        return token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")