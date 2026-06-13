const express = require("express");
const router = express.Router();

const {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const auth = require("../middleware/authMiddleware");

router.get("/", auth, getAllTasks);
router.post("/", auth, addTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;