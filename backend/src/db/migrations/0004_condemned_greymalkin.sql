ALTER TABLE "teachers" DROP CONSTRAINT "teachers_special_id_unique";--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "college" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "special_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ALTER COLUMN "subjects" SET DEFAULT '{}'::json;