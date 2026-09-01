import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/Login.css";
import api from "../services/api";

export default function Login() {
  const [adminId, setAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!adminId || !password) {
      console.error("Admin ID or Password are required");
      setError("Admin ID or Password are required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/adminLogin`, {
        adminId,
        password,
      });
      if (res.data.success === true) {
        localStorage.setItem("token", res.data.jwt_token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Something went wrong");
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/screen.svg" alt="logo" />
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account to continue</p>

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="login-field">
            <label htmlFor="adminId">Admin ID</label>
            <input
              id="adminId"
              placeholder="123456"
              value={adminId}
              onChange={(e) => setAdminID(e.target.value)}
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#!" className="login-forgot">
              Forgot Password?
            </a>
          </div>
          <p className="login-error">{error}</p>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading === true ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <a href="#!">Contact Admin</a>
        </p>
      </div>
    </div>
  );
}
