# AW Client Report Portal

A secure internal web portal for managing high-net-worth client financial profiles and generating professional quarterly reports (SACS & TCC).

## Overview

### Goal

Reduce report preparation time from 1 full day to a few minutes by:
- Storing reusable client financial data
- Automating quarterly data entry
- Calculating totals and net worth automatically
- Generating professional PDF reports

### Primary Users

- Andrew
- Rebecca
- Maryann

---

## Project Structure

```
AW-Client-Report-Portal/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── clients.py        # Client CRUD endpoints
│   │   │   ├── accounts.py       # Account management
│   │   │   └── reports.py        # Quarterly report endpoints
│   │   ├── models/
│   │   │   └── database_models.py # SQLAlchemy ORM models
│   │   ├── schemas/
│   │   │   └── schemas.py         # Pydantic validation schemas
│   │   ├── calculations/
│   │   │   └── financial_calculations.py  # SACS & TCC calculations
│   │   ├── pdf/
│   │   │   └── generators.py      # PDF report generation
│   │   ├── services/              # Business logic services
│   │   ├── database.py            # Database configuration
│   │   └── main.py                # FastAPI application entry point
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── services/
│   │   │   └── api.js             # API client
│   │   ├── styles/                # CSS files
│   │   ├── App.jsx                # Main App component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── public/                    # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── docs/                          # Documentation
├── Dockerfile                     # Backend Docker image
├── docker-compose.yml             # Docker Compose configuration
└── README.md                      # This file
```

---

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (initially)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **PDF Generation**: ReportLab
- **Python**: 3.11+

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Deployment
- **Container**: Docker
- **Orchestration**: Docker Compose
- **Hosting**: Railway (recommended)

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 16+
- Docker & Docker Compose (optional)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the server:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Access API at `http://localhost:8000` with docs at `/docs`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

   Access frontend at `http://localhost:5173`

### Docker Setup

```bash
docker-compose up --build
```

---

## Database Schema

### clients
- id, first_name, spouse_name, dob, ssn_last4, marital_status
- monthly_salary, expense_budget, reserve_target
- property_address, home_value
- created_at, updated_at

### accounts
- id, client_id, account_type, institution, account_name
- interest_rate, created_at

### quarterly_reports
- id, client_id, quarter, year, report_date
- created_at, updated_at

### report_values
- id, report_id, account_id, field_name, value, created_at

### generated_pdfs
- id, report_id, file_path, file_name, generated_at, created_at

---

## API Endpoints

### Clients
- POST /api/clients
- GET /api/clients
- GET /api/clients/{id}
- PUT /api/clients/{id}
- DELETE /api/clients/{id}

### Accounts
- POST /api/accounts/{client_id}
- GET /api/accounts/client/{client_id}
- GET /api/accounts/{id}
- DELETE /api/accounts/{id}

### Reports
- POST /api/reports/{client_id}
- GET /api/reports/client/{client_id}
- GET /api/reports/{id}
- POST /api/reports/{id}/values
- GET /api/reports/{id}/values
- DELETE /api/reports/{id}

---

## Next Steps

1. Review the project structure
2. Set up local development
3. Create test data
4. Build client management UI
5. Implement quarterly forms
6. Test calculations
7. Generate PDFs
8. Deploy to Railway

Good luck! 🚀