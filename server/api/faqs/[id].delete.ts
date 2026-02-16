import { db } from "../../../src/index";
import { eq } from "drizzle-orm";
import { faqs } from "../../../src/db/schema/faqs";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({ statusCode: 400, message: "ID diperlukan" });
    }

    const [deletedFaq] = await db
      .delete(faqs)
      .where(eq(faqs.id, Number(id)))
      .returning();

    if (!deletedFaq) {
      throw createError({ statusCode: 404, message: "FAQ tidak ditemukan" });
    }

    return {
      success: true,
      message: "FAQ deleted successfully",
      data: deletedFaq,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
