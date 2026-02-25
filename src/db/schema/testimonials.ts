import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const testimonials = sqliteTable("testimonials", {
  // SQLite menggunakan integer + autoIncrement untuk menggantikan serial
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Semua varchar (length) diubah menjadi text
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  authorCompany: text("author_company"),

  content: text("content").notNull(),
  avatarUrl: text("avatar_url"),
});

export type Testimonial = typeof testimonials.$inferSelect;
