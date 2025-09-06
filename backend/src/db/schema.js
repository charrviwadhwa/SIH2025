import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  course: varchar("course", { length: 100 }).notNull(),
  facultyId: integer("faculty_id").notNull(),
  qrCode: varchar("qr_code", { length: 20 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  studentId: integer("student_id").notNull(),
  qrCode: varchar("qr_code", { length: 20 }).notNull(),
  markedAt: timestamp("marked_at").defaultNow(),
});
