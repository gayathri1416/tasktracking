import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [registerData, setRegisterData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!registerData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!emailRegex.test(registerData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(registerData.password)) {
      alert(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );

      return;
    }

    try {
      await axios.post(
        "https://tasktracking-production.up.railway.app/api/auth/register",
        registerData
      );

      alert(
        "Registration successful. Please login."
      );

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed.";

      alert(message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>

        <form onSubmit={handleRegister}>
          <input
            placeholder="Name"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                email: e.target.value,
              })
            }
          />

          <div className="password-box">
            <input
              type={
                showPassword ? "text" : "password"
              }
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
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
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <small
            style={{
              display: "block",
              marginBottom: "15px",
              color: "#666",
            }}
          >
            Password must contain at least 8
            characters, including uppercase,
            lowercase, number, and special
            character.
          </small>

          <button
            type="submit"
            className="register-btn"
          >
            Register
          </button>
        </form>

        <p className="register-text">
          Already registered?{" "}
          <span
            className="register-link"
            onClick={() => navigate("/")}
          >
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;