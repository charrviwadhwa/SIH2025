import { relations } from "drizzle-orm/relations";
import { sessions, attendance, students, teachers } from "./schema";

export const attendanceRelations = relations(attendance, ({one}) => ({
	session: one(sessions, {
		fields: [attendance.sessionId],
		references: [sessions.id]
	}),
	student: one(students, {
		fields: [attendance.studentId],
		references: [students.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({one, many}) => ({
	attendances: many(attendance),
	teacher: one(teachers, {
		fields: [sessions.facultyId],
		references: [teachers.id]
	}),
}));

export const studentsRelations = relations(students, ({many}) => ({
	attendances: many(attendance),
}));

export const teachersRelations = relations(teachers, ({many}) => ({
	sessions: many(sessions),
}));