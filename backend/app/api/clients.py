from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.database_models import Client
from app.schemas.schemas import Client as ClientSchema, ClientCreate, ClientUpdate
from typing import List

router = APIRouter(prefix="/api/clients", tags=["clients"])


@router.post("/", response_model=ClientSchema, status_code=status.HTTP_201_CREATED)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    """Create a new client."""
    db_client = Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.get("/", response_model=List[ClientSchema])
def list_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all clients with pagination."""
    clients = db.query(Client).offset(skip).limit(limit).all()
    return clients


@router.get("/{client_id}", response_model=ClientSchema)
def get_client(client_id: int, db: Session = Depends(get_db)):
    """Get a specific client by ID."""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return db_client


@router.put("/{client_id}", response_model=ClientSchema)
def update_client(client_id: int, client: ClientUpdate, db: Session = Depends(get_db)):
    """Update a client."""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    update_data = client.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_client, key, value)
    
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Delete a client."""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    db.delete(db_client)
    db.commit()
    return None
