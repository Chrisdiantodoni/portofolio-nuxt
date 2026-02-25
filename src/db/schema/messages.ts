import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const mails = sqliteTable("mails", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  senderAvatarSrc: text("sender_avatar_src"),

  // Data email utama
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  to: text("to"),

  // Boolean di SQLite disimpan sebagai integer (0 atau 1)
  unread: integer("unread", { mode: "boolean" }).default(false).notNull(),

  // SQLite tidak punya tipe timestamp khusus, gunakan text (ISO string)
  date: text("date").notNull(),

  // Pengganti Enum: Gunakan text
  // Anda bisa memvalidasi ini di level Zod atau aplikasi
  status: text("status", {
    enum: ["inbox", "sent", "trash", "draft", "archive"],
  })
    .default("inbox")
    .notNull(),

  // Timestamp otomatis menggunakan SQL helper
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});
