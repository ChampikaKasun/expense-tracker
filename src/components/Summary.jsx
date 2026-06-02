import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

function Summary() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalIncome = 0;
      let totalExpenses = 0;

      snapshot.docs.forEach((doc) => {
        const t = doc.data();
        if (t.type === "income") {
          totalIncome += t.amount;
        } else {
          totalExpenses += t.amount;
        }
      });

      setIncome(totalIncome);
      setExpenses(totalExpenses);
    });

    return () => unsubscribe();
  }, []);

  const balance = income - expenses;

  const cardStyle = {
    flex: 1,
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center",
    color: "#fff",
  };

  return (
    <div style={{ maxWidth: "320px", margin: "20px auto", display: "flex", gap: "10px" }}>
      <div style={{ ...cardStyle, background: "#2e7d32" }}>
        <div style={{ fontSize: "12px" }}>Income</div>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{income.toFixed(2)}</div>
      </div>
      <div style={{ ...cardStyle, background: "#c62828" }}>
        <div style={{ fontSize: "12px" }}>Expenses</div>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{expenses.toFixed(2)}</div>
      </div>
      <div style={{ ...cardStyle, background: balance >= 0 ? "#1565c0" : "#6a1b9a" }}>
        <div style={{ fontSize: "12px" }}>Balance</div>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{balance.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default Summary;