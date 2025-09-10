import express from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

const router = express.Router();

// -------------------- REGISTER --------------------
// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, role, name } = req.body;


  if (!email || !password || !role || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "student") {
      await pool.query(
        "INSERT INTO students (email, password, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
        [email, hashedPassword, name]
      );
    } else if (role === "teacher") {
      await pool.query(
        "INSERT INTO teachers (email, password, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
        [email, hashedPassword, name]
      );
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    res.json({ success: true, message: "User registered", role });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});


// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    let user;
    if (role === "student") {
      const result = await pool.query("SELECT * FROM students WHERE email=$1", [email]);
      user = result.rows[0];
    } else if (role === "teacher") {
      const result = await pool.query("SELECT * FROM teachers WHERE email=$1", [email]);
      user = result.rows[0];
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // Return user info (without password)
    const { password: _, ...userData } = user;
    res.json({ success: true, role, user: userData });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});


// auth.js
router.post("/degree", async (req, res) => {
  const { email, degree, branch, college } = req.body;

  if (!email || !degree || !branch || !college) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Save for student only
    await pool.query(
      `UPDATE students
       SET degree=$1, branch=$2, college=$3
       WHERE email=$4`,
      [degree, branch, college, email]
    );

    res.json({ success: true, message: "Degree info saved" });
  } catch (err) {
    console.error("Degree save error:", err);
    res.status(500).json({ error: "Failed to save degree info" });
  }
});

// src/routes/auth.js

// Save teacher details
// PATCH /auth/teacher/subjects
router.patch("/teacher/subjects", async (req, res) => {
  const { email, subjects } = req.body;

  if (!email || !subjects) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Ensure subjects is JSON
    const subjectsJson = Array.isArray(subjects) ? subjects : JSON.parse(subjects);

    const result = await pool.query(
      "UPDATE teachers SET subjects = $1 WHERE email = $2 RETURNING *",
      [subjectsJson, email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ success: true, teacher: result.rows[0] });
  } catch (err) {
    console.error("Update subjects error:", err);
    res.status(500).json({ error: "Failed to update subjects" });
  }
});

// Update teacher college
// PATCH /auth/teacher/college
router.patch("/teacher/college", async (req, res) => {
  const { email, college } = req.body;

  if (!email || !college) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Update the college for the teacher
    const result = await pool.query(
      "UPDATE teachers SET college = $1 WHERE email = $2 RETURNING *",
      [college, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ success: true, teacher: result.rows[0] });
  } catch (err) {
    console.error("College update error:", err);
    res.status(500).json({ error: "Failed to update college" });
  }
});




export default router;
