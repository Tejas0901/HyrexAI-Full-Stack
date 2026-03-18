"""
API dependencies for authentication and authorization.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.session import get_db
from app.models.user import User
from app.services.user_service import UserService
from app.utils.security import decode_token, verify_token_type
from app.core.logging import get_logger

logger = get_logger(__name__)

# OAuth2 scheme for token URL
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    scheme_name="JWT"
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Dependency to get the current authenticated user.

    Args:
        token: JWT access token from Authorization header
        db: Database session

    Returns:
        Authenticated User model

    Raises:
        HTTPException: If token is invalid, expired, or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode and verify token
    payload = decode_token(token)
    if payload is None:
        logger.warning("Invalid or expired token")
        raise credentials_exception

    # Verify token type is access
    if not verify_token_type(payload, "access"):
        logger.warning("Invalid token type")
        raise credentials_exception

    # Get user ID from token
    user_id_str = payload.get("sub")
    if user_id_str is None:
        logger.warning("Token missing subject claim")
        raise credentials_exception

    # Convert to UUID
    try:
        user_id = UUID(user_id_str)
    except ValueError:
        logger.warning(f"Invalid UUID in token: {user_id_str}")
        raise credentials_exception

    # Get user from database
    user_service = UserService(db)
    user = await user_service.get(user_id)

    if user is None:
        logger.warning(f"User not found: {user_id}")
        raise credentials_exception

    # Check if user is active
    if not user.is_active:
        logger.warning(f"Inactive user attempted access: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency to get the current active user.
    Additional check to ensure user is verified.

    Args:
        current_user: User from get_current_user dependency

    Returns:
        Active and verified User model

    Raises:
        HTTPException: If user is not verified
    """
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User email not verified",
        )
    return current_user


async def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency to get the current superuser.
    For admin-only endpoints.

    Args:
        current_user: User from get_current_user dependency

    Returns:
        Superuser User model

    Raises:
        HTTPException: If user is not a superuser
    """
    # Note: You may want to add an is_superuser field to the User model
    # For now, this is a placeholder implementation
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Not enough permissions",
    )
