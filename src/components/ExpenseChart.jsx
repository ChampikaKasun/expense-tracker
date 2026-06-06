import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Theme-harmonised palette: mint-led, with complementary teals, amber, coral
const COLORS = ["#4ade80", "#38bdf8", "#ffd166", "#ff6b6b", "#a78bfa", "#22d3ee", "#fb923c"];

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

  return (
    <div className="card">
      <h3>Expenses by Category</h3>
      {data.length === 0 ? (
        <p className="empty-state">No expense data to display yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={85}
              paddingAngle={3}
              stroke="none"
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
                color: "#f2f5f8",
              }}
              itemStyle={{ color: "#f2f5f8" }}
              formatter={(value) => value.toFixed(2)}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", color: "#8b97a6", paddingTop: "8px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ExpenseChart;