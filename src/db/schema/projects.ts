import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { technologies } from "./master";

export const projects = pgTable("projects", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  projectLink: text("project_link"),
  githubLink: text("github_link"),
  year: integer("year").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  imageUrl: text("image_url"),
});

export const projectTechnologies = pgTable("project_technologies", {
  id: serial("id").primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  technologyId: integer("technology_id")
    .notNull()
    .references(() => technologies.id, { onDelete: "cascade" }),
});
