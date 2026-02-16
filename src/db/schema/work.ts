import { pgTable, varchar, text, serial } from "drizzle-orm/pg-core";

export const workExperience = pgTable("work_experiences", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  period: varchar("period", { length: 100 }).notNull(), // "2023 - Present"
  description: text("description"),
  icon: text("icon"),
  logoUrl: text("logo_url"),
});

export type WorkExperience = typeof workExperience.$inferSelect;
