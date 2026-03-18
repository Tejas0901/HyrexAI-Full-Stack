"""
User management endpoints.
"""
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import CreateUser, UserResponse, UserUpdate
from app.services.user_service import UserService
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.get("/", response_model=List[UserResponse])
async def list_users(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        20, ge=1, le=100, description="Number of records to return"),
    db: AsyncSession = Depends(get_db),
):
    """
    List all users with pagination.
    """
    service = UserService(db)
    users = await service.get_multi(skip=skip, limit=limit)
    return users


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: CreateUser,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new user.
    """
    service = UserService(db)

    # Check if user with email already exists
    existing_user = await service.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    user = await service.create(user_data)
    logger.info(f"Created user: {user.id}")
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Get a specific user by ID.
    """
    service = UserService(db)
    user = await service.get(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: UUID,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update a user.
    """
    service = UserService(db)
    user = await service.get(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    updated_user = await service.update(user, user_data)
    logger.info(f"Updated user: {user_id}")
    return updated_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a user.
    """
    service = UserService(db)
    user = await service.get(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    await service.delete(user_id)
    logger.info(f"Deleted user: {user_id}")
    return None
