import { db } from "../../../src/index";
import { or, desc, eq } from "drizzle-orm";
import { navigation } from "../../../src/db/schema/navigation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // 1. Cek apakah label atau link sudah ada
    const existingNav = await db.query.navigation.findFirst({
      where: or(
        eq(navigation.label, body.label), // Pastikan menggunakan body.label (sesuai input)
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

    // 2. Ambil sortOrder terakhir
    const lastNav = await db.query.navigation.findFirst({
      orderBy: [desc(navigation.sortOrder)],
      columns: { sortOrder: true },
    });

    const nextSortOrder = lastNav ? (lastNav.sortOrder ?? 0) + 1 : 1;

    // 3. Insert ke Turso
    // Catatan: Turso (libSQL) mendukung .returning() sama seperti Postgres
    const [newNav] = await db
      .insert(navigation)
      .values({
        label: body.label,
        link: body.link,
        sortOrder: nextSortOrder,
        // Di SQLite, boolean dikirim sebagai true/false, Drizzle handle konversi ke 0/1
        isActive: body.isActive !== undefined ? body.isActive : true,
        parentId: body.parentId || null,
      })
      .returning();

    return {
      success: true,
      data: newNav,
    };
  } catch (error: any) {
    // Pastikan error re-throw agar ditangkap oleh Nuxt error handler
    if (error.statusCode) throw error;

    console.error("API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
