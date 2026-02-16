import { or, sql } from "drizzle-orm";
import { ilike, desc } from "drizzle-orm";
import { db } from "../../../src/index";
import { workExperience } from "../../../src/db/schema/work";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.workExperience.findMany({
      orderBy: [desc(workExperience.id)],
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
