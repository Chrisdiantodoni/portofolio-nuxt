import { db } from "../../../src/index";
import { or, desc, eq } from "drizzle-orm";
import { socialLinks } from "../../../src/db/schema/social-links";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // 1. Validasi duplikasi
    // Pastikan pengecekan menggunakan field yang sesuai dengan body (platform & url)
    const existingLink = await db.query.socialLinks.findFirst({
      where: or(
        eq(socialLinks.platform, body.platform),
        eq(socialLinks.url, body.url),
      ),
    });

    if (existingLink) {
      const isUrlConflict = existingLink.url === body.url;
      throw createError({
        statusCode: 409,
        statusMessage: isUrlConflict
          ? "Link URL sudah digunakan"
          : "Platform ini sudah terdaftar",
      });
    }

    // 2. Logika Auto-increment Sort Order
    const lastLink = await db.query.socialLinks.findFirst({
      orderBy: [desc(socialLinks.sortOrder)],
      columns: { sortOrder: true },
    });

    const nextSortOrder = lastLink ? (lastLink.sortOrder ?? 0) + 1 : 1;

    // 3. Insert ke SQLite/Turso
    const [newSocial] = await db
      .insert(socialLinks)
      .values({
        platform: body.platform,
        url: body.url,
        icon: body.icon,
        sortOrder: nextSortOrder,
        // Drizzle mengonversi boolean TS ke integer 0/1 untuk SQLite secara otomatis
        isActive: body.isActive ?? true,
      })
      .returning();

    return {
      success: true,
      data: newSocial,
    };
  } catch (error: any) {
    // Jika error berasal dari createError di atas, lempar kembali agar Nuxt menangkapnya
    if (error.statusCode) throw error;

    console.error("Social Links API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
