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

      // Clear the form
      setAmount("");
      setCategory("");
      setType("expense");
      setDate("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "320px", margin: "20px auto" }}>
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="0.01"
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="text"
          placeholder="Category (e.g. Food, Salary)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          Add Transaction
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AddTransaction;