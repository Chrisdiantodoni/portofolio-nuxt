import { users } from "../../../src/db/schema/schema";
import { db } from "../../../src/index";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody(event);
    if (!body.email || !body.username) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username dan Email wajib diisi",
      });
    }
    const existingUser = await db.query.users.findFirst({
      where: or(
        eq(users.email, body.email),
        eq(users.username, body.username), // Tambahkan pengecekan username
      ),
    });
    if (existingUser) {
      const isEmail = existingUser.email === body.email;
      throw createError({
        statusCode: 409,
        statusMessage: isEmail
          ? "Email sudah digunakan"
          : "Username sudah digunakan",
      });
    }
    const hashedPassword = await bcrypt.hash("password", 10);

    // 4. Insert data ke database
    const [newUser] = await db
      .insert(users)
      .values({
        name: body.name,
        username: body.username,
        email: body.email,
        password: hashedPassword,
      })
      .returning(); // Mengembalikan data yang baru diinsert

    // 5. Kirim response sukses
    return {
      success: true,
      message: "User berhasil ditambahkan",
      data: newUser,
    };
  } catch (error: any) {
    // Menangani error jika email duplikat atau error db lainnya
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
      // Jangan return objek biasa di sini, harus throw createError
      // supaya interceptor onResponseError di api.ts bisa jalan
    });
  }
});
