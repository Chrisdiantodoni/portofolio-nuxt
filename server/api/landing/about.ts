import { db } from "~~/src/index";
import { eq } from "drizzle-orm";
import { pages } from "~~/src/db/schema/schema";
import { profile } from "../../../src/db/schema/profile";

export default defineEventHandler(async (event) => {
  try {
    const [about, seo, allProjects] = await Promise.all([
      db.query.profile.findFirst({
        where: eq(profile.id, 1),
      }),
      db.query.pages.findFirst({ where: eq(pages.slug, "about") }),
      db.query.projects.findMany({
        orderBy: (projects, { desc }) => [desc(projects.year)],
        limit: 4, // Biasanya di home hanya tampilkan beberapa
      }),
    ]);
    return {
      success: true,
      about: about || null,
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
