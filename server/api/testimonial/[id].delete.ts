import { db } from "../../../src/index";
import { eq } from "drizzle-orm";
import { testimonials } from "../../../src/db/schema/testimonials";

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
    const existingTestimonial = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, Number(id)),
    });

    if (!existingTestimonial) {
      throw createError({
        statusCode: 404,
        statusMessage: "Testimonials tidak ditemukan",
      });
    }
    // 3. Jalankan perintah Delete
    await db.delete(testimonials).where(eq(testimonials.id, Number(id)));

    // 4. Return response sukses
    return {
      success: true,
      message: `berhasil dihapus`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
