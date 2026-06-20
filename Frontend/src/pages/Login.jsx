import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../login.css";

import { requestNotificationPermission } from "../notifications";
function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(loginData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post(
        "https://tasktracking-production.up.railway.app/api/auth/login",
        loginData
      );

      if (!res.data.token) {
        alert("No token received.");
        return;
      }

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      localStorage.setItem(
        "userName",
        res.data.user?.name || ""
      );

      alert(`Welcome, ${res.data.user?.name}!`);
const fcmToken = await requestNotificationPermission();

if (fcmToken) {
  await axios.post(
    "https://tasktracking-production.up.railway.app/api/notifications/token",
    {
      token: fcmToken,
    },
    {
      headers: {
        Authorization: `Bearer ${res.data.token}`,
      },
    }
  );
}

navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed.";

      alert(message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>TaskHub</h1>

        <p className="subtitle">
          Welcome. Sign in to continue.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                email: e.target.value,
              })
            }
          />

          <div className="password-box">
            <input
              type={
                showPassword ? "text" : "password"
              }
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <span
            className="register-link"
            onClick={() => navigate("/register")}
          >
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;