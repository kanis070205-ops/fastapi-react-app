import React,{useState,useEffect} from "react";
import api from "./api";


const App=()=>{
  const[transactions,setTransactions]=useState([]);
  const[formData,setFormData]=useState({
    amount:'',
    description:'',
    date:'',
    category:'',
    is_expense: false
  });

  const fetchTransactions=async()=>{
    const response=await api.get('/transactions/');
    setTransactions(response.data)};

  useEffect(()=>{
    fetchTransactions();
  },[]);

  const handleInputChange=(e)=>{
    const value=e.target.type==='checkbox' ? e.target.checked : e.target.value;
    setFormData({...formData,[e.target.name]:value});
  };

  const handleFormSubmit=async(e)=>{
    e.preventDefault();
    await api.post('/transactions/',formData);
    fetchTransactions();
    setFormData({
      amount:'',
      description:'',
      date:'',
      category:'',
      is_expense: false
    });
  };


  // Delete transaction handler
  const handleDelete = async () => {
    const desc = prompt("Enter the description of the transaction to delete:");
    if (!desc) return;
    try {
      await api.delete(`/transactions/${encodeURIComponent(desc)}`);
      fetchTransactions();
      alert("Transaction deleted (if found)");
    } catch (err) {
      alert("Transaction not found or error occurred");
    }
  };

  return(
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="#">Expense Tracker</a>
        </div>
      </nav>

      <div className="container mt-4">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input type="text" className="form-control" id="amount" name="amount" value={formData.amount} onChange={handleInputChange}  />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name="description" value={formData.description} onChange={handleInputChange}  />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input type="date" className="form-control" id="date" name="date" value={formData.date} onChange={handleInputChange}  />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <input type="text" className="form-control" id="category" name="category" value={formData.category} onChange={handleInputChange}  />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="is_expense" name="is_expense" checked={formData.is_expense} onChange={handleInputChange}  />
            <label className="form-check-label" htmlFor="is_expense">Is Expense</label>
          </div>
          <button type="submit" className="btn btn-primary">Add Transaction</button>
        </form>

        <button className="btn btn-danger mt-3" onClick={handleDelete}>Delete Transaction by Description</button>

        <table className="table mt-4">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
              <th>Category</th>
              <th>Is Expense</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction)=>(
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.description}</td>
                <td>{transaction.date}</td>
                <td>{transaction.category}</td>
                <td>{transaction.is_expense ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App;