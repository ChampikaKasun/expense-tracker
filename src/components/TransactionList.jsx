import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);

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
              <span>
                {t.category} <small style={{ color: "#888" }}>({t.date})</small>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: t.type === "income" ? "green" : "red" }}>
                  {t.type === "income" ? "+" : "-"}
                  {t.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#c00",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                  title="Delete"
                >
                  ✕
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;