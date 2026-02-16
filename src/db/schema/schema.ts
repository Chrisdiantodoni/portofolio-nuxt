import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).unique().notNull(),
  // Use 'text' or a long 'varchar' for hashed passwords
  password: text().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
export * from "./articles";
export * from "./social-links";
export * from "./faqs";
export * from "./master";
export * from "./messages";
export * from "./navigation";
export * from "./profile";
export * from "./projects";
export * from "./work";
export * from "./testimonials";
