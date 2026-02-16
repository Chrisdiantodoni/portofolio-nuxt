import { db } from "../../../src/index";
import { eq } from "drizzle-orm";
import { faqs } from "../../../src/db/schema/faqs";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({ statusCode: 400, message: "ID diperlukan" });
    }

    const [updatedFaq] = await db
      .update(faqs)
      .set({
        question: body.question,
        answer: body.answer,
        category: body.category,
      })
      .where(eq(faqs.id, Number(id)))
      .returning();

    if (!updatedFaq) {
      throw createError({ statusCode: 404, message: "FAQ tidak ditemukan" });
    }

    return {
      success: true,
      message: "FAQ updated successfully",
      data: updatedFaq,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
