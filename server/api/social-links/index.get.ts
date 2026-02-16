import { db } from "../../../src/index";
import { asc } from "drizzle-orm";
import { socialLinks } from "../../../src/db/schema/social-links";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.socialLinks.findMany({
      orderBy: [asc(socialLinks.sortOrder)],
    });
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data social links",
    });
  }
});
