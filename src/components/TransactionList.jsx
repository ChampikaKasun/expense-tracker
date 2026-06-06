import { useState, useEffect } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
  deleteDoc, doc, updateDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { matchesMonth } from "../utils/filterByMonth";

function TransactionList({ selectedMonth }) {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(items);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditAmount(t.amount);
    setEditCategory(t.category);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditCategory("");
  };

  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "transactions", id), {
        amount: parseFloat(editAmount),
        category: editCategory,
      });
      cancelEdit();
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const categories = [...new Set(transactions.map((t) => t.category))];

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCategory = filterCategory === "" || t.category === filterCategory;
    const matchesMonthFilter = matchesMonth(t.date, selectedMonth);   
    return matchesType && matchesCategory && matchesMonthFilter;      
  });

  return (
    <div className="card">
      <h3>Transactions</h3>

      <div className="filter-row">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="empty-state">No transactions to show.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredTransactions.map((t) => (
            <li key={t.id} className="txn-item">
              {editingId === t.id ? (
                <>
                  <span style={{ display: "flex", gap: "6px", flex: 1 }}>
                    <input
                      type="text"
                      className="field"
                      style={{ marginBottom: 0, padding: "8px" }}
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    />
                    <input
                      type="number"
                      className="field"
                      style={{ marginBottom: 0, padding: "8px", width: "80px" }}
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      step="0.01"
                    />
                  </span>
                  <span style={{ display: "flex", gap: "4px", marginLeft: "8px" }}>
                    <button className="icon-btn edit" onClick={() => saveEdit(t.id)} title="Save">✓</button>
                    <button className="icon-btn delete" onClick={cancelEdit} title="Cancel">✕</button>
                  </span>
                </>
              ) : (
                <>
                  <span>
                    <span className="txn-category">{t.category}</span>
                    <span className="txn-date">{t.date}</span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className={t.type === "income" ? "txn-amount income" : "txn-amount expense"}>
                      {t.type === "income" ? "+" : "-"}{t.amount.toFixed(2)}
                    </span>
                    <button className="icon-btn edit" onClick={() => startEdit(t)} title="Edit">✎</button>
                    <button className="icon-btn delete" onClick={() => handleDelete(t.id)} title="Delete">✕</button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;