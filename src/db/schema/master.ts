import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).unique().notNull(), // Contoh: "Nuxt"
  icon: varchar("icon", { length: 100 }), // Contoh: "i-logos-nuxt-icon"
  description: text("description"),
});
