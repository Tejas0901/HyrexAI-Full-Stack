"""
TTS endpoints for text-to-speech generation and audio download.
"""
from pathlib import Path
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.db.session import get_db
from app.schemas.tts import (
    TTSGenerateRequest,
    TTSGenerationListResponse,
    TTSGenerationResponse,
)
from app.services.tts_service import TTSService

logger = get_logger(__name__)

router = APIRouter()


@router.post(
    "/generate",
    response_model=TTSGenerationResponse,
    status_code=201,
)
async def generate_tts(
    request: TTSGenerateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate TTS audio from text and emotion."""
    tts_service = TTSService(db)
    try:
        generation = await tts_service.generate_audio(request)
        return generation
    except httpx.HTTPStatusError as e:
        logger.error(f"Modal TTS error: {e.response.status_code}")
        raise HTTPException(
            status_code=502,
            detail="TTS service unavailable",
        )
    except httpx.RequestError as e:
        logger.error(f"Modal TTS connection error: {e}")
        raise HTTPException(
            status_code=502,
            detail="Could not connect to TTS service",
        )


@router.get(
    "/generations",
    response_model=list[TTSGenerationListResponse],
)
async def list_generations(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List TTS generations with pagination."""
    tts_service = TTSService(db)
    return await tts_service.get_generations(skip, limit)


@router.get("/generations/{generation_id}/download")
async def download_audio(
    generation_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Download a generated audio file."""
    tts_service = TTSService(db)
    generation = await tts_service.get_generation(generation_id)
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    file_path = Path(generation.file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Audio file not found on disk",
        )

    return FileResponse(
        path=str(file_path),
        media_type=generation.content_type,
        filename=generation.file_name,
    )
