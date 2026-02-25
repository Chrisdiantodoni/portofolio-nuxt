// import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

// export const faqs = pgTable("faqs", {
//   id: serial("id").primaryKey(),
//   question: text("question").notNull(),
//   answer: text("answer").notNull(), // Isi dummy karena di UI tidak terlihat
//   category: varchar("category", { length: 100 }).notNull(), // "Services & Process", "Pricing", etc.
// });

import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const faqs = sqliteTable("faqs", {
  // Menggunakan integer dengan autoIncrement untuk menggantikan serial
  id: integer("id").primaryKey({ autoIncrement: true }),

  question: text("question").notNull(),
  answer: text("answer").notNull(),

  // Di SQLite, tidak ada varchar(length), cukup gunakan text
  category: text("category").notNull(),
});
