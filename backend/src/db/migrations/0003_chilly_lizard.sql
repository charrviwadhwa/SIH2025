CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(100),
	"degree" varchar(100),
	"branch" varchar(100),
	"college" varchar(100),
	"special_id" varchar(50) NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email"),
	CONSTRAINT "students_special_id_unique" UNIQUE("special_id")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(100),
	"college" varchar(100),
	"special_id" varchar(50) NOT NULL,
	"subjects" json DEFAULT '[]'::json,
	CONSTRAINT "teachers_email_unique" UNIQUE("email"),
	CONSTRAINT "teachers_special_id_unique" UNIQUE("special_id")
);
--> statement-breakpoint
ALTER TABLE "attendance_summary" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "colleges" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "courses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "enrollments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "attendance_summary" CASCADE;--> statement-breakpoint
DROP TABLE "colleges" CASCADE;--> statement-breakpoint
DROP TABLE "courses" CASCADE;--> statement-breakpoint
DROP TABLE "enrollments" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_qr_code_unique";--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_student_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_teacher_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "qr_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "course" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "faculty_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_faculty_id_teachers_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN "device_info";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "course_id";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "teacher_id";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "date";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "latitude";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "longitude";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "radius";