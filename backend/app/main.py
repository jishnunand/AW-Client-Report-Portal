from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.api import clients, accounts, reports
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AW Client Report Portal API",
    description="API for managing client financial profiles and generating quarterly reports",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(clients.router)
app.include_router(accounts.router)
app.include_router(reports.router)


@app.get("/")
def read_root():
    """Root endpoint."""
    return {
        "message": "Welcome to AW Client Report Portal API",
        "docs": "/docs",
        "openapi_schema": "/openapi.json"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
