import { eq, sql } from "drizzle-orm";
import { db } from "../../../src/index";
import { projects } from "~~/src/db/schema/projects";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID Proyek wajib diisi",
    });
  }

  await db
    .update(projects)
    .set({ viewCount: sql`${projects.viewCount} + 1` })
    .where(eq(projects.id, id));

  return { success: true };
});
