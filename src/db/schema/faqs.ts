import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(), // Isi dummy karena di UI tidak terlihat
  category: varchar("category", { length: 100 }).notNull(), // "Services & Process", "Pricing", etc.
});
