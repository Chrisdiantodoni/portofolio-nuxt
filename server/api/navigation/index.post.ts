import { db } from "../../../src/index";
import { or, desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { navigation } from "../../../src/db/schema/navigation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const existingNav = await db.query.navigation.findFirst({
      where: or(
        eq(navigation.label, body.name),
        eq(navigation.link, body.link),
      ),
    });
    if (existingNav) {
      const isLink = existingNav.link === body.link;

      throw createError({
        statusCode: 409,
        statusMessage: isLink
          ? "Link sudah digunakan"
          : "Label sudah digunakan",
      });
    }
    const lastNav = await db.query.navigation.findFirst({
      orderBy: [desc(navigation.sortOrder)],
      columns: { sortOrder: true },
    });
    const nextSortOrder = lastNav ? (lastNav.sortOrder ?? 0) + 1 : 1;

    const [newNav] = await db
      .insert(navigation)
      .values({
        label: body.label,
        link: body.link,
        sortOrder: nextSortOrder,
        isActive: body.isActive ?? true,
        parentId: body.parentId ?? null,
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
