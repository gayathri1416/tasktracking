const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sql308.infinityfree.com",
  user: "if0_42167282",
  password: "qdwY5K7dQ0",
  database: "if0_42167282_taskhub",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;