import { db } from "../../../src/index";
import { users } from "../../../src/db/schema/schema";
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
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, Number(id)),
    });

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        statusMessage: "User tidak ditemukan",
      });
    }
    // 3. Jalankan perintah Delete
    await db.delete(users).where(eq(users.id, Number(id)));

    // 4. Return response sukses
    return {
      success: true,
      message: `User ${existingUser.name} berhasil dihapus`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
