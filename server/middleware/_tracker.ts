import { db } from "../../src/index";
import { pageViews } from "../../src/db/schema/schema";

export default defineEventHandler(async (event) => {
  return;
  const url = getRequestURL(event);
  const path = url.pathname;

  const ignoredPaths = [
    "/api",
    "/__nuxt_content",
    "/_nuxt",
    "/_icon",
    "/favicon.ico",
    "/admin", // <--- Tambahkan ini untuk mengabaikan semua rute admin
  ];

  const isIgnored = ignoredPaths.some((p) => path.startsWith(p));
  const isFile = path.includes(".");

  if (!isIgnored && !isFile) {
    try {
      await db.insert(pageViews).values({
        pagePath: path,
        ipAddress: getRequestIP(event, { xForwardedFor: true }),
      });
    } catch (e) {
      console.error("Tracking error:", e);
    }
  }
});
