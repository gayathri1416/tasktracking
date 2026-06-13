import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
<div style={{ textAlign: "center", marginTop: "50px" }}> <h1>Register</h1>


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

    <br />
    <br />

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

    <br />
    <br />

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
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "🙈" : "👁️"}
    </button>

    <br />
    <br />

    <button type="submit">Register</button>
  </form>

  <p style={{ marginTop: "15px" }}>
    Already Registered?{" "}
    <span
      onClick={() => navigate("/")}
      style={{
        color: "blue",
        cursor: "pointer",
        textDecoration: "underline",
        fontWeight: "bold",
      }}
    >
      Login Here
    </span>
  </p>
</div>


);
}

export default Register;
