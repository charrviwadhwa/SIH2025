import { pgTable, serial, varchar, integer, timestamp, json } from "drizzle-orm/pg-core";

// -------------------- Students --------------------
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }),
  degree: varchar("degree", { length: 100 }),
  branch: varchar("branch", { length: 100 }),
  college: varchar("college", { length: 100 }),
  specialId: varchar("special_id", { length: 50 }).unique().notNull(), // org assigned ID
});

// -------------------- Teachers --------------------
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  college: varchar("college", { length: 100 }).notNull(),
  specialId: varchar("special_id", { length: 50 }), // org assigned ID

  // Subjects stored as JSON in dictionary format: { "Math": ["Class 10","Class 11"], "Physics": ["Class 11"] }
  subjects: json("subjects").default({}),
});

// -------------------- Sessions --------------------
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  course: varchar("course", { length: 100 }).notNull(),
  facultyId: integer("faculty_id").notNull().references(() => teachers.id),
  qrCode: varchar("qr_code", { length: 100 }).notNull(), // ✅ Increased from 20 to 100
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// -------------------- Attendance --------------------
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  studentId: integer("student_id").notNull().references(() => students.id),
  qrCode: varchar("qr_code", { length: 100 }).notNull(), // ✅ Increased from 20 to 100
  markedAt: timestamp("marked_at").defaultNow(),
});

// Ensure unique attendance
export const attendanceUniqueConstraint = {
  unique: ["sessionId", "studentId"],
};