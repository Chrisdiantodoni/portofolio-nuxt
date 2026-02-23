import { db } from "../../../src/index";
import { desc } from "drizzle-orm";
import { pages } from "../../../src/db/schema/pages";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.pages.findMany({
      orderBy: [desc(pages.id)],
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
