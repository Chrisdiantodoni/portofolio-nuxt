import { db } from "../../../src/index";
import { desc } from "drizzle-orm";
import { projects } from "../../../src/db/schema/projects";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.projects.findMany({
      with: {
        technologies: {
          with: {
            technology: true,
          },
        },
      },
      orderBy: [desc(projects.year)],
    });
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
