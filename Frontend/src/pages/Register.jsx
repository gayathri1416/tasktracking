import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 🔥 VALIDATION
  const validate = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("All fields are required");
      return false;
    }

    if (formData.name.length < 3) {
      alert("Name must be at least 3 characters");
      return false;
    }

    if (!formData.email.includes("@")) {
      alert("Enter valid email");
      return false;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      alert("Registration Failed");
    }
  };

  // 🔥 ENTER KEY SUPPORT
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div>
      <h1>Register</h1>

      <input
        placeholder="Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      <br />

      <input
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        onKeyDown={handleKeyDown}
      />

      <br />

      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;