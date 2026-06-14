import { Link, useNavigate, useLocation } from "react-router-dom";
import "../navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {location.pathname !== "/dashboard" && (
        <Link to="/dashboard" className="nav-btn">Dashboard</Link>
      )}

      {location.pathname !== "/tasks" && (
        <Link to="/tasks" className="nav-btn">Tasks</Link>
      )}

      <button onClick={handleLogout} className="nav-btn logout-btn">
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
