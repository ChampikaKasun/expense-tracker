import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Account created successfully!");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Sign Up</h3>
      <form onSubmit={handleSignup}>
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">
          Sign Up
        </button>
      </form>
      {error && <p style={{ color: "#c62828", marginTop: "10px", fontSize: "13px" }}>{error}</p>}
      {message && <p style={{ color: "#2e7d32", marginTop: "10px", fontSize: "13px" }}>{message}</p>}
    </div>
  );
}

export default Signup;