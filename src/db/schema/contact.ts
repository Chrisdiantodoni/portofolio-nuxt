import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(), // Contoh: "Twitter", "GitHub"
  url: text("url").notNull(),

  // Kolom Icon: Sangat berguna buat Nuxt UI
  // Isi dengan nama icon, misal: "i-simple-icons-github" atau "i-heroicons-envelope"
  icon: varchar("icon", { length: 100 }),

  // Untuk mengatur urutan tampilan (0, 1, 2, ...)
  sortOrder: integer("sort_order").default(0),

  // Kalau mau sembunyikan sementara tanpa menghapus
  isActive: boolean("is_active").default(true),
});
