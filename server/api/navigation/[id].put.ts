import { db } from "../../../src/index";
import { eq, and, ne, or } from "drizzle-orm";
import { navigation } from "../../../src/db/schema/navigation";

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
    const existingNav = await db.query.navigation.findFirst({
      where: and(
        ne(navigation.id, id),
        or(eq(navigation.label, body.label), eq(navigation.link, body.link)),
      ),
    });

    if (existingNav) {
      const isLink = existingNav.link === body.link;
      throw createError({
        statusCode: 409,
        statusMessage: isLink
          ? "Link sudah digunakan oleh menu lain"
          : "Label sudah digunakan oleh menu lain",
      });
    }

    // 2. Eksekusi Update
    const [updatedNav] = await db
      .update(navigation)
      .set({
        label: body.label,
        link: body.link,
      })
      .where(eq(navigation.id, id))
      .returning();

    if (!updatedNav) {
      throw createError({
        statusCode: 404,
        statusMessage: "Navigasi tidak ditemukan",
      });
    }

    return {
      success: true,
      data: updatedNav,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Gagal memperbarui navigasi",
    });
  }
});
