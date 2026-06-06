import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

function AddTransaction() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await addDoc(collection(db, "transactions"), {
        amount: parseFloat(amount),
        category,
        type,
        date,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setAmount("");
      setCategory("");
      setType("expense");
      setDate("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <select
          className="field"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="number"
          className="field"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="0.01"
        />
        <input
          type="text"
          className="field"
          placeholder="Category (e.g. Food, Salary)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          className="field"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          Add Transaction
        </button>
      </form>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}

export default AddTransaction;