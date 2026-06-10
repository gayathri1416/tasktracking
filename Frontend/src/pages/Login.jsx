import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData
      );

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data.token) {
        alert("No token received from backend");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login success");

      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data); // 🔥 IMPORTANT DEBUG
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={loginData.email}
        onChange={(e) =>
          setLoginData({ ...loginData, email: e.target.value })
        }
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={(e) =>
          setLoginData({ ...loginData, password: e.target.value })
        }
      />

      <br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;