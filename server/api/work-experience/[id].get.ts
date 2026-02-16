import { or, sql, eq } from "drizzle-orm";
import { ilike, desc } from "drizzle-orm";
import { db } from "../../../src/index";
import { workExperience } from "../../../src/db/schema/work";

export default defineEventHandler(async (event) => {
  try {
    const id = await getRouterParam(event, "id");
    const data = await db.query.workExperience.findFirst({
      where: eq(workExperience.id, Number(id)),
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
