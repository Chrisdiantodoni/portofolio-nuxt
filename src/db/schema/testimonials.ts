import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRole: varchar("author_role", { length: 255 }).notNull(),
  authorCompany: varchar("author_company", { length: 255 }),
  content: text("content").notNull(),
  avatarUrl: text("avatar_url"),
});
