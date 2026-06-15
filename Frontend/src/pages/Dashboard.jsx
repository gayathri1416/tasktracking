import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import "../dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "https://tasktracking-production.up.railway.app/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // Remove time from date comparison
  const getDateOnly = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Always display DD-MM-YY on all devices
  const formatDate = (date) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
  };

  // Today / Tomorrow / Day After Tomorrow
  const getDueLabel = (dueDate) => {
    const today = getDateOnly(new Date());
    const due = getDateOnly(dueDate);

    const diffDays = Math.round(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    switch (diffDays) {
      case 0:
        return {
          text: "Today",
          className: "today",
        };

      case 1:
        return {
          text: "Tomorrow",
          className: "tomorrow",
        };

      case 2:
        return {
          text: "Day After Tomorrow",
          className: "day-after",
        };

      default:
        return null;
    }
  };

  // Overdue + upcoming tasks
  const getTaskStatus = (task) => {
    if (!task.due_date) return null;

    const today = getDateOnly(new Date());
    const due = getDateOnly(task.due_date);

    const diffDays = Math.round(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} day${
          Math.abs(diffDays) > 1 ? "s" : ""
        }`,
        className: "overdue",
      };
    }

    return getDueLabel(task.due_date);
  };

  const total = tasks.length;

  const completed = tasks.filter(
    (t) => t.status === "Completed" || t.progress === 100
  ).length;

  const pending = tasks.filter(
    (t) => t.status !== "Completed" && t.progress !== 100
  ).length;

  const progress = total ? (completed / total) * 100 : 0;

  // Show overdue + today + tomorrow + day after tomorrow
  const alertTasks = tasks
    .filter((t) => {
      if (!t.due_date) return false;

      if (t.status === "Completed" || t.progress === 100) {
        return false;
      }

      return getTaskStatus(t) !== null;
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const overdueCount = alertTasks.filter(
    (t) => getTaskStatus(t)?.className === "overdue"
  ).length;

  const allCompleted =
    tasks.length > 0 &&
    tasks.every(
      (t) => t.status === "Completed" || t.progress === 100
    );

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-card">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="dashboard-stats">
          <p>Total Tasks: {total}</p>
          <p>Completed: {completed}</p>
          <p>Pending: {pending}</p>
          <p>{Math.round(progress)}% Completed</p>
        </div>

        <br />

        <ProgressBar value={progress} />

        {overdueCount > 0 && (
          <div className="overdue-banner">
            ⚠️ You have {overdueCount} overdue task
            {overdueCount > 1 ? "s" : ""}!
          </div>
        )}

        {!allCompleted && (
          <div className="near-due-section">
            <h3>Task Alerts</h3>

            {alertTasks.length === 0 ? (
              <p>No urgent tasks!</p>
            ) : (
              alertTasks.map((t) => {
                const statusInfo = getTaskStatus(t);

                return (
                  <div
                    key={t._id || t.id}
                    className="near-due-card"
                  >
                    <h4>{t.title}</h4>

                    <p>{t.description}</p>

                    <p>
                      <strong>Due Date:</strong>{" "}
                      {formatDate(t.due_date)}
                    </p>

                    <span
                      className={`due-label ${statusInfo.className}`}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;