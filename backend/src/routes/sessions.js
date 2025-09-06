import { Router } from "express";
import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
import QRCode from "qrcode";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { course, facultyId, expiresAt } = req.body;
    if (!course || !facultyId || !expiresAt)
      return res.status(400).json({ error: "Missing fields" });

    const qrCode = Math.random().toString(36).slice(2, 8).toUpperCase();

    const [session] = await db.insert(sessions)
      .values({ course, facultyId, qrCode, expiresAt: new Date(expiresAt) })
      .returning();

    // Generate QR code file (optional)
    await QRCode.toFile(`session_${session.id}.png`, qrCode);

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
