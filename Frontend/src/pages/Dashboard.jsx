import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status === "Pending").length;

  const progress = total ? (completed / total) * 100 : 0;

  const nearDue = tasks.filter(t => {
    if (!t.due_date) return false;

    const today = new Date();
    const taskDate = new Date(t.due_date);

    const diffDays =
      (taskDate - today) / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 2;
  });

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Dashboard</h1>

        <p>Total Tasks: {total}</p>
        <p>Completed: {completed}</p>
        <p>Pending: {pending}</p>

        <p>{Math.round(progress)}% Completed</p>

        <ProgressBar value={progress} />

        <div style={{ marginTop: "20px" }}>
          <h3>⚠ Near Due Tasks</h3>

          {nearDue.length === 0 ? (
            <p>No urgent tasks 🎉</p>
          ) : (
            nearDue.map((t) => (
              <div key={t._id || t.id} style={{ border: "1px solid red", padding: 10 }}>
                <h4>{t.title}</h4>
                <p>{t.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;