// stores/auth.ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);
  const loading = ref(false);

  // Fungsi untuk ambil data profil dari API /api/auth/me
  async function fetchUser() {
    if (user.value) return; // Jangan fetch lagi kalau sudah ada

    loading.value = true;
    try {
      const response = (await api.get("/auth/me")) as any;
      console.log(response.user);
      if (response.user) {
        user.value = response.user;
      }
    } catch (error) {
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    const token = useCookie("auth_token");
    token.value = null;
    user.value = null;
    navigateTo("/login");
  }

  return { user, isAuthenticated, loading, fetchUser, logout };
});
