import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Definisikan interface untuk SEO agar reusable
export interface SeoData {
  title?: string;
  description?: string;
  image?: string;
}

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),

  // SQLite menyimpan ini sebagai TEXT secara internal,
  // tapi Drizzle akan melakukan JSON.parse/stringify otomatis
  seo: text("seo", { mode: "json" }).$type<SeoData>(),

  content: text("content"),
});

// Type inference untuk penggunaan di aplikasi
export type Seo = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
