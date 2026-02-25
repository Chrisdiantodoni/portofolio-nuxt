import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const workExperience = sqliteTable("work_experiences", {
  // Serial diubah menjadi integer dengan autoIncrement
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Varchar dengan length diubah menjadi text sederhana
  company: text("company").notNull(),
  role: text("role").notNull(),
  period: text("period").notNull(), // Contoh: "2023 - Present"

  description: text("description"),
  icon: text("icon"),
  logoUrl: text("logo_url"),
});

export type WorkExperience = typeof workExperience.$inferSelect;
export type NewWorkExperience = typeof workExperience.$inferInsert;
