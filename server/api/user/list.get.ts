import { or, ilike, desc, sql } from "drizzle-orm";
import { users } from "../../../src/db/schema/schema";
import { db } from "../../../src/index";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = (query.search as string) || "";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const filter = search
      ? or(
          ilike(users.name, `%${search}%`),
          ilike(users.username, `%${search}%`),
          ilike(users.email, `%${search}%`),
        )
      : undefined;

    const data = await db.query.users.findMany({
      where: filter,
      orderBy: [desc(users.createdAt)],
      limit: limit,
      offset: offset,
    });

    // 3. Hitung total data untuk pagination (menggunakan SQL count)
    const [totalCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(filter);

    const total = Number(totalCount?.count ?? 0);

    return {
      success: true,
      message: "Data user berhasil diambil",
      data: data,
      meta: {
        total: Number(total),
        page,
        limit,
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Gagal mengambil data",
    });
  }
});
