import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);

const [loginData, setLoginData] = useState({
email: "",
password: "",
});

const handleLogin = async (e) => {
e.preventDefault();


try {
  const res = await axios.post(
    "https://tasktracking-production.up.railway.app/api/auth/login",
    loginData
  );

  if (!res.data.token) {
    alert("No token received");
    return;
  }

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  navigate("/dashboard");
} catch (error) {
  console.log(error.response?.data);
  alert("Login Failed");
}


};

return (
<div style={{ textAlign: "center", marginTop: "50px" }}> <h1>Login</h1>


  <form onSubmit={handleLogin}>
    <input
      type="email"
      placeholder="Email"
      value={loginData.email}
      onChange={(e) =>
        setLoginData({
          ...loginData,
          email: e.target.value,
        })
      }
    />

    <br />
    <br />

    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
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
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "🙈" : "👁️"}
    </button>

    <br />
    <br />

    <button type="submit">Login</button>
  </form>

  <p style={{ marginTop: "15px" }}>
    Not Registered?{" "}
    <span
      onClick={() => navigate("/register")}
      style={{
        color: "blue",
        cursor: "pointer",
        textDecoration: "underline",
        fontWeight: "bold",
      }}
    >
      Register Here
    </span>
  </p>
</div>


);
}

export default Login;
