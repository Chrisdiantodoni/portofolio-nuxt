// import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

// export const technologies = pgTable("technologies", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 100 }).unique().notNull(), // Contoh: "Nuxt"
//   icon: varchar("icon", { length: 100 }), // Contoh: "i-logos-nuxt-icon"
//   description: text("description"),
// });

import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const technologies = sqliteTable("technologies", {
  // Serial diganti menjadi integer dengan autoIncrement
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Varchar diganti menjadi text, unique dan notNull tetap sama
  name: text("name").unique().notNull(),

  icon: text("icon"),
  description: text("description"),
});
