  const db = require("../config/db");
  


  const saveToken = (req, res) => {
    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({
        message: "FCM token is required",
      });
    }

    const query =`
    INSERT INTO notification_tokens
    (user_id, fcm_token)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
    fcm_token = VALUES(fcm_token)
  `;

    db.query(query, [userId, token], (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to save token",
        });
      }

      res.status(200).json({
        message: "Token saved successfully",
      });
    });
  };

  module.exports = {
    saveToken,
    
  };
