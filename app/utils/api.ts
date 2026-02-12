// utils/api.ts
export const api = {
  async request<T>(url: string, options: any = {}) {
    const toast = useToast();
    const token = useCookie("auth_token"); // Mengambil token dari cookie

    try {
      return await $fetch<T>(url, {
        baseURL: "/api",
        ...options,
        // Interceptor: Otomatis jalankan sebelum request terkirim
        onRequest({ options }) {
          if (token.value) {
            // Inisialisasi headers jika belum ada
            const headers = new Headers(options.headers);

            headers.set("Authorization", `Bearer ${token.value}`);
            headers.set("Accept", "application/json");

            options.headers = headers;
          }
        },
        // Optional: Jika token expired (401), bisa auto-logout atau refresh
        onResponseError({ response }) {
          if (response.status === 401) {
            token.value = null; // Hapus token
            navigateTo("/login");
          }
        },
      });
    } catch (error: any) {
      // Error handling global agar tidak perlu try-catch berulang di UI
      const message = error.data?.message || "Terjadi kesalahan pada server";
      console.log(message);
      throw error;
    }
  },

  get<T>(url: string, opts?: any) {
    return this.request<T>(url, { ...opts, method: "GET" });
  },

  post<T>(url: string, body: any, opts?: any) {
    return this.request<T>(url, { ...opts, method: "POST", body });
  },

  patch<T>(url: string, body?: any, opts?: any) {
    return this.request<T>(url, { ...opts, method: "PATCH", body });
  },

  put<T>(url: string, body: any, opts?: any) {
    return this.request<T>(url, { ...opts, method: "PUT", body });
  },

  delete<T>(url: string, opts?: any) {
    return this.request<T>(url, { ...opts, method: "DELETE" });
  },
};
