import { or, sql, eq } from "drizzle-orm";
import { ilike, desc } from "drizzle-orm";
import { db } from "../../../src/index";
import { articles } from "../../../src/db/schema/articles";

export default defineEventHandler(async (event) => {
  try {
    const id = await getRouterParam(event, "id");
    const data = await db.query.articles.findFirst({
      where: eq(articles.id, Number(id)),
    });

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data",
    });
  }
});
