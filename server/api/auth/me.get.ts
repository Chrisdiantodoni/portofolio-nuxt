// server/api/auth/me.get.ts
import { eq } from "drizzle-orm";
import { db } from "../../../src/index";
import { users } from "../../../src/db/schema/schema";
import { getUserByToken } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const user = await getUserByToken(event);

  if (!user) {
    throw createError({ statusCode: 401, message: "Kamu belum login!" });
  }

  return { user };
});
