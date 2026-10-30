import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.ok) return setError(result.error);
        navigate(result.user.role === "dealer" ? "/dashboard" : "/");
  };

  return (
    <form className="auth-box" onSubmit={submit}>
      <h1 className="page-title">Login</h1>
      <label>Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
      <p className="auth-switch">No account yet? <Link to="/register">Register</Link></p>
    </form>
  );
}