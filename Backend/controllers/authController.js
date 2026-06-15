const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const register = (req, res) => {
  const { name, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Please enter your name.",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address.",
    });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Server error.",
        });
      }

      if (result.length > 0) {
        return res.status(409).json({
          message: "User already exists. Please login.",
        });
      }

      try {
        const hashedPassword = await bcrypt.hash(
          password,
          10
        );

        db.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err) => {
            if (err) {
              return res.status(500).json({
                message: "Server error.",
              });
            }

            return res.status(201).json({
              message:
                "Registration successful. Please login.",
            });
          }
        );
      } catch (error) {
        return res.status(500).json({
          message: "Server error.",
        });
      }
    }
  );
};

// LOGIN
const login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Server error.",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message:
            "Account not found. Please register first.",
        });
      }

      const user = result[0];

      try {
        const valid = await bcrypt.compare(
          password,
          user.password
        );

        if (!valid) {
          return res.status(401).json({
            message: "Invalid email or password.",
          });
        }

        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.status(200).json({
          message: `Welcome, ${user.name}!`,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      } catch (error) {
        return res.status(500).json({
          message: "Server error.",
        });
      }
    }
  );
};

module.exports = {
  register,
  login,
};