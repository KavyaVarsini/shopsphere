import { useState } from "react";
import api from "../api/api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("🔵 Login clicked");
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("🟢 Full response:", res);
      console.log("🟢 Response data:", res.data);
      console.log("🟢 Token:", res.data.token);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Notify App.jsx
      onLogin();
    } catch (err) {
      console.error("🔴 Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h2 style={{ textAlign: "center", color: "#D4AF37" }}>ShopSphere Admin Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0a0a0a",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    // Particle background effect
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)
    `
  },
  card: {
    width: "380px",
    padding: "40px 35px",
    background: "linear-gradient(145deg, #1a1a1a, #151515)",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(212, 175, 55, 0.2)",
    position: "relative",
    zIndex: 1,
    // Gold top border
    borderTop: "4px solid #D4AF37"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    margin: "12px 0",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(30, 30, 30, 0.8)",
    color: "#f8f8f8",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
    color: "#1a1a1a",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "15px",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden"
  }
};
const hoverEffects = {
  inputFocus: {
    borderColor: "rgba(212, 175, 55, 0.5)",
    boxShadow: "0 0 0 3px rgba(212, 175, 55, 0.1)"
  },
  buttonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 25px rgba(212, 175, 55, 0.3)"
  }
};

export default Login;
