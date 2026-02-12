import { db } from "../../../src/index";
import { eq } from "drizzle-orm";
import { navigation } from "../../../src/db/schema/navigation";

export default defineEventHandler(async (event) => {
  try {
    const id = await getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID navigasi diperlukan untuk menghapus",
      });
    }

    const [deletedNav] = await db
      .delete(navigation)
      .where(eq(navigation.id, id))
      .returning();

    if (!deletedNav) {
      throw createError({
        statusCode: 404,
        statusMessage: "Data tidak ditemukan",
      });
    }

    return {
      success: true,
      message: "Navigasi berhasil dihapus",
      data: deletedNav,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Gagal menghapus navigasi",
    });
  }
});
