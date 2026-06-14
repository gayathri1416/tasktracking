import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../register.css"; // make sure this path matches your project structure

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://tasktracking-production.up.railway.app/api/auth/register",
        registerData
      );

      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      console.log(error.response?.data);
      alert("Registration Failed");
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
              type={showPassword ? "text" : "password"}
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
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <p className="register-text">
          Already Registered?{" "}
          <span className="register-link" onClick={() => navigate("/")}>
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
