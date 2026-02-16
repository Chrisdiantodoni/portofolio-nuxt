import { db } from "../../../src/index";
import { eq, and, ne, or } from "drizzle-orm";
import { socialLinks } from "../../../src/db/schema/social-links";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = await getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID navigasi diperlukan",
      });
    }
    const existingSocialLink = await db.query.socialLinks.findFirst({
      where: and(
        ne(socialLinks.id, Number(id)),
        or(
          eq(socialLinks.platform, body.platform),
          eq(socialLinks.url, body.url),
        ),
      ),
    });

    if (existingSocialLink) {
      const isLink = existingSocialLink.url === body.url;
      throw createError({
        statusCode: 409,
        statusMessage: isLink
          ? "Link sudah digunakan oleh menu lain"
          : "Label sudah digunakan oleh menu lain",
      });
    }

    // 2. Eksekusi Update
    const [updatedNav] = await db
      .update(socialLinks)
      .set({
        platform: body.platform,
        url: body.url,
        icon: body.icon,
      })
      .where(eq(socialLinks.id, Number(id)))
      .returning();

    if (!updatedNav) {
      throw createError({
        statusCode: 404,
        statusMessage: "Social Link tidak ditemukan",
      });
    }

    return {
      success: true,
      data: updatedNav,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Gagal memperbarui Social Link",
    });
  }
});
