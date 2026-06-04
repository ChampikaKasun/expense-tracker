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

  return (
    <div className="summary-row">
      <div className="summary-card" style={{ background: "linear-gradient(135deg, #2e7d32, #43a047)" }}>
        <div className="label">Income</div>
        <div className="value">{income.toFixed(2)}</div>
      </div>
      <div className="summary-card" style={{ background: "linear-gradient(135deg, #c62828, #e53935)" }}>
        <div className="label">Expenses</div>
        <div className="value">{expenses.toFixed(2)}</div>
      </div>
      <div
        className="summary-card"
        style={{
          background: balance >= 0
            ? "linear-gradient(135deg, #1565c0, #1e88e5)"
            : "linear-gradient(135deg, #6a1b9a, #8e24aa)",
        }}
      >
        <div className="label">Balance</div>
        <div className="value">{balance.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default Summary;