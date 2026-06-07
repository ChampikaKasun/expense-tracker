function MonthSelector({ selectedMonth, setSelectedMonth }) {
  // Build a list of the last 12 months as { value: "2025-01", label: "Jan 2025" }
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short", year: "numeric" });
    months.push({ value, label });
  }

  return (
    <div className="month-selector">
      <label>Period</label>
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        <option value="all">All time</option>
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}

export default MonthSelector;