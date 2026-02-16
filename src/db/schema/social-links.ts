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
  icon: varchar("icon", { length: 100 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
});
