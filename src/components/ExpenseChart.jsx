import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3e97e6", "#e35656", "#2e7d32", "#f9a825", "#6a1b9a", "#00838f", "#ef6c00", "#558b2f"];

function ExpenseChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const totals = {};

      snapshot.docs.forEach((doc) => {
        const t = doc.data();
        if (t.type === "expense") {
          totals[t.category] = (totals[t.category] || 0) + t.amount;
        }
      });

      const chartData = Object.keys(totals).map((category) => ({
        name: category,
        value: totals[category],
      }));

      setData(chartData);
    });

    return () => unsubscribe();
  }, []);

  if (data.length === 0) {
    return (
      <div style={{ maxWidth: "320px", margin: "20px auto", textAlign: "center" }}>
        <h3>Expenses by Category</h3>
        <p>No expense data to display yet.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "320px", margin: "20px auto" }}>
      <h3 style={{ textAlign: "center" }}>Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => entry.name}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;