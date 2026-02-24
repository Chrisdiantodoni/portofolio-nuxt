import { db } from "../../../src/index";
import { asc, eq } from "drizzle-orm";
import { navigation } from "../../../src/db/schema/navigation";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.navigation.findMany({
      orderBy: [asc(navigation.sortOrder)],
    });
    const socialLinks = await db.query.socialLinks.findMany({
      where: (socialLinks) => eq(socialLinks.isActive, true),
      orderBy: (socialLinks, { desc }) => [desc(socialLinks?.sortOrder)],
    });

    return {
      success: true,
      data: {
        nav: data,
        socialLinks,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
