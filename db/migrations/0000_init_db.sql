CREATE TABLE IF NOT EXISTS "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"system_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "systems" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"color" varchar(6),
	"icon_url" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
