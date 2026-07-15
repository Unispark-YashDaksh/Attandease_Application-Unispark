import { useState } from "react";
import "../css/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/screen.svg" alt="logo" />
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account to continue</p>

        <div className="login-form">
          <div className="login-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <a href="#!" className="login-forgot">Forgot Password?</a>
          </div>

          <button type="button" className="login-btn">Sign In</button>
        </div>

        <p className="login-footer">
          Don&apos;t have an account? <a href="#!">Contact Admin</a>
        </p>
      </div>
    </div>
  );
}
