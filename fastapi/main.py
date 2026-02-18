from fastapi import FastAPI,HTTPException,Depends
import models
from sqlalchemy.orm import Session
from typing import Annotated,List
from pydantic import BaseModel
from database import SessionLocal,Base,engine
import models
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)
app=FastAPI()

origins = [
    "http://localhost:3000",
    "https://react-frontend-71z5.onrender.com"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],
)

class TransactionBase(BaseModel):
    description: str
    amount: float
    is_expense: bool
    category: str
    date: str

class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]



@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transactions: TransactionBase, db: db_dependency):
    db_transaction = models.Transaction(**transactions.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[TransactionModel])
async def read_transactions(db: db_dependency ,skip: int = 0, limit: int = 100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

@app.delete("/transactions/{description}")
async def delete_transaction(description: str, db: db_dependency):
    transaction = db.query(models.Transaction).filter(models.Transaction.description == description).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"detail": "Transaction deleted"}