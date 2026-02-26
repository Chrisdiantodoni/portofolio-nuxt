import { db } from "~~/src/index";
import { eq } from "drizzle-orm";
import { articles } from "../../../../src/db/schema/articles";

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, "slug");

    const currentPost = await db.query.articles.findFirst({
      where: (table, { eq }) => eq(table.slug, String(slug)),
    });

    if (!currentPost) throw createError({ statusCode: 404 });

    const prevPost = await db.query.articles.findFirst({
      columns: { slug: true, title: true, description: true },
      where: (table, { lt, and, eq }) =>
        and(
          lt(table.publishedAt, currentPost.publishedAt),
          eq(table.isActive, true),
        ),
      orderBy: (table, { desc }) => [desc(table.publishedAt)],
    });

    const nextPost = await db.query.articles.findFirst({
      columns: { slug: true, title: true, description: true },
      where: (table, { gt, and, eq }) =>
        and(
          gt(table.publishedAt, currentPost.publishedAt),
          eq(table.isActive, true),
        ),
      orderBy: (table, { asc }) => [asc(table.publishedAt)],
    });

    return {
      ...currentPost,
      surround: [prevPost || null, nextPost || null],
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data landing page",
    });
  }
});
