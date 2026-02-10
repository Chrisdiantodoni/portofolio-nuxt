import { pgTable } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { text, date } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  publishedAt: date("published_at").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  imageUrl: text("image_url"),
});
