import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const navigation = sqliteTable("navigation", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),

  label: text("label").notNull(),
  link: text("link").notNull(),
  sortOrder: integer("sort_order").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),

  // SOLUSI: Berikan tipe eksplisit AnySQLiteColumn untuk memutus rantai inferensi
  parentId: text("parent_id").references((): AnySQLiteColumn => navigation.id),
});
