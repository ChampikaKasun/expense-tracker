import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { matchesMonth } from "../utils/filterByMonth";

const COLORS = ["#4ade80", "#38bdf8", "#ffd166", "#ff6b6b", "#a78bfa", "#22d3ee", "#fb923c"];
const RADIAN = Math.PI / 180;

function ExpenseChart({ selectedMonth }) {
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState("expense");

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", auth.currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  const totals = {};
  transactions.forEach((t) => {
    if (!matchesMonth(t.date, selectedMonth)) return;   // <-- add this line
    if (t.type === view) {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    }
  });
  const data = Object.keys(totals).map((category) => ({
    name: category,
    value: totals[category],
  }));

  // Two-line label placed OUTSIDE the donut, with connector line
  const renderLabel = ({ cx, cy, midAngle, outerRadius, name, percent }) => {
    if (percent < 0.03) return null;
    const radius = outerRadius + 22;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const anchor = x > cx ? "start" : "end";
    return (
      <text
        x={x}
        y={y}
        fill="#f2f5f8"
        textAnchor={anchor}
        dominantBaseline="central"
        fontFamily="Sora, sans-serif"
      >
        <tspan x={x} dy="-0.3em" fontSize="11" fontWeight="600">{name}</tspan>
        <tspan x={x} dy="1.2em" fontSize="11" fontWeight="700" fill="#8b97a6">
          {Math.round(percent * 100)}%
        </tspan>
      </text>
    );
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0 }}>{view === "expense" ? "Expenses" : "Income"} by Category</h3>
        <div className="chart-toggle">
          <button
            className={view === "expense" ? "chart-tab active" : "chart-tab"}
            onClick={() => setView("expense")}
          >
            Expense
          </button>
          <button
            className={view === "income" ? "chart-tab active" : "chart-tab"}
            onClick={() => setView("income")}
          >
            Income
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="empty-state">No {view} data to display yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              stroke="none"
              label={renderLabel}
              labelLine={{  stroke: "#3a4756" }}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1c232d",
                border: "1px solid #2c3744",
                borderRadius: "10px",
                color: "#3473b1",
              }}
              itemStyle={{ color: "#f2f5f8" }}
              formatter={(value) => value.toFixed(2)}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ExpenseChart;