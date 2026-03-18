"""
Authentication endpoints for user registration and login.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import oauth2_scheme, get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import CreateUser, LoginUser, UserResponse
from app.schemas.auth import TokenResponse
from app.services.auth_service import AuthService
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger(__name__)


class RefreshTokenRequest(BaseModel):
    """Request schema for token refresh."""
    refresh_token: str


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    user_data: CreateUser,
    db: AsyncSession = Depends(get_db),
):
    """
    Register a new user.

    Args:
        user_data: User registration data (name, email, password)

    Returns:
        Created user data

    Raises:
        HTTPException: If user with email already exists
    """
    auth_service = AuthService(db)

    try:
        user, access_token, refresh_token = await auth_service.register(user_data)
        return user
    except ValueError as e:
        logger.warning(f"Registration failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    login_data: LoginUser,
    db: AsyncSession = Depends(get_db),
):
    """
    Login user and return access tokens.

    Args:
        login_data: Login credentials (email, password)

    Returns:
        Access and refresh tokens with user info

    Raises:
        HTTPException: If credentials are invalid
    """
    auth_service = AuthService(db)

    try:
        user, access_token, refresh_token = await auth_service.login(login_data)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
    except ValueError as e:
        logger.warning(f"Login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post(
    "/login/form",
    response_model=TokenResponse,
)
async def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """
    Login user using OAuth2 password flow (for Swagger UI).

    Args:
        form_data: OAuth2 form with username (email) and password

    Returns:
        Access and refresh tokens
    """
    auth_service = AuthService(db)
    login_data = LoginUser(email=form_data.username,
                           password=form_data.password)

    try:
        user, access_token, refresh_token = await auth_service.login(login_data)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
    except ValueError as e:
        logger.warning(f"Login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Refresh access and refresh tokens.

    Args:
        request: Refresh token request

    Returns:
        New access and refresh tokens

    Raises:
        HTTPException: If refresh token is invalid or expired
    """
    auth_service = AuthService(db)

    try:
        user, access_token, refresh_token = await auth_service.refresh_tokens(
            request.refresh_token
        )
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
    except ValueError as e:
        logger.warning(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get(
    "/me",
    response_model=UserResponse,
)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    """
    Get current authenticated user information.

    Returns:
        Current user data
    """
    return current_user
