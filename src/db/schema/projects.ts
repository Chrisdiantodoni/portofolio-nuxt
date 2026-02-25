import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";
import { technologies } from "./master";

// SQLite tidak mendukung pgEnum, jadi kita definisikan tipenya di kolom
export const projects = sqliteTable("projects", {
  // Gunakan text untuk UUID di SQLite
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),

  title: text("title").notNull(),
  description: text("description").notNull(),
  projectLink: text("project_link"),
  githubLink: text("github_link"),

  // Pengganti Enum
  type: text("type", { enum: ["web", "mobile", "desktop", "game"] })
    .notNull()
    .default("web"),

  year: integer("year").notNull(),
  slug: text("slug").unique().notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  imageUrl: text("image_url"),

  // Boolean mode untuk SQLite
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export const projectTechnologies = sqliteTable("project_technologies", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Referensi ke UUID (text) projects
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  // Referensi ke ID (integer) technologies
  technologyId: integer("technology_id")
    .notNull()
    .references(() => technologies.id, { onDelete: "cascade" }),
});

// Relasi tetap sama, Drizzle Relations API bekerja secara universal
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

// Update type helper agar sesuai dengan struktur SQLite
export type ProjectWithTechnologies = Project & {
  technologies: {
    id: number;
    projectId: string;
    technologyId: number;
    technology: typeof technologies.$inferSelect;
  }[];
};
