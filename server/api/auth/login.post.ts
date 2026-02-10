// server/api/auth/login.post.ts
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "../../../src/index";
import { users } from "../../../src/db/schema/schema";
// generateToken otomatis tersedia jika ada di folder server/utils

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError({
      statusCode: 401,
      statusMessage: "Email atau Password salah",
    });
  }

  // 🔥 1. Generate Token menggunakan Helper yang kita buat tadi
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  // 🔥 2. Simpan token di Cookie (Supaya aman dari XSS)
  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });
  // 🔥 3. Kirim respon ke Frontend
  return {
    message: "Login Berhasil",
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      // Kita kirim token juga di body buat jaga-jaga jika
      // Frontend butuh simpan di LocalStorage/Pinia
      token: token,
    },
  };
});
