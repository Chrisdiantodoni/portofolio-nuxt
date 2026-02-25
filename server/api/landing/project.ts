import { db } from "~~/src/index";
import { pages } from "~~/src/db/schema/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const [allProjects, seo] = await Promise.all([
      db.query.projects.findMany({
        orderBy: (projects, { desc }) => [desc(projects.year)],
        with: {
          technologies: {
            with: {
              technology: true,
            },
          },
        },
      }),
      db.query.pages.findFirst({ where: eq(pages.slug, "projects") }),
    ]);

    return {
      success: true,
      projects: allProjects || [],
      seo: seo,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data landing page",
    });
  }
});
