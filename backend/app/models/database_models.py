from sqlalchemy import Column, Integer, String, Date, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    spouse_name = Column(String(100), nullable=True)
    dob = Column(Date, nullable=True)
    ssn_last4 = Column(String(4), nullable=True)
    marital_status = Column(String(50), nullable=True)
    monthly_salary = Column(Float, default=0.0)
    expense_budget = Column(Float, default=0.0)
    reserve_target = Column(Float, default=0.0)
    property_address = Column(String(255), nullable=True)
    home_value = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    accounts = relationship("Account", back_populates="client", cascade="all, delete-orphan")
    quarterly_reports = relationship("QuarterlyReport", back_populates="client", cascade="all, delete-orphan")


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    account_type = Column(String(50), nullable=False)  # IRA, Roth IRA, 401K, Pension, Brokerage, Joint, etc.
    institution = Column(String(100), nullable=True)
    account_name = Column(String(100), nullable=True)
    interest_rate = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="accounts")
    report_values = relationship("ReportValue", back_populates="account", cascade="all, delete-orphan")


class QuarterlyReport(Base):
    __tablename__ = "quarterly_reports"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    quarter = Column(String(10), nullable=False)  # Q1, Q2, Q3, Q4
    year = Column(Integer, nullable=False)
    report_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    client = relationship("Client", back_populates="quarterly_reports")
    report_values = relationship("ReportValue", back_populates="quarterly_report", cascade="all, delete-orphan")
    generated_pdf = relationship("GeneratedPDF", back_populates="quarterly_report", uselist=False, cascade="all, delete-orphan")


class ReportValue(Base):
    __tablename__ = "report_values"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("quarterly_reports.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)
    field_name = Column(String(100), nullable=False)
    value = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    quarterly_report = relationship("QuarterlyReport", back_populates="report_values")
    account = relationship("Account", back_populates="report_values")


class GeneratedPDF(Base):
    __tablename__ = "generated_pdfs"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("quarterly_reports.id"), nullable=False, unique=True)
    file_path = Column(String(255), nullable=False)
    file_name = Column(String(100), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    quarterly_report = relationship("QuarterlyReport", back_populates="generated_pdf")
