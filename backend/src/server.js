import express from "express";
import dotenv from "dotenv";
import sessionsRouter from "./routes/sessions.js";
import attendanceRouter from "./routes/attendance.js";

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/sessions", sessionsRouter);
app.use("/attendance", attendanceRouter);

// Health check
app.get("/", (req, res) => res.send("Server is running ✅"));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
