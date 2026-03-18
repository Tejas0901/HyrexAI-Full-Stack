"""
Authentication related Pydantic schemas.
"""
from pydantic import BaseModel

from app.schemas.user import UserResponse


class TokenResponse(BaseModel):
    """Schema for token response after login."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    """Schema for JWT token payload."""
    sub: str | None = None
    exp: int | None = None
    type: str | None = None
