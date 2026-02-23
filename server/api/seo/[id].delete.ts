import { db } from "~~/src/index";
import { eq } from "drizzle-orm";
import { pages } from "../../../src/db/schema/pages";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID page tidak valid",
    });
  }

  try {
    await db.delete(pages).where(eq(pages.id, Number(id)));
    return { success: true, message: "Project deleted" };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
