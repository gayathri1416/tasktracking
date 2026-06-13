import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

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

  // GET TASKS
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK
  const addTask = async () => {
    await axios.post("http://localhost:5000/api/tasks", taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    resetForm();
    fetchTasks();
  };

  // UPDATE TASK
  const updateTask = async () => {
    await axios.put(
      `http://localhost:5000/api/tasks/${editId}`,
      {
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.due_date,
        status: taskData.status,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    resetForm();
    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  };

  // EDIT
  const handleEdit = (task) => {
    setTaskData({
      title: task.title,
      description: task.description,
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
      status: task.status,
    });

    setEditId(task._id || task.id);
    setIsEdit(true);
    setShowForm(true);
  };

  // RESET
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

  // SAFE DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "No date";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";

    return d.toLocaleDateString("en-IN");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* NAVBAR INSIDE COMPONENT */}
      <Navbar />

      <h1>My Tasks</h1>

      <button onClick={() => setShowForm(!showForm)}>
        Add Task
      </button>

      {/* FORM */}
      {showForm && (
        <div>
          <input
            placeholder="Title"
            value={taskData.title}
            onChange={(e) =>
              setTaskData({ ...taskData, title: e.target.value })
            }
          />

          <input
            placeholder="Description"
            value={taskData.description}
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
          />

          <input
            type="date"
            value={taskData.due_date}
            onChange={(e) =>
              setTaskData({ ...taskData, due_date: e.target.value })
            }
          />

          <select
            value={taskData.status}
            onChange={(e) =>
              setTaskData({ ...taskData, status: e.target.value })
            }
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <button onClick={isEdit ? updateTask : addTask}>
            {isEdit ? "Update Task" : "Add Task"}
          </button>

          <button onClick={resetForm}>Cancel</button>
        </div>
      )}

      {/* TASK LIST */}
      {tasks.map((t) => (
        <div
          key={t._id || t.id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <h3>{t.title}</h3>
          <p>{t.description}</p>

          <p>
            <b>Due:</b> {formatDate(t.due_date)}
          </p>

          <p>Status: {t.status}</p>

          <button onClick={() => handleEdit(t)}>Edit</button>
          <button onClick={() => deleteTask(t._id || t.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
