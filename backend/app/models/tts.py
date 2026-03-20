"""
TTS Generation model definition.
"""
import enum
import uuid

from sqlalchemy import String, Text, Integer, Float, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class TTSEmotion(str, enum.Enum):
    DEFAULT = "default"
    NEUTRAL = "neutral"
    WARM = "warm"
    EMPATHETIC = "empathetic"
    LAUGH = "laugh"


class TTSGeneration(Base):
    """
    Stores metadata for each TTS audio generation.
    """

    __tablename__ = "tts_generation"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    emotion: Mapped[TTSEmotion] = mapped_column(
        Enum(TTSEmotion, name="tts_emotion", native_enum=True),
        nullable=False,
    )
    file_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    file_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=True,
    )
    content_type: Mapped[str] = mapped_column(
        String(50),
        default="audio/wav",
    )

    def __repr__(self) -> str:
        return f"<TTSGeneration(id={self.id}, emotion={self.emotion})>"
