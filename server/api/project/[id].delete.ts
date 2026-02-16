import { db } from "~~/src/index";
import { projects } from "~~/src/db/schema/projects";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID proyek tidak valid",
    });
  }

  try {
    await db.delete(projects).where(eq(projects.id, id));
    return { success: true, message: "Project deleted" };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
