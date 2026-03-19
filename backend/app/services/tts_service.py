"""
TTS service for proxying requests to Modal and managing audio files.
"""
import uuid
from pathlib import Path
from typing import List, Optional, Tuple

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.models.tts import TTSGeneration, TTSEmotion
from app.schemas.tts import TTSGenerateRequest

settings = get_settings()
logger = get_logger(__name__)


class TTSService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def generate_audio(
        self, request: TTSGenerateRequest
    ) -> TTSGeneration:
        """
        Send text+emotion to Modal TTS endpoint,
        save returned audio to filesystem, create DB record.
        """
        audio_bytes, content_type = await self._call_modal(request)

        file_name = f"{uuid.uuid4()}.wav"
        file_path = self._save_audio(file_name, audio_bytes)

        generation = TTSGeneration(
            text=request.text,
            emotion=TTSEmotion(request.emotion.value),
            file_path=str(file_path),
            file_name=file_name,
            file_size=len(audio_bytes),
            content_type=content_type or "audio/wav",
        )
        self.db.add(generation)
        await self.db.flush()
        await self.db.refresh(generation)
        return generation

    async def _call_modal(
        self, request: TTSGenerateRequest
    ) -> Tuple[bytes, str]:
        """Call the Modal TTS endpoint and return (audio_bytes, content_type)."""
        headers = {"Content-Type": "application/json"}
        if settings.modal_tts_api_key:
            headers["Authorization"] = f"Bearer {settings.modal_tts_api_key}"

        payload = {
            "text": request.text,
            "emotion": request.emotion.value,
            "nfe_step": request.nfe_step,
            "speed": request.speed,
            "cfg_strength": request.cfg_strength,
        }

        async with httpx.AsyncClient(
            timeout=settings.tts_request_timeout
        ) as client:
            response = await client.post(
                settings.modal_tts_endpoint_url,
                json=payload,
                headers=headers,
            )
            response.raise_for_status()

        content_type = response.headers.get("content-type", "audio/wav")
        return response.content, content_type

    def _save_audio(self, file_name: str, audio_bytes: bytes) -> Path:
        """Save audio bytes to the media directory."""
        media_dir = Path(settings.tts_media_dir)
        media_dir.mkdir(parents=True, exist_ok=True)
        file_path = media_dir / file_name
        file_path.write_bytes(audio_bytes)
        return file_path

    async def get_generation(
        self, generation_id: uuid.UUID
    ) -> Optional[TTSGeneration]:
        """Get a single generation by ID."""
        result = await self.db.execute(
            select(TTSGeneration).where(
                TTSGeneration.id == generation_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_generations(
        self, skip: int = 0, limit: int = 20
    ) -> List[TTSGeneration]:
        """List TTS generations with pagination."""
        result = await self.db.execute(
            select(TTSGeneration)
            .order_by(TTSGeneration.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
