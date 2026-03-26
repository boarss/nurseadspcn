from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from core.config import get_settings

security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Verify the Supabase JWT token and extract the user's UUID.
    For local development/scaffolding, if the token is "mock_token", we return a dummy ID.
    """
    token = credentials.credentials
    if token == "mock_token":
        # Useful for local testing without passing a real token
        return "00000000-0000-0000-0000-000000000000"
        
    try:
        # Supabase uses HS256 for symmetric signing with JWT Secret.
        # But verifying JWT fully requires having the JWT secret in backend env vars.
        # For simplicity in this scaffold without passing the JWT secret around,
        # we decode without verification just to extract the 'sub' (User ID).
        # WARNING: In production, always verify the signature using JWT_SECRET!
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: no sub claim")
        return user_id
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
