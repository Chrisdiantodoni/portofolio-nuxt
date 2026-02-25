import { defineStore } from "pinia";

interface NavigationState {
  navbar: any[];
  footer: any[];
  loading: boolean;
}

export const useNavStore = defineStore("nav", {
  // Ubah ID agar unik
  state: (): NavigationState => ({
    navbar: [],
    footer: [],
    loading: false,
  }),

  actions: {
    async fetchNav() {
      if (this.navbar.length > 0) return; // Cache sederhana
      this.loading = true;
      try {
        const response: any = await $fetch("/api/landing/nav");
        // Pastikan mapping data sesuai dengan struktur response API Turso kamu
        this.navbar = response?.data?.nav || [];
        this.footer = response?.data?.socialLinks || [];
      } catch (error) {
        console.error("Gagal fetch data:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
