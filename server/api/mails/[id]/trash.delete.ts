// server/api/mails/[id]/trash.delete.ts
import { db } from "../../../../src/index";
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  // Contoh logic Database:
  await db.query.mails.update({
    where: { id },
    data: { status: event.data.status },
  });

  return {
    statusCode: 200,
    message: `Mail ${id} moved to trash`,
    id: id,
  };
});
