import { db } from "../../../src/index";

import { asc } from "drizzle-orm";
import { navigation } from "../../../src/db/schema/navigation";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.navigation.findMany({
      orderBy: [asc(navigation.sortOrder)],
    });
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
