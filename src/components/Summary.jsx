import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { matchesMonth } from "../utils/filterByMonth";

function Summary({ selectedMonth }) {
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
        if (!matchesMonth(t.date, selectedMonth)) return;   // <-- add this line
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
  }, [selectedMonth]);

  const balance = income - expenses;

  return (
    <div className="summary-row">
      <div className="summary-card income">
        <div className="label">Income</div>
        <div className="value">{income.toFixed(2)}</div>
      </div>
      <div className="summary-card expense">
        <div className="label">Expenses</div>
        <div className="value">{expenses.toFixed(2)}</div>
      </div>
      <div className="summary-card balance">
        <div className="label">Balance</div>
        <div className="value">{balance.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default Summary;