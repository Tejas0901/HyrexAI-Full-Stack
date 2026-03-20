"""
Voice Clone model definition.
"""
import enum
import uuid

from sqlalchemy import String, Text, Integer, Float, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class VoiceCloneStatus(str, enum.Enum):
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class VoiceCloneSynthesis(Base):
    """
    Stores metadata for each voice clone synthesis request.
    """

    __tablename__ = "voice_clone_synthesis"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    clone_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    language: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="English",
    )
    target_text: Mapped[str] = mapped_column(
        Text,
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
    status: Mapped[VoiceCloneStatus] = mapped_column(
        Enum(VoiceCloneStatus, name="voice_clone_status", native_enum=True),
        nullable=False,
        default=VoiceCloneStatus.READY,
    )

    def __repr__(self) -> str:
        return f"<VoiceCloneSynthesis(id={self.id}, name={self.clone_name})>"
