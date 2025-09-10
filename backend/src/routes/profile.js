// routes/profile.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Update Special ID
router.post("/update", async (req, res) => {
  const { email, role, specialId } = req.body;

  if (!email || !role || !specialId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    if (role === "student") {
      const result = await pool.query(
        "UPDATE students SET special_id=$1 WHERE email=$2 RETURNING *",
        [specialId, email]
      );
      if (!result.rows.length) {
        return res.status(404).json({ error: "Student not found" });
      }

    } else if (role === "teacher") {
      const result = await pool.query(
        "UPDATE teachers SET special_id=$1 WHERE email=$2 RETURNING *",
        [specialId, email]
      );
      if (!result.rows.length) {
        return res.status(404).json({ error: "Teacher not found" });
      }

    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    res.json({ success: true, message: "Special ID updated" });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update Special ID" });
  }
});

export default router;
