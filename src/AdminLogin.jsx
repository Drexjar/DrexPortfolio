import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idTokenResult = await user.getIdTokenResult();

      // If user is an admin, go to dashboard
      if (idTokenResult.claims.admin) {
        navigate("/dashboard");
      } else {
        alert("You do not have admin privileges.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Invalid login credentials.");
    }
  };

  return (
    <div className="login-section">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Button to return to homepage */}
      <button onClick={() => navigate("/")} className="return-home-btn">
        Return to Homepage
      </button>
    </div>
  );
}

export default AdminLogin;
