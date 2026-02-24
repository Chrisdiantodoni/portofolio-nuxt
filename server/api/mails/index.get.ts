import { db } from "../../../src/index";
import { mails } from "../../../src/db/schema/messages";
import { eq, and, desc, sql, count } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filter = query.filter as string;
    const statusParam = query.status as string;

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    // 1. Inisialisasi array conditions kosong
    const conditions = [];

    // 2. Tambahkan kondisi status HANYA jika statusParam ada nilainya
    if (statusParam) {
      conditions.push(eq(mails.status, statusParam as any));
    }

    // 3. Tambahkan filter unread
    if (filter === "unread") {
      conditions.push(eq(mails.unread, true));
    }

    // 4. Jalankan query dengan pengecekan array conditions
    // Jika conditions kosong, and(...conditions) akan diabaikan oleh Drizzle
    const [data, totalCount] = await Promise.all([
      db
        .select()
        .from(mails)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(mails.date))
        .limit(pageSize)
        .offset(offset),

      // Tambahkan hitungan total untuk keperluan UI pagination di frontend
      db
        .select({ value: count() })
        .from(mails)
        .where(conditions.length > 0 ? and(...conditions) : undefined),
    ]);

    return {
      success: true,
      data: data,
      pagination: {
        total: totalCount[0]?.value ?? 0, // Jika [0] undefined, pakai 0
        page,
        pageSize,
        totalPages: Math.ceil((totalCount[0]?.value ?? 0) / pageSize),
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data",
    });
  }
});
