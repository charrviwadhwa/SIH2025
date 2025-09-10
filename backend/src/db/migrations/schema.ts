import { pgTable, foreignKey, serial, integer, varchar, timestamp, unique, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const attendance = pgTable("attendance", {
	id: serial().primaryKey().notNull(),
	sessionId: integer("session_id").notNull(),
	studentId: integer("student_id").notNull(),
	qrCode: varchar("qr_code", { length: 20 }).notNull(),
	markedAt: timestamp("marked_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [sessions.id],
			name: "attendance_session_id_sessions_id_fk"
		}),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "attendance_student_id_students_id_fk"
		}),
]);

export const students = pgTable("students", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 100 }),
	degree: varchar({ length: 100 }),
	branch: varchar({ length: 100 }),
	college: varchar({ length: 100 }),
	specialId: varchar("special_id", { length: 50 }),
}, (table) => [
	unique("students_email_unique").on(table.email),
	unique("students_special_id_unique").on(table.specialId),
]);

export const teachers = pgTable("teachers", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 100 }),
	college: varchar({ length: 100 }),
	specialId: varchar("special_id", { length: 50 }),
	subjects: json().default([]),
}, (table) => [
	unique("teachers_email_unique").on(table.email),
	unique("teachers_special_id_unique").on(table.specialId),
]);

export const sessions = pgTable("sessions", {
	id: serial().primaryKey().notNull(),
	course: varchar({ length: 100 }).notNull(),
	facultyId: integer("faculty_id").notNull(),
	qrCode: varchar("qr_code", { length: 20 }).notNull(),
	expiresAt: varchar("expires_at", { length: 50 }).notNull(),
	createdAt: varchar("created_at", { length: 50 }).default(now()),
}, (table) => [
	foreignKey({
			columns: [table.facultyId],
			foreignColumns: [teachers.id],
			name: "sessions_faculty_id_teachers_id_fk"
		}),
]);
