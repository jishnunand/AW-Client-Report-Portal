from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.database_models import QuarterlyReport, Client, ReportValue
from app.schemas.schemas import (
    QuarterlyReport as QuarterlyReportSchema,
    QuarterlyReportCreate,
    ReportValue as ReportValueSchema,
    ReportValueCreate,
)
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/{client_id}", response_model=QuarterlyReportSchema, status_code=status.HTTP_201_CREATED)
def create_quarterly_report(
    client_id: int,
    report: QuarterlyReportCreate,
    db: Session = Depends(get_db)
):
    """Create a new quarterly report for a client."""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    db_report = QuarterlyReport(client_id=client_id, **report.model_dump())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@router.get("/client/{client_id}", response_model=List[QuarterlyReportSchema])
def list_client_reports(client_id: int, db: Session = Depends(get_db)):
    """List all quarterly reports for a client."""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    reports = db.query(QuarterlyReport).filter(QuarterlyReport.client_id == client_id).all()
    return reports


@router.get("/{report_id}", response_model=QuarterlyReportSchema)
def get_quarterly_report(report_id: int, db: Session = Depends(get_db)):
    """Get a specific quarterly report."""
    db_report = db.query(QuarterlyReport).filter(QuarterlyReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return db_report


@router.post("/{report_id}/values", response_model=ReportValueSchema, status_code=status.HTTP_201_CREATED)
def save_report_value(
    report_id: int,
    value: ReportValueCreate,
    db: Session = Depends(get_db)
):
    """Save a value for a quarterly report."""
    db_report = db.query(QuarterlyReport).filter(QuarterlyReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    
    db_value = ReportValue(report_id=report_id, **value.model_dump())
    db.add(db_value)
    db.commit()
    db.refresh(db_value)
    return db_value


@router.get("/{report_id}/values", response_model=List[ReportValueSchema])
def get_report_values(report_id: int, db: Session = Depends(get_db)):
    """Get all values for a quarterly report."""
    db_report = db.query(QuarterlyReport).filter(QuarterlyReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    
    values = db.query(ReportValue).filter(ReportValue.report_id == report_id).all()
    return values


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quarterly_report(report_id: int, db: Session = Depends(get_db)):
    """Delete a quarterly report."""
    db_report = db.query(QuarterlyReport).filter(QuarterlyReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    
    db.delete(db_report)
    db.commit()
    return None
