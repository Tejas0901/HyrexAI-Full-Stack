"""
Authentication service for user registration and login.
"""
from typing import Optional, Tuple
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import CreateUser, LoginUser
from app.services.user_service import UserService
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_token_type,
)
from app.core.logging import get_logger

logger = get_logger(__name__)


class AuthService:
    """
    Service class for authentication-related operations.
    Handles user registration, login, and token generation.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_service = UserService(db)

    async def register(self, user_data: CreateUser) -> Tuple[User, str, str]:
        """
        Register a new user.

        Args:
            user_data: User creation schema with name, email, and password

        Returns:
            Tuple of (created_user, access_token, refresh_token)

        Raises:
            ValueError: If user with email already exists
        """
        # Check if user already exists
        existing_user = await self.user_service.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        # Create user
        user = await self.user_service.create(user_data)
        logger.info(f"Registered new user: {user.id} - {user.email}")

        # Generate tokens
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        return user, access_token, refresh_token

    async def login(self, login_data: LoginUser) -> Tuple[User, str, str]:
        """
        Authenticate user and generate tokens.

        Args:
            login_data: Login schema with email and password

        Returns:
            Tuple of (user, access_token, refresh_token)

        Raises:
            ValueError: If credentials are invalid or user is inactive
        """
        # Get user by email
        user = await self.user_service.get_by_email(login_data.email)
        if not user:
            raise ValueError("Invalid email or password")

        # Verify password
        if not self.user_service.verify_password(
            login_data.password, user.hashed_password
        ):
            raise ValueError("Invalid email or password")

        # Check if user is active
        if not user.is_active:
            raise ValueError("User account is deactivated")

        # Generate tokens
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        logger.info(f"User logged in: {user.id} - {user.email}")

        return user, access_token, refresh_token

    async def refresh_tokens(self, refresh_token: str) -> Tuple[User, str, str]:
        """
        Refresh access and refresh tokens using a valid refresh token.

        Args:
            refresh_token: Valid refresh token

        Returns:
            Tuple of (user, new_access_token, new_refresh_token)

        Raises:
            ValueError: If refresh token is invalid, expired, or user not found
        """
        # Decode and verify refresh token
        payload = decode_token(refresh_token)
        if payload is None:
            raise ValueError("Invalid or expired refresh token")

        # Verify token type is refresh
        if not verify_token_type(payload, "refresh"):
            raise ValueError("Invalid token type")

        # Get user ID from token
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise ValueError("Invalid token payload")

        # Convert to UUID and get user
        try:
            user_id = UUID(user_id_str)
        except ValueError:
            raise ValueError("Invalid user ID in token")

        user = await self.user_service.get(user_id)
        if not user:
            raise ValueError("User not found")

        if not user.is_active:
            raise ValueError("User account is deactivated")

        # Generate new tokens (token rotation)
        new_access_token = create_access_token(user.id)
        new_refresh_token = create_refresh_token(user.id)

        logger.info(f"Tokens refreshed for user: {user.id}")

        return user, new_access_token, new_refresh_token

    async def get_current_user(self, user_id: str) -> Optional[User]:
        """
        Get current user by ID from token.

        Args:
            user_id: User ID from decoded token

        Returns:
            User instance or None if not found
        """
        try:
            uuid_id = UUID(user_id)
            return await self.user_service.get(uuid_id)
        except (ValueError, AttributeError):
            return None
