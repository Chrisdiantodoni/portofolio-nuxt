import { db } from "../../../../src/index";
import { eq, and, ne, or, sql } from "drizzle-orm";
import { navigation } from "../../../../src/db/schema/navigation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = await getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID navigasi diperlukan",
      });
    }

    // 2. Eksekusi Update
    const [updatedNav] = await db
      .update(navigation)
      .set({
        isActive: sql`NOT ${navigation.isActive}`, // Ini cara SQL untuk toggle boolean
      })
      .where(eq(navigation.id, id))
      .returning();

    if (!updatedNav) {
      throw createError({
        statusCode: 404,
        statusMessage: "Navigasi tidak ditemukan",
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
