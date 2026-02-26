import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const profile = sqliteTable("profile", {
  // SQLite menggunakan integer + autoIncrement untuk menggantikan serial
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Semua varchar diubah menjadi text
  name: text("name").notNull(),
  headline: text("headline").notNull(),
  shortBio: text("short_bio").notNull(),
  longBio: text("long_bio").notNull(),
  about_page: text("about_page").notNull(),
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  location: text("location"),
  status: text("status"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  aboutImgUrl: text("about_image_url"),
  cvUrl: text("cv_url"),
});

// Type inference untuk mempermudah penggunaan di komponen UI
export type Profile = typeof profile.$inferSelect;
export type UpdateProfile = typeof profile.$inferInsert;
