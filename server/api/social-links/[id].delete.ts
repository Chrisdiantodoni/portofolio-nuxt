import { db } from "../../../src/index";
import { eq } from "drizzle-orm";
import { socialLinks } from "../../../src/db/schema/social-links";

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
    const existingSocialLinks = await db.query.socialLinks.findFirst({
      where: eq(socialLinks.id, Number(id)),
    });

    if (!existingSocialLinks) {
      throw createError({
        statusCode: 404,
        statusMessage: "Technology tidak ditemukan",
      });
    }
    // 3. Jalankan perintah Delete
    await db.delete(socialLinks).where(eq(socialLinks.id, Number(id)));

    // 4. Return response sukses
    return {
      success: true,
      message: `${existingSocialLinks.platform} berhasil dihapus`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
