// ~/server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");
  const url = getRequestURL(event);
  const path = url.pathname;

  console.log("🔍 Server Auth Middleware");
  console.log("📍 Path:", path);
  console.log("🎫 Token:", token ? "exists" : "missing");

  // Protect /admin routes
  if (path.startsWith("/admin")) {
    if (!token) {
      console.log("➡️ Redirect to /auth/login (no token)");
      return sendRedirect(event, "/auth/login", 302);
    }

    // Optional: Verify token validity
    try {
      await verifyToken(token);
    } catch (error) {
      deleteCookie(event, "auth_token");
      return sendRedirect(event, "/auth/login", 302);
    }
  }

  // Redirect authenticated users from login page
  if (path === "/auth/login" && token) {
    console.log("➡️ Redirect to /admin (already authenticated)");
    return sendRedirect(event, "/admin", 302);
  }

  console.log("✅ Request allowed");
});
