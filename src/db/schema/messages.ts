import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const mailStatusEnum = pgEnum("mail_status", [
  "inbox",
  "sent",
  "trash",
  "draft",
]);

export const mails = pgTable("mails", {
  id: serial("id").primaryKey(),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  senderAvatarSrc: text("sender_avatar_src"), // Bisa null karena tidak semua user punya avatar

  // Data email utama
  subject: text("subject").notNull(),
  body: text("body").notNull(), // Menggunakan text karena body email panjang

  // Default unread adalah false jika tidak didefinisikan
  unread: boolean("unread").default(false).notNull(),

  // Menyimpan tanggal
  date: timestamp("date", { mode: "string" }).notNull(),
  status: mailStatusEnum("status").default("inbox").notNull(),

  // Timestamp record dibuat (optional, best practice)
  createdAt: timestamp("created_at").defaultNow(),
});
