import { or, sql } from "drizzle-orm";
import { ilike } from "drizzle-orm";
import { technologies } from "../../../src/db/schema/master";
import { db } from "../../../src/index";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = (query.search as string) || "";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const filter = search
      ? or(ilike(technologies.name, `%${search}%`))
      : undefined;

    const data = await db.query.technologies.findMany({
      where: filter,
      limit: limit,
      offset: offset,
    });
    const [totalCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(technologies)
      .where(filter);

    const total = Number(totalCount?.count ?? 0);

    return {
      success: true,
      message: "Data Technologies berhasil diambil",
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
