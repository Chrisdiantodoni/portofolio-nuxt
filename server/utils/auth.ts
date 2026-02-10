// server/utils/auth.ts
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../src/index";
import { users } from "../../src/db/schema/schema";

const SECRET = process.env.JWT_SECRET || "rahasia-ilahi-123";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as { userId: number; email: string };
  } catch (error) {
    return null;
  }
};

export const getUserByToken = async (event: any) => {
  // Ambil cookie
  const token = getCookie(event, "auth_token");
  if (!token) return null;

  // Verifikasi (fungsi verifyToken yang kita buat sebelumnya)
  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Ambil data user dari DB
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, decoded.userId));

  return user || null;
};
