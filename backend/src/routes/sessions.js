// backend/routes/sessions.js
import { Router } from "express";
import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { eq } from "drizzle-orm"; // 🔧 Make sure eq is imported
import QRCode from "qrcode";

const router = Router();

// Create a new session
router.post("/", async (req, res) => {
  try {
    const { course, facultyId, expiresAt } = req.body;
    
    console.log("Received request body:", req.body); // Debug log
    
    if (!course || !facultyId || !expiresAt) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        received: { course, facultyId, expiresAt }
      });
    }

    // Generate random QR string for session
    const qrCode = Math.random().toString(36).slice(2, 12).toUpperCase();

    console.log("Generated qrCode:", qrCode); // Debug log

    // Insert session into DB
    const [session] = await db
      .insert(sessions)
      .values({
        course,
        facultyId,
        qrCode,
        expiresAt: new Date(expiresAt),
      })
      .returning();

    console.log("Created session:", session); // Debug log

    // ✅ Create QR payload containing both sessionId and qrCode
    const qrPayload = {
      sessionId: session.id,
      qrCode: session.qrCode,
      course: session.course, // Optional: add course info
      expiresAt: session.expiresAt.toISOString() // Optional: add expiry
    };

    const qrPayloadString = JSON.stringify(qrPayload);
    console.log("QR Payload:", qrPayloadString); // Debug log

    // Generate QR image file (optional)
    try {
      await QRCode.toFile(`session_${session.id}.png`, qrPayloadString);
    } catch (fileError) {
      console.warn("Could not save QR file:", fileError.message);
    }

    // Generate base64 QR for frontend
    const qrImage = await QRCode.toDataURL(qrPayloadString);

    // Respond with session details + QR info
    const response = {
      success: true,
      session: {
        id: session.id,
        course: session.course,
        facultyId: session.facultyId,
        qrCode: session.qrCode,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt
      },
      qr: {
        payload: qrPayload,      // Object format
        payloadString: qrPayloadString, // JSON string format
        image: qrImage           // base64 image for display
      }
    };

    console.log("Sending response:", response); // Debug log
    res.json(response);

  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ 
      error: "Server error", 
      details: err.message 
    });
  }
});

// 🔧 ADD VERIFICATION ENDPOINT
router.post("/verify", async (req, res) => {
  try {
    const { sessionId, qrCode } = req.body;

    console.log("Verifying QR:", { sessionId, qrCode }); // Debug log

    if (!sessionId || !qrCode) {
      return res.status(400).json({ 
        success: false,
        message: "Missing sessionId or qrCode" 
      });
    }

    // Find session in database
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, parseInt(sessionId))) // 🔧 eq is now properly imported
      .limit(1);

    if (session.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Session not found" 
      });
    }

    const currentSession = session[0];

    // Verify QR code matches
    if (currentSession.qrCode !== qrCode) {
      console.log("QR Code mismatch:", {
        expected: currentSession.qrCode,
        received: qrCode
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid QR code" 
      });
    }

    // Check if expired
    if (new Date() > new Date(currentSession.expiresAt)) {
      return res.status(400).json({ 
        success: false,
        message: "Session has expired" 
      });
    }

    // QR is valid!
    console.log("QR verification successful:", currentSession.id);
    res.json({
      success: true,
      message: "QR code verified successfully",
      session: {
        id: currentSession.id,
        course: currentSession.course,
        facultyId: currentSession.facultyId,
        expiresAt: currentSession.expiresAt
      }
    });

  } catch (error) {
    console.error("QR verification error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during verification" 
    });
  }
});

// Get session by ID (useful for verification)
router.get("/:id", async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    
    const session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId)) // 🔧 eq is now properly imported
      .limit(1);

    if (session.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session[0]);
  } catch (err) {
    console.error("Error fetching session:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;