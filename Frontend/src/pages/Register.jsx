import { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault(); // important

    try {
      const res = await axios.post(
        "https://://taskhub-project.onrender.com/api/auth/register",
        registerData
      );

      console.log("REGISTER RESPONSE:", res.data);

      alert("Register success");

      // after register go to login
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);
      alert("Register failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Name"
          value={registerData.name}
          onChange={(e) =>
            setRegisterData({ ...registerData, name: e.target.value })
          }
        />

        <br />

        <input
          placeholder="Email"
          value={registerData.email}
          onChange={(e) =>
            setRegisterData({ ...registerData, email: e.target.value })
          }
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={registerData.password}
          onChange={(e) =>
            setRegisterData({ ...registerData, password: e.target.value })
          }
        />

        <br />

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/login")}
        >
          Login here
        </span>
      </p>
    </div>
  );
}

export default Register;