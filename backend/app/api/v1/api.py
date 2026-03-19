"""
Main API router configuration.
Aggregates all endpoint routers.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import users, health, auth, tts

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tts.router, prefix="/tts", tags=["tts"])
