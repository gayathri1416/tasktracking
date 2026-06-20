const cron = require("node-cron");
const db = require("./config/db");
const { getMessaging } = require("firebase-admin/messaging");

require("./firebaseAdmin");

const sendDueTaskNotifications = async () => {
  const query = `
    SELECT
      t.id,
      t.title,
      t.user_id,
      t.due_date,
      t.status,
      nt.fcm_token,
      DATE(CONVERT_TZ(t.due_date, '+00:00', '+05:30')) AS ist_due_date,
      DATE(CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '+05:30')) AS today_ist
    FROM tasks t
    JOIN notification_tokens nt
      ON t.user_id = nt.user_id
    WHERE DATE(CONVERT_TZ(t.due_date, '+00:00', '+05:30')) =
          DATE(CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '+05:30'))
      AND t.status != 'Completed'
  `;

  db.query(query, async (err, results) => {
    if (err) {
      console.error("Notification query error:", err);
      return;
    }

    console.log("\n=== Notification Debug ===");
    console.log(`Found ${results.length} due tasks`);

    if (results.length > 0) {
      console.table(
        results.map((task) => ({
          id: task.id,
          title: task.title,
          due_date: task.due_date,
          ist_due_date: task.ist_due_date,
          today_ist: task.today_ist,
          status: task.status,
        }))
      );
    }

    for (const task of results) {
      try {
        await getMessaging().send({
          token: task.fcm_token,
          notification: {
            title: "Task Reminder",
            body: `"${task.title}" is due today.`,
          },
        });

        console.log(`✅ Notification sent for task: ${task.title}`);
      } catch (error) {
        console.error(
          `❌ Failed to send notification for task ${task.id}:`,
          error.message
        );
      }
    }
  });
};

// 6:00 AM IST
cron.schedule("0 6 * * *", sendDueTaskNotifications, {
  timezone: "Asia/Kolkata",
});

// 5:00 PM IST
cron.schedule("0 17 * * *", sendDueTaskNotifications, {
  timezone: "Asia/Kolkata",
});

console.log("Notification scheduler started");

// TEMPORARY: run immediately for testing
// sendDueTaskNotifications(); 