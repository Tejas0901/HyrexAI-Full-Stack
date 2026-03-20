"""
Voice Clone service for proxying synthesis requests to Modal and managing audio files.
"""
import base64
import io
import uuid
from pathlib import Path
from typing import List, Optional, Tuple

import httpx
from pydub import AudioSegment
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.models.voice_clone import VoiceCloneSynthesis, VoiceCloneStatus

settings = get_settings()
logger = get_logger(__name__)

MODAL_VOICE_CLONE_URL = (
    "https://voicehyrexai--voice-clone-api-voicecloneapi-synthesize.modal.run"
)
VOICE_CLONE_MEDIA_DIR = "media/voice_clone"


def _convert_to_wav(audio_bytes: bytes, source_filename: str) -> bytes:
    """Convert any audio format to WAV (16-bit PCM, mono, 16kHz).
    Modal API requires WAV format."""
    # Guess format from filename extension
    ext = Path(source_filename).suffix.lower().lstrip(".")
    fmt_map = {
        "mp3": "mp3",
        "wav": "wav",
        "m4a": "m4a",
        "flac": "flac",
        "ogg": "ogg",
        "webm": "webm",
        "weba": "webm",
        "mp4": "mp4",
        "aac": "aac",
    }
    fmt = fmt_map.get(ext, ext) if ext else None

    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format=fmt)
    except Exception:
        # Fallback: let pydub auto-detect
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))

    # Normalize to 16-bit PCM mono 16kHz (optimal for voice cloning)
    audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)

    buf = io.BytesIO()
    audio.export(buf, format="wav")
    return buf.getvalue()


class VoiceCloneService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def synthesize(
        self,
        *,
        clone_name: str,
        language: str,
        target_text: str,
        reference_audio: bytes,
        reference_filename: str,
        speed: float = 1.0,
        nfe_step: int = 10,
    ) -> VoiceCloneSynthesis:
        """
        Send reference audio + target text to the Modal voice clone endpoint,
        save returned audio to filesystem, create DB record.
        """
        audio_bytes, content_type = await self._call_modal(
            target_text=target_text,
            reference_audio=reference_audio,
            reference_filename=reference_filename,
            speed=speed,
            nfe_step=nfe_step,
        )

        file_name = f"{uuid.uuid4()}.wav"
        file_path = self._save_audio(file_name, audio_bytes)

        synthesis = VoiceCloneSynthesis(
            clone_name=clone_name,
            language=language,
            target_text=target_text,
            file_path=str(file_path),
            file_name=file_name,
            file_size=len(audio_bytes),
            content_type=content_type or "audio/wav",
            status=VoiceCloneStatus.READY,
        )
        self.db.add(synthesis)
        await self.db.flush()
        await self.db.refresh(synthesis)
        return synthesis

    async def _call_modal(
        self,
        *,
        target_text: str,
        reference_audio: bytes,
        reference_filename: str,
        speed: float = 1.0,
        nfe_step: int = 10,
    ) -> Tuple[bytes, str]:
        """
        Call the Modal voice clone endpoint.
        Converts audio to WAV first, then base64-encodes it.
        Returns raw audio/wav binary.
        """
        # Convert uploaded audio (MP3/WebM/M4A/etc.) to WAV
        logger.info(f"Converting reference audio ({reference_filename}) to WAV")
        wav_bytes = _convert_to_wav(reference_audio, reference_filename)
        ref_audio_b64 = base64.b64encode(wav_bytes).decode("utf-8")

        payload = {
            "text": target_text,
            "ref_audio_base64": ref_audio_b64,
            "nfe_step": nfe_step,
            "speed": speed,
        }

        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                MODAL_VOICE_CLONE_URL,
                json=payload,
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()

        content_type = response.headers.get("content-type", "audio/wav")
        return response.content, content_type

    def _save_audio(self, file_name: str, audio_bytes: bytes) -> Path:
        """Save audio bytes to the media directory."""
        media_dir = Path(VOICE_CLONE_MEDIA_DIR)
        media_dir.mkdir(parents=True, exist_ok=True)
        file_path = media_dir / file_name
        file_path.write_bytes(audio_bytes)
        return file_path

    async def get_synthesis(
        self, synthesis_id: uuid.UUID
    ) -> Optional[VoiceCloneSynthesis]:
        """Get a single synthesis by ID."""
        result = await self.db.execute(
            select(VoiceCloneSynthesis).where(
                VoiceCloneSynthesis.id == synthesis_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_syntheses(
        self, skip: int = 0, limit: int = 20
    ) -> List[VoiceCloneSynthesis]:
        """List voice clone syntheses with pagination."""
        result = await self.db.execute(
            select(VoiceCloneSynthesis)
            .order_by(VoiceCloneSynthesis.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
