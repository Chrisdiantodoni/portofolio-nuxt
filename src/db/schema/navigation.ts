import { pgTable, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const navigation = pgTable("navigation", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  label: varchar("label", { length: 50 }).notNull(), // Contoh: "Projects"
  link: varchar("link", { length: 255 }).notNull(), // Contoh: "/projects"
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  parentId: uuid("parent_id"),
});
