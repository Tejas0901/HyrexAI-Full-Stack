"""
TTS generation schemas.
"""
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TTSEmotion(str, Enum):
    DEFAULT = "default"
    NEUTRAL = "neutral"
    WARM = "warm"
    EMPATHETIC = "empathetic"
    LAUGH = "laugh"


class TTSGenerateRequest(BaseModel):
    """Request to generate TTS audio."""

    text: str = Field(..., min_length=1, max_length=5000)
    emotion: TTSEmotion = Field(default=TTSEmotion.DEFAULT)
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    cfg_strength: float = Field(default=2.0, ge=0.0, le=5.0)
    nfe_step: int = Field(default=16, ge=4, le=64)


class TTSGenerationResponse(BaseModel):
    """Response after audio generation."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    text: str
    emotion: TTSEmotion
    file_name: str
    file_size: Optional[int]
    content_type: str
    created_at: datetime


class TTSGenerationListResponse(BaseModel):
    """Lighter response for listing generations."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    text: str
    emotion: TTSEmotion
    file_name: str
    created_at: datetime
