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

  const addTask = async () => {
    try {
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
    } catch (err) {
      console.log("Error adding task:", err);
    }
  };

  const updateTask = async () => {
    try {
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
    } catch (err) {
      console.log("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `https://tasktracking-production.up.railway.app/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (err) {
      console.log("Error deleting task:", err);
    }
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

  const getDateOnly = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "Invalid date";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
  };

  const getTaskClass = (task) => {
    if (
      task.status === "Completed" ||
      task.progress === 100
    ) {
      return "completed";
    }

    if (!task.due_date) {
      return "pending";
    }

    const today = getDateOnly(new Date());
    const due = getDateOnly(task.due_date);

    const diffDays = Math.round(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";
    if (diffDays === 2) return "day-after";

    return "pending";
  };

  const getTaskLabel = (task) => {
    if (
      task.status === "Completed" ||
      task.progress === 100
    ) {
      return "Completed";
    }

    if (!task.due_date) {
      return "No Due Date";
    }

    const today = getDateOnly(new Date());
    const due = getDateOnly(task.due_date);

    const diffDays = Math.round(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${
        Math.abs(diffDays) > 1 ? "s" : ""
      }`;
    }

    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays === 2) return "Due Day After Tomorrow";

    return "Pending";
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
            className={`task-item ${getTaskClass(t)}`}
          >
            <h3>{t.title}</h3>

            <p>{t.description}</p>

            <p>
              <strong>Due Date:</strong>{" "}
              {formatDate(t.due_date)}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {getTaskLabel(t)}
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