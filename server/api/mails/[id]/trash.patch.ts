import { db } from "../../../../src/index";
import { mails } from "~~/src/db/schema/messages";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID tidak ditemukan",
    });
  }

  try {
    const result = await db
      .update(mails)
      .set({ status: "trash" })
      // Pastikan tipe data ID sesuai (pakai Number() HANYA jika id di DB adalah integer)
      .where(eq(mails.id, Number(id)))
      .returning();

    // Jika id tidak ada di database, result akan berupa array kosong []
    if (result.length === 0) {
      return {
        success: false,
        message: "Email tidak ditemukan di database",
      };
    }

    return {
      success: true,
      message: `Mail ${id} moved to trash`,
    };
  } catch (e: any) {
    // Ini akan menangkap error database (koneksi putus, dsb)
    throw createError({
      statusCode: 500,
      statusMessage: e.message,
    });
  }
});
