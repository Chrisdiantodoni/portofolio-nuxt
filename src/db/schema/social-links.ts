import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const socialLinks = sqliteTable("social_links", {
  // Serial diganti menjadi integer dengan autoIncrement
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Varchar diganti menjadi text
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),

  sortOrder: integer("sort_order").default(0),

  // Boolean disimpan sebagai integer (0/1) dengan mode boolean
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export type SocialLink = typeof socialLinks.$inferSelect;
