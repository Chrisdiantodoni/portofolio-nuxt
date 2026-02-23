import { db } from "../../../src/index";
import { pages } from "../../../src/db/schema/pages";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // 1. Ambil ID dari URL parameter (/api/seo/123)
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID is required",
    });
  }

  try {
    // 2. Query ke database menggunakan Drizzle
    // Kita gunakan .limit(1) karena hanya mencari satu data
    const result = await db
      .select()
      .from(pages)
      .where(eq(pages.id, Number(id)))
      .limit(1);

    // 3. Jika data tidak ditemukan
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
      });
    }

    // 4. Kembalikan data (Drizzle select selalu mengembalikan array)
    // Kita ambil index [0] agar frontend menerima objek tunggal
    return result[0];
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
