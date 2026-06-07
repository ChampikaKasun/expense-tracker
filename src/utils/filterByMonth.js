// Returns true if the transaction's date falls in the selected month.
// selectedMonth is "all" or "YYYY-MM". Transaction date is "YYYY-MM-DD".
export function matchesMonth(transactionDate, selectedMonth) {
  if (selectedMonth === "all") return true;
  if (!transactionDate) return false;
  return transactionDate.startsWith(selectedMonth);
}