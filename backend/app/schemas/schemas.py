from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


class AccountBase(BaseModel):
    account_type: str
    institution: Optional[str] = None
    account_name: Optional[str] = None
    interest_rate: float = 0.0


class AccountCreate(AccountBase):
    pass


class Account(AccountBase):
    id: int
    client_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ClientBase(BaseModel):
    first_name: str
    spouse_name: Optional[str] = None
    dob: Optional[date] = None
    ssn_last4: Optional[str] = None
    marital_status: Optional[str] = None
    monthly_salary: float = 0.0
    expense_budget: float = 0.0
    reserve_target: float = 0.0
    property_address: Optional[str] = None
    home_value: float = 0.0


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    spouse_name: Optional[str] = None
    dob: Optional[date] = None
    ssn_last4: Optional[str] = None
    marital_status: Optional[str] = None
    monthly_salary: Optional[float] = None
    expense_budget: Optional[float] = None
    reserve_target: Optional[float] = None
    property_address: Optional[str] = None
    home_value: Optional[float] = None


class Client(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    accounts: List[Account] = []

    class Config:
        from_attributes = True


class ReportValueBase(BaseModel):
    field_name: str
    value: float = 0.0


class ReportValueCreate(ReportValueBase):
    account_id: Optional[int] = None


class ReportValue(ReportValueBase):
    id: int
    report_id: int
    account_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class QuarterlyReportBase(BaseModel):
    quarter: str  # Q1, Q2, Q3, Q4
    year: int


class QuarterlyReportCreate(QuarterlyReportBase):
    pass


class QuarterlyReportUpdate(BaseModel):
    quarter: Optional[str] = None
    year: Optional[int] = None


class QuarterlyReport(QuarterlyReportBase):
    id: int
    client_id: int
    report_date: datetime
    created_at: datetime
    updated_at: datetime
    report_values: List[ReportValue] = []

    class Config:
        from_attributes = True


class GeneratedPDFBase(BaseModel):
    file_name: str
    file_path: str


class GeneratedPDF(GeneratedPDFBase):
    id: int
    report_id: int
    generated_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
