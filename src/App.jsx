import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AddTransaction from "./components/AddTransaction";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import ExpenseChart from "./components/ExpenseChart";

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
    <div>
      {user ? (
        <div style={{ maxWidth: "320px", margin: "40px auto", textAlign: "center" }}>
          <h2>Welcome!</h2>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout} style={{ padding: "8px 16px" }}>
            Log Out
          </button>
          <div style={{ maxWidth: "320px", margin: "40px auto", textAlign: "center" }}>
          <h2>Welcome!</h2>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout} style={{ padding: "8px 16px" }}>
            Log Out
          </button>
          <Summary />
          <AddTransaction />
          <ExpenseChart />
          <TransactionList />
        </div>
        </div>
        
      ) : (
        <div>
          <Signup />
          <Login />
        </div>
      )}
    </div>
  );
}

export default App;