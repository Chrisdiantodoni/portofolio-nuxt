import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(), // Contoh: 'about'
  title: text("title").notNull(),
  description: text("description"),
  // Kita simpan SEO sebagai JSONB agar fleksibel seperti objek
  seo: jsonb("seo").$type<{
    title?: string;
    description?: string;
    image?: string;
  }>(),
  content: text("content"), // Isi body halaman
});

export type Seo = typeof pages.$inferSelect;
