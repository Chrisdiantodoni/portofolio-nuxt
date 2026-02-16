import { db } from "../../../src/index";
import { or, desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { socialLinks } from "../../../src/db/schema/social-links";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const existingNav = await db.query.socialLinks.findFirst({
      where: or(
        eq(socialLinks.platform, body.name),
        eq(socialLinks.url, body.link),
      ),
    });
    if (existingNav) {
      const isLink = existingNav.url === body.url;

      throw createError({
        statusCode: 409,
        statusMessage: isLink
          ? "Link sudah digunakan"
          : "Platform sudah digunakan",
      });
    }
    const lastNav = await db.query.socialLinks.findFirst({
      orderBy: [desc(socialLinks.sortOrder)],
      columns: { sortOrder: true },
    });
    const nextSortOrder = lastNav ? (lastNav.sortOrder ?? 0) + 1 : 1;

    const [newNav] = await db
      .insert(socialLinks)
      .values({
        platform: body.platform,
        url: body.url,
        icon: body.icon,
        sortOrder: nextSortOrder,
        isActive: body.isActive ?? true,
      })
      .returning();

    return {
      success: true,
      data: newNav,
    };
  } catch (error: any) {
    console.log({ error });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
      // Jangan return objek biasa di sini, harus throw createError
      // supaya interceptor onResponseError di api.ts bisa jalan
    });
  }
});
