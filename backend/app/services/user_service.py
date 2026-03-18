"""
User service with business logic for user management.
"""
import hashlib
import base64
from typing import Optional

import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import CreateUser, UserUpdate
from app.services.base_service import BaseService

# Bcrypt has a 72-byte password limit
BCRYPT_MAX_PASSWORD_LENGTH = 72


def _prepare_password(password: str) -> bytes:
    """
    Prepare password for bcrypt hashing.
    
    Bcrypt has a 72-byte limit. For longer passwords, we hash with SHA256 first.
    This ensures consistent handling while maintaining security.
    
    Args:
        password: Plain text password
        
    Returns:
        Password bytes suitable for bcrypt (max 72 bytes)
    """
    password_bytes = password.encode('utf-8')
    
    if len(password_bytes) > BCRYPT_MAX_PASSWORD_LENGTH:
        # Hash with SHA256 and encode as base64 for bcrypt
        sha256_hash = hashlib.sha256(password_bytes).digest()
        return base64.b64encode(sha256_hash)
    
    return password_bytes


class UserService(BaseService[User, CreateUser, UserUpdate]):
    """
    Service class for user-related operations.
    """

    def __init__(self, db: AsyncSession):
        super().__init__(User, db)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against a hashed password."""
        prepared = _prepare_password(plain_password)
        return bcrypt.checkpw(prepared, hashed_password.encode('utf-8'))

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash a plain password."""
        prepared = _prepare_password(password)
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(prepared, salt)
        return hashed.decode('utf-8')

    async def get_by_email(self, email: str) -> Optional[User]:
        """
        Get a user by email address.

        Args:
            email: The email address to search for

        Returns:
            User instance or None if not found
        """
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def create(self, obj_in: CreateUser) -> User:
        """
        Create a new user with hashed password.

        Args:
            obj_in: User creation schema

        Returns:
            Created user instance
        """
        # Hash the password
        hashed_password = self.get_password_hash(obj_in.password)

        # Create user data dict
        user_data = obj_in.model_dump()
        del user_data["password"]  # Remove plain password
        user_data["hashed_password"] = hashed_password

        # Create user instance
        db_obj = User(**user_data)
        self.db.add(db_obj)
        await self.db.flush()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db_obj: User,
        obj_in: UserUpdate,
    ) -> User:
        """
        Update a user, handling password hashing if provided.

        Args:
            db_obj: Existing user instance
            obj_in: User update schema

        Returns:
            Updated user instance
        """
        update_data = obj_in.model_dump(exclude_unset=True)

        # Handle password update
        if "password" in update_data and update_data["password"]:
            update_data["hashed_password"] = self.get_password_hash(
                update_data["password"]
            )
            del update_data["password"]

        return await super().update(db_obj, update_data)

    async def authenticate(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password.

        Args:
            email: User's email address
            password: User's plain password

        Returns:
            User instance if authentication succeeds, None otherwise
        """
        user = await self.get_by_email(email)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return user

    async def is_active(self, user: User) -> bool:
        """Check if user is active."""
        return user.is_active

    async def is_verified(self, user: User) -> bool:
        """Check if user is verified."""
        return user.is_verified
