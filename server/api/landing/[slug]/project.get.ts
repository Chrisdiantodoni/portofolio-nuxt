import { db } from "~~/src/index";
import { eq } from "drizzle-orm";
import { projects } from "~~/src/db/schema/projects";

export default defineEventHandler(async (event) => {
  const slug = (await getRouterParam(event, "slug")) as string;

  try {
    const result = await db.query.projects.findFirst({
      where: eq(projects.slug, slug),
      with: {
        technologies: {
          with: {
            technology: true,
          },
        },
      },
    });

    return {
      success: true,
      ...result,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data landing page",
    });
  }
});
