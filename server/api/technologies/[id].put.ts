import { eq, and, ne } from "drizzle-orm";
import { db } from "../../../src/index";
import { users } from "../../../src/db/schema/schema";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) throw createError({ statusCode: 400, message: "ID tidak valid" });

    // 1. Cek apakah user ada
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, Number(id)),
    });

    if (!existingUser) {
      throw createError({ statusCode: 404, message: "User tidak ditemukan" });
    }

    // 2. Validasi Duplikasi (Cek jika email/username sudah dipakai orang lain)
    // ne (not equal) memastikan kita tidak mengecek diri sendiri
    const duplicate = await db.query.users.findFirst({
      where: and(ne(users.id, Number(id)), eq(users.email, body.email)),
    });

    if (duplicate) {
      throw createError({
        statusCode: 400,
        message: "Email sudah digunakan user lain",
      });
    }

    // 3. Jalankan Update
    await db
      .update(users)
      .set({
        name: body.name,
        username: body.username,
        email: body.email,
        // password hanya diupdate jika diisi (tidak kosong)
        ...(body.password && { password: body.password }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, Number(id)));

    return {
      success: true,
      message: `User ${body.name} berhasil diperbarui`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Gagal memperbarui data",
    });
  }
});
