"""
Voice Clone endpoints for synthesizing speech with a reference voice.
"""
from pathlib import Path
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.db.session import get_db
from app.schemas.voice_clone import (
    VoiceCloneSynthesisListResponse,
    VoiceCloneSynthesizeResponse,
)
from app.services.voice_clone_service import VoiceCloneService

logger = get_logger(__name__)

router = APIRouter()


@router.post(
    "/synthesize",
    response_model=VoiceCloneSynthesizeResponse,
    status_code=201,
)
async def synthesize_voice_clone(
    reference_audio: UploadFile = File(..., description="Reference voice audio file (WAV, 1-30s)"),
    target_text: str = Form(..., min_length=1, max_length=5000),
    clone_name: str = Form(default="Voice Clone", max_length=100),
    language: str = Form(default="English", max_length=50),
    speed: float = Form(default=1.0, ge=0.5, le=2.0),
    nfe_step: int = Form(default=10, ge=4, le=64),
    db: AsyncSession = Depends(get_db),
):
    """Synthesize speech using a reference voice audio and target text."""
    audio_bytes = await reference_audio.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file")

    service = VoiceCloneService(db)
    try:
        synthesis = await service.synthesize(
            clone_name=clone_name,
            language=language,
            target_text=target_text,
            reference_audio=audio_bytes,
            reference_filename=reference_audio.filename or "audio.wav",
            speed=speed,
            nfe_step=nfe_step,
        )
        return synthesis
    except httpx.HTTPStatusError as e:
        detail = f"Modal returned {e.response.status_code}"
        try:
            detail += f": {e.response.text[:500]}"
        except Exception:
            pass
        logger.error(f"Modal voice clone error: {detail}")
        raise HTTPException(status_code=502, detail=detail)
    except httpx.ReadTimeout:
        logger.error("Modal voice clone timeout (cold start?)")
        raise HTTPException(
            status_code=504,
            detail="Voice clone service timed out. This may be a cold start — please try again.",
        )
    except httpx.RequestError as e:
        logger.error(f"Modal voice clone connection error: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Could not connect to voice clone service: {e}",
        )
    except Exception as e:
        logger.error(f"Voice clone unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/syntheses",
    response_model=list[VoiceCloneSynthesisListResponse],
)
async def list_syntheses(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List voice clone syntheses with pagination."""
    try:
        service = VoiceCloneService(db)
        return await service.get_syntheses(skip, limit)
    except Exception as e:
        # Table may not exist yet — return empty list instead of crashing
        logger.warning(f"Could not list syntheses: {e}")
        return []


@router.get("/syntheses/{synthesis_id}/download")
async def download_synthesis(
    synthesis_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Download a synthesized audio file."""
    service = VoiceCloneService(db)
    synthesis = await service.get_synthesis(synthesis_id)
    if not synthesis:
        raise HTTPException(status_code=404, detail="Synthesis not found")

    file_path = Path(synthesis.file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Audio file not found on disk",
        )

    return FileResponse(
        path=str(file_path),
        media_type=synthesis.content_type,
        filename=synthesis.file_name,
    )
