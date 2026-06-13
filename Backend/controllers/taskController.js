const db = require("../config/db");

// ADD TASK
const addTask = (req, res) => {
  const userId = req.user.id;
  const { title, description, due_date, status } = req.body;

  db.query(
    "INSERT INTO tasks (user_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)",
    [userId, title, description, due_date, status],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ message: "Task added" });
    }
  );
};

// GET TASKS
const getAllTasks = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM tasks WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).send(err);

      res.json(result);
    }
  );
};

// UPDATE
const updateTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { title, description, due_date, status } = req.body;

  db.query(
    "UPDATE tasks SET title=?, description=?, due_date=?, status=? WHERE id=? AND user_id=?",
    [title, description, due_date, status, taskId, userId],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ message: "Task updated" });
    }
  );
};

// DELETE
const deleteTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  db.query(
    "DELETE FROM tasks WHERE id=? AND user_id=?",
    [taskId, userId],
    (err) => {
      if (err) return res.status(500).send(err);

      res.json({ message: "Task deleted" });
    }
  );
};

module.exports = {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
};