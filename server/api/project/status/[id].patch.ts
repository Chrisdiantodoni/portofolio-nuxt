import { db } from "../../../../src/index";
import { eq, and, ne, or, sql } from "drizzle-orm";
import { projects } from "../../../../src/db/schema/projects";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = await getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID project diperlukan",
      });
    }

    // 2. Eksekusi Update
    const [updatedNav] = await db
      .update(projects)
      .set({
        isActive: sql`NOT ${projects.isActive}`, // Ini cara SQL untuk toggle boolean
      })
      .where(eq(projects.id, id))
      .returning();

    if (!updatedNav) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project tidak ditemukan",
      });
    }

    return {
      success: true,
      data: updatedNav,
    };
  } catch (error: any) {
    console.log({ error });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Gagal memperbarui navigasi",
    });
  }
});
