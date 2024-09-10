import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const systems = pgTable("systems", {
 id: serial("id").primaryKey(),
 name: text("name"),
 color: varchar("color", { length: 6 }),
 icon: text("icon_url")
})

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  system: integer("system_id").references(() => systems.id)
})