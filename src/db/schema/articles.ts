// import { pgTable } from "drizzle-orm/pg-core";
// import { serial } from "drizzle-orm/pg-core";
// import { varchar } from "drizzle-orm/pg-core";
// import { text, date, boolean } from "drizzle-orm/pg-core";

// export const articles = pgTable("articles", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   description: text("description").notNull(),
//   publishedAt: date("published_at").notNull(),
//   isActive: boolean("is_active").default(true),

//   slug: varchar("slug", { length: 255 }).unique().notNull(),
//   imageUrl: text("image_url"),
// });

import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable("articles", {
  // SQLite menggunakan integer + primaryKey({ autoIncrement: true }) untuk serial
  id: integer("id").primaryKey({ autoIncrement: true }),

  title: text("title").notNull(),
  description: text("description").notNull(),

  // SQLite tidak memiliki tipe 'date' khusus; biasanya disimpan sebagai string (ISO) atau integer
  publishedAt: text("published_at").notNull(),

  // SQLite tidak memiliki tipe 'boolean' murni; gunakan integer (0 atau 1)
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  body: text("body"),

  slug: text("slug").unique().notNull(),
  imageUrl: text("image_url"),
});
