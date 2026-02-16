import { db } from "../../../src/index";

import { desc } from "drizzle-orm";
import { articles } from "../../../src/db/schema/articles";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.articles.findMany({
      orderBy: [desc(articles.publishedAt)],
    });
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data navigasi",
    });
  }
});
