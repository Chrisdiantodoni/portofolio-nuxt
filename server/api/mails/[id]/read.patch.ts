// server/api/mails/[id]/read.patch.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  // Di sini biasanya Anda melakukan query ke Database
  // Contoh: await db.mail.update({ where: { id }, data: { unread: false } })

  console.log(`Email ${id} ditandai sebagai sudah dibaca`);

  return {
    statusCode: 200,
    message: `Mail ${id} marked as read`,
    id: id,
  };
});
