ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "attendance" RENAME COLUMN "present" TO "qr_code";--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_session_id_sessions_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_student_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_faculty_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "qr_code" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "created_at";