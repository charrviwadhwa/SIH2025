// routes/sessions.js - Simple fix without auth middleware
import { Router } from "express";
import { db } from "../db/index.js";
import { sessions, teachers } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

// Create session
router.post("/", async (req, res) => {
  try {
    const { course, teacherId, expiresAt } = req.body; // ✅ Changed from facultyId to teacherId

    if (!course || !teacherId || !expiresAt) {
      return res.status(400).json({ error: "Missing required fields: course, teacherId, expiresAt" });
    }

    console.log(`Creating session for teacher ID: ${teacherId}`); // Debug log

    // ✅ Validate that the teacher exists
    const teacher = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, Number(teacherId)))
      .limit(1);

    if (teacher.length === 0) {
      return res.status(400).json({ 
        error: "Teacher not found", 
        message: `No teacher found with ID ${teacherId}` 
      });
    }

    // Generate unique QR payload
    const qrCode = `${course}-${Date.now()}-${teacherId}`;

    // Insert into DB
    const [session] = await db
      .insert(sessions)
      .values({
        course,
        facultyId: Number(teacherId), // Maps to faculty_id column
        qrCode,
        createdAt: new Date(),
        expiresAt: new Date(expiresAt),
      })
      .returning();

    res.json({ 
      session,
      teacher: {
        id: teacher[0].id,
        name: teacher[0].name,
        email: teacher[0].email
      }
    });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Helper route to get all teachers (for testing)
router.get("/teachers", async (req, res) => {
  try {
    const allTeachers = await db.select({
      id: teachers.id,
      name: teachers.name,
      email: teachers.email,
      college: teachers.college
    }).from(teachers);
    
    res.json({ teachers: allTeachers });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;