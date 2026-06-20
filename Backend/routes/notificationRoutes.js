const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  saveToken,
  testNotification,
} = require("../controllers/notificationController");

router.post("/token", auth, saveToken);
// router.get("/test", testNotification);

module.exports = router;