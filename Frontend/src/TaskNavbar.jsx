import { useNavigate } from "react-router-dom";
import "./taskNavbar.css";

function TaskNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="tasks-navbar">
      <button
        onClick={() => navigate("/dashboard")}
        className="nav-btn dashboard-btn"
      >
        Go Back To Dashboard
      </button>

      <button
        onClick={handleLogout}
        className="nav-btn logout-btn"
      >
        Logout
      </button>
    </nav>
  );
}

export default TaskNavbar;