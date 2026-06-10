const db = require("../config/db");

// ADD TASK
const addTask = (req, res) => {
  const userId = req.user.id;
  const { title, description, due_date, status } = req.body;

  const sql =
    "INSERT INTO tasks (user_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [userId, title, description, due_date, status], (err) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "Task added" });
  });
};

// GET TASKS (ONLY LOGGED USER)
const getAllTasks = (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json(result);
  });
};

// UPDATE TASK
const updateTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  const { title, description, due_date, status } = req.body;

  const sql =
    "UPDATE tasks SET title=?, description=?, due_date=?, status=? WHERE id=? AND user_id=?";

  db.query(
    sql,
    [title, description, due_date, status, taskId, userId],
    (err, result) => {
      if (err) return res.status(500).send(err);

      res.json({ message: "Task updated successfully" });
    }
  );
};
// DELETE TASK
const deleteTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  const sql = "DELETE FROM tasks WHERE id=? AND user_id=?";

  db.query(sql, [taskId, userId], (err) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "Task deleted" });
  });
};

module.exports = {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask
};