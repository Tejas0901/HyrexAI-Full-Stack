"""
Voice Clone schemas.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class VoiceCloneSynthesizeResponse(BaseModel):
    """Response after voice clone synthesis."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    clone_name: str
    language: str
    target_text: str
    file_name: str
    file_size: Optional[int]
    content_type: str
    status: str
    created_at: datetime


class VoiceCloneSynthesisListResponse(BaseModel):
    """Lighter response for listing syntheses."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    clone_name: str
    language: str
    target_text: str
    file_name: str
    status: str
    created_at: datetime
