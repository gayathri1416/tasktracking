import { useEffect, useState } from "react";
import axios from "axios";
import TaskNavbar from "../TaskNavbar";
import "../tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "Pending",
  });

  const fetchTasks = async () => {
    const res = await axios.get(
      "https://tasktracking-production.up.railway.app/api/tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    await axios.post(
      "https://tasktracking-production.up.railway.app/api/tasks",
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    resetForm();
    fetchTasks();
  };

  const updateTask = async () => {
    await axios.put(
      `https://tasktracking-production.up.railway.app/api/tasks/${editId}`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    resetForm();
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(
      `https://tasktracking-production.up.railway.app/api/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTasks();
  };

  const handleEdit = (task) => {
    setTaskData({
      title: task.title,
      description: task.description,
      due_date: task.due_date
        ? task.due_date.split("T")[0]
        : "",
      status: task.status,
    });

    setEditId(task._id || task.id);
    setIsEdit(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setTaskData({
      title: "",
      description: "",
      due_date: "",
      status: "Pending",
    });

    setShowForm(false);
    setIsEdit(false);
    setEditId(null);
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "Invalid date";

    return d.toLocaleDateString("en-IN");
  };

  return (
    <div className="tasks-container">
      <TaskNavbar />

      <div className="tasks-card">
        <h1 className="tasks-title">My Tasks</h1>

        <button
          className="nav-btn add-task-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Task"}
        </button>

        {showForm && (
          <div className="task-form">
            <input
              placeholder="Title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  title: e.target.value,
                })
              }
            />

            <input
              placeholder="Description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={taskData.due_date}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  due_date: e.target.value,
                })
              }
            />

            <select
              value={taskData.status}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  status: e.target.value,
                })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              className="nav-btn"
              onClick={isEdit ? updateTask : addTask}
            >
              {isEdit ? "Update Task" : "Add Task"}
            </button>

            <button
              className="logout-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        )}

        {tasks.map((t) => (
  <div
    key={t._id || t.id}
    className={`task-item ${
      t.status === "Completed"
        ? "completed"
        : "pending"
    }`}
  >
            <h3>{t.title}</h3>

            <p>{t.description}</p>

            <p>
              <b>Due:</b> {formatDate(t.due_date)}
            </p>

            <p>
              <b>Status:</b> {t.status}
            </p>

            <div className="task-actions">
              <button
                className="nav-btn"
                onClick={() => handleEdit(t)}
              >
                Edit
              </button>

              <button
                className="logout-btn"
                onClick={() =>
                  deleteTask(t._id || t.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;