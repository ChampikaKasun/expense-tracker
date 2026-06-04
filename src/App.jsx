import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Summary from "./components/Summary";
import AddTransaction from "./components/AddTransaction";
import ExpenseChart from "./components/ExpenseChart";
import TransactionList from "./components/TransactionList";

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
            <h1>💰 Expense Tracker</h1>
            <button onClick={handleLogout} className="btn-logout">
              Log Out
            </button>
          </div>
          <p style={{ fontSize: "13px", color: "#667", marginBottom: "16px" }}>
            {user.email}
          </p>
          <Summary />
          <AddTransaction />
          <ExpenseChart />
          <TransactionList />
        </>
      ) : (
        <>
          <h1 style={{ textAlign: "center", color: "#1565c0", marginBottom: "20px" }}>
            💰 Expense Tracker
          </h1>
          <Signup />
          <Login />
        </>
      )}
    </div>
  );
}

export default App;