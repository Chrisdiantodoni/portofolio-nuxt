import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  // Use 'text' or a long 'varchar' for hashed passwords
  password: text().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export * from "./profile";
export * from "./work";
export * from "./articles";
export * from "./testimonials";
export * from "./faqs";
