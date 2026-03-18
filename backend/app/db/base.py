"""
SQLAlchemy base configuration.
All models should inherit from this Base class.
"""
from sqlalchemy.orm import DeclarativeBase, declared_attr
from sqlalchemy import Column, DateTime, func
from datetime import datetime


class Base(DeclarativeBase):
    """Base class for all database models."""

    # Generate table names automatically from class names
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    # Common columns for all tables
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
