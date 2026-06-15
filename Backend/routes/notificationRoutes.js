const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  saveToken,
} = require("../controllers/notificationController");

router.post("/token", auth, saveToken);

module.exports = router;