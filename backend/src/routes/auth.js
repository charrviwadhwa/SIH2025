import { Router } from "express";
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Temporary mock login (replace with DB later)
  if (email === "student@test.com" && password === "123") {
    return res.json({ id: 1, email, role: "student" });
  }
  if (email === "teacher@test.com" && password === "123") {
    return res.json({ id: 2, email, role: "teacher" });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;
