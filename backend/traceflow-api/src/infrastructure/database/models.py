from sqlalchemy import Column, String, Float, Date, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime, date
from .connection import Base


class BatchORM(Base):
    __tablename__ = "batches"

    id = Column(String, primary_key=True)
    material = Column(String, nullable=False)
    vendor = Column(String, nullable=False)
    initial_quantity_kg = Column(Float, nullable=False)
    current_stage = Column(String, default="purchase")
    created_at = Column(Date, default=date.today)

    lifecycle = relationship("BatchLifecycleORM", back_populates="batch")
    entries = relationship("EntryORM", back_populates="batch")


class BatchLifecycleORM(Base):
    __tablename__ = "batch_lifecycle"

    id = Column(Integer, primary_key=True, autoincrement=True)
    batch_id = Column(String, ForeignKey("batches.id"), nullable=False)
    stage = Column(String, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    loss_kg = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)

    batch = relationship("BatchORM", back_populates="lifecycle")


class EntryORM(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    batch_id = Column(String, ForeignKey("batches.id"), nullable=True)
    intent = Column(String, nullable=False)
    material = Column(String, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    vendor = Column(String, nullable=True)
    stage = Column(String, nullable=True)
    loss_kg = Column(Float, nullable=True)
    raw_input = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    batch = relationship("BatchORM", back_populates="entries")


class VendorORM(Base):
    __tablename__ = "vendors"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    contact = Column(String, nullable=True)
    created_at = Column(Date, default=date.today)
