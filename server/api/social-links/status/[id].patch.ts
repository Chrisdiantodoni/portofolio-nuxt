import { db } from "../../../../src/index";
import { eq, and, ne, or, sql } from "drizzle-orm";
import { socialLinks } from "../../../../src/db/schema/social-links";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = await getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID social link diperlukan",
      });
    }

    // 2. Eksekusi Update
    const [updatedNav] = await db
      .update(socialLinks)
      .set({
        isActive: sql`NOT ${socialLinks.isActive}`, // Ini cara SQL untuk toggle boolean
      })
      .where(eq(socialLinks.id, Number(id)))
      .returning();

    if (!updatedNav) {
      throw createError({
        statusCode: 404,
        statusMessage: "Social Link tidak ditemukan",
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
