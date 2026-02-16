import { db } from "../../../src/index";

import { asc } from "drizzle-orm";
import { mails } from "../../../src/db/schema/messages";

export default defineEventHandler(async (event) => {
  try {
    const data = await db.query.mails.findMany({
      orderBy: [asc(mails.createdAt)],
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
