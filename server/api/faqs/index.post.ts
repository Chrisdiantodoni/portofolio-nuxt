import { db } from "../../../src/index";
import { or, desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { faqs } from "../../../src/db/schema/faqs";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const [newFaqs] = await db
      .insert(faqs)
      .values({
        question: body.question ?? "",
        answer: body?.answer ?? "",
        category: body?.category ?? "",
      })
      .returning();

    return {
      success: true,
      data: newFaqs,
    };
  } catch (error: any) {
    console.log({ error });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
