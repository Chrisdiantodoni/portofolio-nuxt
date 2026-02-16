import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  uuid,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { technologies } from "./master";
export const projectTypeEnum = pgEnum("project_type", [
  "web",
  "mobile",
  "desktop",
  "game",
]);

export const projects = pgTable("projects", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  projectLink: text("project_link"),
  githubLink: text("github_link"),
  type: varchar("type", { length: 50 }).notNull().default("web"),
  year: integer("year").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
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

export const projectsRelations = relations(projects, ({ many }) => ({
  technologies: many(projectTechnologies),
}));

export const projectTechnologiesRelations = relations(
  projectTechnologies,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectTechnologies.projectId],
      references: [projects.id],
    }),
    technology: one(technologies, {
      fields: [projectTechnologies.technologyId],
      references: [technologies.id],
    }),
  }),
);

export type Project = typeof projects.$inferSelect;

// Tipe lengkap dengan relasi technologies
export type ProjectWithTechnologies = Project & {
  technologies: {
    id: number;
    projectId: string;
    technologyId: number;
    technology: typeof technologies.$inferSelect;
  }[];
};
