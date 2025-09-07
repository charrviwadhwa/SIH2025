// backend/routes/attendance.js
import { Router } from "express";
import { db } from "../db/index.js";
import { sessions, attendance } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

const router = Router();

// Mark attendance
router.post("/mark", async (req, res) => {
  try {
    const { sessionId, qrCode, studentId } = req.body;

    console.log("Attendance request:", { sessionId, qrCode, studentId }); // Debug log

    // Validate required fields
    if (!sessionId || !qrCode || !studentId) {
      return res.status(400).json({ 
        error: "Missing required fields",
        received: { sessionId, qrCode, studentId }
      });
    }

    // Find and validate session
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, parseInt(sessionId)))
      .limit(1);

    if (session.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const currentSession = session[0];

    // Verify QR code matches
    if (currentSession.qrCode !== qrCode) {
      console.log("QR Code mismatch:", {
        expected: currentSession.qrCode,
        received: qrCode
      });
      return res.status(400).json({ error: "Invalid QR code" });
    }

    // Check if session has expired
    if (new Date() > new Date(currentSession.expiresAt)) {
      return res.status(400).json({ error: "Session has expired" });
    }

    // Check if attendance already marked
    const existingAttendance = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.sessionId, parseInt(sessionId)),
          eq(attendance.studentId, parseInt(studentId))
        )
      )
      .limit(1);

    if (existingAttendance.length > 0) {
      return res.status(400).json({ 
        error: "Attendance already marked for this session" 
      });
    }

    // Mark attendance
    const [newAttendance] = await db
      .insert(attendance)
      .values({
        sessionId: currentSession.id,
        studentId: parseInt(studentId),
        qrCode,
        markedAt: new Date(),
      })
      .returning();

    console.log("Attendance marked:", newAttendance); // Debug log

    res.json({
      success: true,
      message: "Attendance marked successfully",
      attendance: {
        id: newAttendance.id,
        sessionId: newAttendance.sessionId,
        studentId: newAttendance.studentId,
        markedAt: newAttendance.markedAt,
      },
      session: {
        course: currentSession.course,
        id: currentSession.id
      }
    });

  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ 
      error: "Server error", 
      details: err.message 
    });
  }
});

// Get attendance for a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    const studentAttendance = await db
      .select({
        attendanceId: attendance.id,
        sessionId: attendance.sessionId,
        markedAt: attendance.markedAt,
        course: sessions.course,
        sessionDate: sessions.createdAt
      })
      .from(attendance)
      .leftJoin(sessions, eq(attendance.sessionId, sessions.id))
      .where(eq(attendance.studentId, studentId));

    res.json({
      success: true,
      attendance: studentAttendance
    });

  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get attendance for a session
router.get("/session/:sessionId", async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    
    const sessionAttendance = await db
      .select()
      .from(attendance)
      .where(eq(attendance.sessionId, sessionId));

    res.json({
      success: true,
      attendance: sessionAttendance,
      count: sessionAttendance.length
    });

  } catch (err) {
    console.error("Error fetching session attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
});
export default router;