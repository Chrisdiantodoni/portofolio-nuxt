import { integer, pgTable, varchar, text, serial } from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  headline: varchar("headline", { length: 255 }).notNull(),
  shortBio: text("short_bio").notNull(), // "I craft intuitive..."
  longBio: text("long_bio").notNull(), // "As a UX/UI designer..."
  about_page: text("about_page").notNull(), // "As a UX/UI designer..."
  location: varchar("location", { length: 100 }),
  status: varchar("status", { length: 100 }), // "Available for new projects"
  email: varchar("email", { length: 255 }),
  avatarUrl: text("avatar_url"),
});
