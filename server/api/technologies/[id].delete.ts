import { db } from "../../../src/index";
import { technologies } from "../../../src/db/schema/schema";
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
    // 2. Cek apakah user ada di database sebelum dihapus (Opsional tapi bagus untuk validasi)
    const existingTechnologies = await db.query.technologies.findFirst({
      where: eq(technologies.id, Number(id)),
    });

    if (!existingTechnologies) {
      throw createError({
        statusCode: 404,
        statusMessage: "Technology tidak ditemukan",
      });
    }
    // 3. Jalankan perintah Delete
    await db.delete(technologies).where(eq(technologies.id, Number(id)));

    // 4. Return response sukses
    return {
      success: true,
      message: `User ${existingTechnologies.name} berhasil dihapus`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
