from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.database_models import Account, Client
from app.schemas.schemas import Account as AccountSchema, AccountCreate
from typing import List

router = APIRouter(prefix="/api/accounts", tags=["accounts"])


@router.post("/{client_id}", response_model=AccountSchema, status_code=status.HTTP_201_CREATED)
def create_account(client_id: int, account: AccountCreate, db: Session = Depends(get_db)):
    """Create a new account for a client."""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    db_account = Account(client_id=client_id, **account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


@router.get("/client/{client_id}", response_model=List[AccountSchema])
def list_accounts(client_id: int, db: Session = Depends(get_db)):
    """List all accounts for a client."""
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    accounts = db.query(Account).filter(Account.client_id == client_id).all()
    return accounts


@router.get("/{account_id}", response_model=AccountSchema)
def get_account(account_id: int, db: Session = Depends(get_db)):
    """Get a specific account by ID."""
    db_account = db.query(Account).filter(Account.id == account_id).first()
    if not db_account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return db_account


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(account_id: int, db: Session = Depends(get_db)):
    """Delete an account."""
    db_account = db.query(Account).filter(Account.id == account_id).first()
    if not db_account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    
    db.delete(db_account)
    db.commit()
    return None
