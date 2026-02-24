import { db } from "../../../src/index";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const [socialLinks] = await db.query.socialLinks.findMany({
      where: (socialLinks) => eq(socialLinks.isActive, true),
      orderBy: (socialLinks, { desc }) => [desc(socialLinks?.sortOrder)],
    });
    return {
      success: true,
      data: socialLinks,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data",
    });
  }
});
