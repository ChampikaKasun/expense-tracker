import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Logged in successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Log In</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          Log In
        </button>
      </form>
      {error && <p style={{ color: "#c62828", marginTop: "10px", fontSize: "13px" }}>{error}</p>}
      {message && <p style={{ color: "#2e7d32", marginTop: "10px", fontSize: "13px" }}>{message}</p>}
    </div>
  );
}

export default Login;