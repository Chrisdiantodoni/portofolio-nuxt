import { db } from "../../../src/index";
import { asc } from "drizzle-orm";
import { faqs } from "../../../src/db/schema/faqs";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.faqs.findMany({
      orderBy: [asc(faqs.category)],
    });
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data faqs",
    });
  }
});
