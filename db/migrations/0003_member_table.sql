CREATE TABLE IF NOT EXISTS "aliases" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"member_id" integer NOT NULL,
	"system_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"system_id" integer NOT NULL,
	"name" text NOT NULL,
	"color" varchar(6),
	"icon_url" text,
	"description" text,
	"created" timestamp DEFAULT now() NOT NULL,
	"display_name" text,
	"pronouns" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aliases" ADD CONSTRAINT "aliases_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aliases" ADD CONSTRAINT "aliases_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
