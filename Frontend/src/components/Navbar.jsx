import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};

  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "12px",
        borderBottom: "1px solid #ccc",
        alignItems: "center",
      }}
    >
      {/* SHOW DASHBOARD LINK ONLY IF NOT ALREADY ON DASHBOARD */}
      {location.pathname !== "/dashboard" && (
        <Link to="/dashboard">Go Back To Dashboard</Link>
      )}

      {/* SHOW VIEW TASKS ONLY IF NOT ON TASKS PAGE */}
      {location.pathname !== "/tasks" && (
        <Link to="/tasks">View All Tasks</Link>
      )}

      <button
        onClick={handleLogout}
        style={{ marginLeft: "auto", cursor: "pointer" }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;

