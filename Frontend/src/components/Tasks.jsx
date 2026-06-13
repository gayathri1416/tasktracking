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
} catch (error) {
  console.log(error);
  alert("Failed to fetch tasks");
}


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


setEditId(task.id);
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
if (!date) return "No Date";


return new Date(date).toLocaleDateString("en-IN");


};

const getRemainingDays = (dueDate, status) => {
if (status === "Completed") {
return "Task Completed";
}


if (!dueDate) return "No Due Date";

const today = new Date();
const due = new Date(dueDate);

today.setHours(0, 0, 0, 0);
due.setHours(0, 0, 0, 0);

const diff = Math.ceil(
  (due - today) / (1000 * 60 * 60 * 24)
);

if (diff < 0) {
  return `Overdue by ${Math.abs(diff)} day(s)`;
}

if (diff === 0) {
  return "Due Today";
}

return `${diff} day(s) left`;


};

return ( <div> <Navbar />


  <div style={{ padding: "20px" }}>
    <h1>My Tasks</h1>

    <button onClick={() => setShowForm(!showForm)}>
      Add Task
    </button>

    {showForm && (
      <div style={{ marginTop: "20px" }}>
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

        <br />
        <br />

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

        <br />
        <br />

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

        <br />
        <br />

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

        <br />
        <br />

        <button onClick={isEdit ? updateTask : addTask}>
          {isEdit ? "Update Task" : "Add Task"}
        </button>

        <button
          onClick={resetForm}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </div>
    )}

    {tasks.map((t) => (
      <div
        key={t.id}
        style={{
          border: "1px solid #ccc",
          marginTop: "15px",
          padding: "10px",
        }}
      >
        <h3>{t.title}</h3>

        <p>{t.description}</p>

        <p>
          <b>Due:</b> {formatDate(t.due_date)}
        </p>

        <p>
          <b>Remaining:</b>{" "}
          {getRemainingDays(
            t.due_date,
            t.status
          )}
        </p>

        <p>
          <b>Status:</b> {t.status}
        </p>

        <button onClick={() => handleEdit(t)}>
          Edit
        </button>

        <button
          onClick={() => deleteTask(t.id)}
          style={{ marginLeft: "10px" }}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
</div>


);
}

export default Tasks;
