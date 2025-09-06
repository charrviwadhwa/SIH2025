import { Router } from "express";
import { db } from "../db/index.js";
import { attendance, sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/mark", async (req, res) => {
  try {
    const { sessionId, studentId, qrCode } = req.body;
    if (!sessionId || !studentId || !qrCode)
      return res.status(400).json({ error: "Missing fields" });

    // Fetch session
    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    if (!session) return res.status(404).json({ error: "Session not found" });

    // Check QR
    if (session.qrCode.trim().toUpperCase() !== qrCode.trim().toUpperCase())
      return res.status(400).json({ error: "Invalid QR code" });

    // Check duplicate
    const [existing] = await db.select()
      .from(attendance)
      .where(eq(attendance.sessionId, sessionId), eq(attendance.studentId, studentId));
    if (existing) return res.status(400).json({ error: "Attendance already marked" });

    const [record] = await db.insert(attendance)
      .values({ sessionId, studentId, qrCode })
      .returning();

    res.json({ message: "Attendance marked successfully", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
