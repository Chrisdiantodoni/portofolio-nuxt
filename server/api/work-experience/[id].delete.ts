import { db } from "../../../src/index";
import { workExperience } from "../../../src/db/schema/work";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID User tidak ditemukan",
      });
    }
    const existingWorkExperiences = await db.query.workExperience.findFirst({
      where: eq(workExperience.id, Number(id)),
    });

    if (!existingWorkExperiences) {
      throw createError({
        statusCode: 404,
        statusMessage: "Work Experience tidak ditemukan",
      });
    }
    const [deleteWorkExperience] = await db
      .delete(workExperience)
      .where(eq(workExperience.id, Number(id)))
      .returning();

    if (!deleteWorkExperience) {
      throw createError({
        statusCode: 404,
        statusMessage: "Work Experience tidak ditemukan",
      });
    }

    return {
      success: true,
      message: `User ${existingWorkExperiences.company} berhasil dihapus`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
