import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Summary from "./components/Summary";
import AddTransaction from "./components/AddTransaction";
import ExpenseChart from "./components/ExpenseChart";
import TransactionList from "./components/TransactionList";
import AuthCard from "./components/AuthCard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;
  }

  return (
    <div className="app-container">
      {user ? (
        <>
          <div className="app-header">
            <h1><span className="dot"></span> Expense Tracker</h1>
            <button onClick={handleLogout} className="btn-logout">
              Log Out
            </button>
          </div>
          <p className="user-email">{user.email}</p>
          <Summary />
          <AddTransaction />
          <ExpenseChart />
          <TransactionList />
        </>
      ) : (
        <AuthCard />
      )}
    </div>
  );
}

export default App;