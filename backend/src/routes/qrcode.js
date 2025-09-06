import { Router } from "express";
import QRCode from "qrcode";
import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

// Generate QR for a session
router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find session
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Encode sessionId + qrCode into QR image
    const qrData = JSON.stringify({
      sessionId: session.id,
      qrCode: session.qrCode,
    });

    const qrImage = await QRCode.toDataURL(qrData);

    res.json({ sessionId: session.id, qrImage });
  } catch (err) {
    console.error("Error generating QR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
