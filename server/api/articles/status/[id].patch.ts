import { db } from "../../../../src/index";
import { eq, and, ne, or, sql } from "drizzle-orm";
import { articles } from "../../../../src/db/schema/articles";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = await getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID article diperlukan",
      });
    }

    // 2. Eksekusi Update
    const [updatedArticle] = await db
      .update(articles)
      .set({
        isActive: sql`NOT ${articles.isActive}`, // Ini cara SQL untuk toggle boolean
      })
      .where(eq(articles.id, Number(id)))
      .returning();

    if (!updatedArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: "Article tidak ditemukan",
      });
    }

    return {
      success: true,
      data: updatedArticle,
    };
  } catch (error: any) {
    console.log({ error });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Gagal memperbarui navigasi",
    });
  }
});
