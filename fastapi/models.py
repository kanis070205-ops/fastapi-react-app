from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    amount = Column(Float)
    is_expense = Column(Boolean, default=False)
    category = Column(String)
    date = Column(String)