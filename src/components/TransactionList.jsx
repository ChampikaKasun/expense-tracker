import { useState, useEffect } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
  deleteDoc, doc, updateDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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

  return (
    <div style={{ maxWidth: "320px", margin: "20px auto" }}>
      <h3>Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {transactions.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                marginBottom: "6px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              {editingId === t.id ? (
                <>
                  <span style={{ display: "flex", gap: "6px", flex: 1 }}>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      style={{ width: "90px", padding: "4px" }}
                    />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      step="0.01"
                      style={{ width: "70px", padding: "4px" }}
                    />
                  </span>
                  <span style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => saveEdit(t.id)} style={{ cursor: "pointer" }}>
                      Save
                    </button>
                    <button onClick={cancelEdit} style={{ cursor: "pointer" }}>
                      Cancel
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {t.category} <small style={{ color: "#888" }}>({t.date})</small>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: t.type === "income" ? "green" : "red" }}>
                      {t.type === "income" ? "+" : "-"}
                      {t.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => startEdit(t)}
                      style={{
                        border: "none", background: "transparent",
                        color: "#1565c0", cursor: "pointer", fontSize: "14px",
                      }}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{
                        border: "none", background: "transparent",
                        color: "#c00", cursor: "pointer", fontSize: "16px",
                      }}
                      title="Delete"
                    >
                      ✕
                    </button>
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