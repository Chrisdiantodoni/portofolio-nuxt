import { or, sql } from "drizzle-orm";
import { ilike, desc } from "drizzle-orm";
import { db } from "../../../src/index";
import { testimonials } from "../../../src/db/schema/testimonials";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.testimonials.findMany({
      orderBy: [desc(testimonials.id)],
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
