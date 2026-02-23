import { db } from "../../../src/index";

import { asc } from "drizzle-orm";
import { mails } from "../../../src/db/schema/messages";
import { eq, and, ne, desc } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filter = query.filter as string; // 'all' atau 'unread'

    // Logika Filter Dasar:
    // Kita hanya ingin mengambil email yang statusnya 'inbox' (bukan trash)
    const conditions = [eq(mails.status, "inbox")];

    // Jika user memilih tab 'Unread', tambahkan kondisi unread = true
    if (filter === "unread") {
      conditions.push(eq(mails.unread, true));
    }

    const data = await db
      .select()
      .from(mails)
      .where(and(...conditions))
      .orderBy(desc(mails.date)); // Email terbaru di atas

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data navigasi",
    });
  }
});
