import express from "express";
import dotenv from "dotenv";
import sessionsRouter from "./routes/sessions.js";
import attendanceRouter from "./routes/attendance.js";
import qrRoutes from "./routes/qrcode.js"
import authRouter from "./routes/auth.js"
import profileRouter from "./routes/profile.js";



dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/api/sessions", sessionsRouter);
app.use("/attendance", attendanceRouter);
app.use("/api/qr", qrRoutes);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

// Health check
app.get("/", (req, res) => res.send("Server is running ✅"));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
