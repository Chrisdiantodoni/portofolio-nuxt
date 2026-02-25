import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  // SQLite menggunakan integer primary key dengan autoIncrement
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),

  // Disimpan sebagai ISO string atau integer (unix ms)
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),

  // Untuk updatedAt, kita gunakan $onUpdate untuk logika aplikasi TypeScript
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const pageViews = sqliteTable("page_views", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pagePath: text("page_path").notNull(),
  ipAddress: text("ip_address"),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// Export all lainnya tetap sama
export * from "./articles";
export * from "./social-links";
export * from "./faqs";
export * from "./master";
export * from "./messages";
export * from "./navigation";
export * from "./profile";
export * from "./projects";
export * from "./work";
export * from "./pages";
export * from "./testimonials";
