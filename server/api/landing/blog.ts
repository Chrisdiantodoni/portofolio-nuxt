import { db } from "~~/src/index";
import { pages } from "~~/src/db/schema/schema";
import { eq } from "drizzle-orm";
import { articles } from "../../../src/db/schema/articles";

export default defineEventHandler(async (event) => {
  try {
    const [allArticles, seo] = await Promise.all([
      db.query.articles.findMany({
        orderBy: (articles, { desc }) => [desc(articles.publishedAt)],
      }),
      db.query.pages.findFirst({ where: eq(pages.slug, "articles") }),
    ]);

    return {
      success: true,
      articles: allArticles || [],
      seo: seo,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data landing page",
    });
  }
});
