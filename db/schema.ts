import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const systems = pgTable("systems", {
	id: serial("id").primaryKey(),
	name: text("name"),
	color: varchar("color", { length: 6 }),
	icon: text("icon_url"),
	description: text("description"),
	created: timestamp("created", {
		mode: "date",
	})
		.defaultNow()
		.notNull(),
})

export const accounts = pgTable("accounts", {
	id: text("id").primaryKey(),
	system: integer("system_id").references(() => systems.id),
})

export const members = pgTable("members", {
	id: serial("id").primaryKey(),
	system: integer("system_id")
		.references(() => systems.id)
		.notNull(),
	name: text("name").notNull(),
	color: varchar("color", { length: 6 }),
	icon: text("icon_url"),
	description: text("description"),
	created: timestamp("created", {
		mode: "date",
	})
		.defaultNow()
		.notNull(),
	displayName: text("display_name"),
	pronouns: text("pronouns"),
})

export const aliases = pgTable("aliases", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	member: integer("member_id")
		.references(() => members.id)
		.notNull(),
	system: integer("system_id")
		.references(() => systems.id)
		.notNull(),
})
