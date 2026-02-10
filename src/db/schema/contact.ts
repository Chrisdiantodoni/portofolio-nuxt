import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }), // Opsional, bisa null
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false), // Untuk menandai pesan sudah dibaca/belum
  createdAt: timestamp("created_at").defaultNow(), // Otomatis mencatat waktu pesan masuk
});

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
