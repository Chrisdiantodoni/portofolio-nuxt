// stores/useApiStore.ts
import { defineStore } from "pinia";

export const useApiStore = defineStore("api", () => {
  // 1. Fungsi untuk Inisialisasi Data (Hanya panggil sekali di layout atau page utama)
  const initData = async <T>(key: string, fetcher: () => Promise<T>) => {
    return await useAsyncData(key, fetcher);
  };

  // 2. Fungsi "Tinggal Ambil" (Tanpa Fetcher)
  // Ini yang Anda maksud: cukup masukkan key, dapat datanya.
  const getData = <T>(key: string) => {
    const { data } = useNuxtData<T>(key);
    return data; // Ini mengembalikan Ref yang reaktif
  };

  // 3. Fungsi Refresh (Opsional)
  const refresh = (key: string) => refreshNuxtData(key);

  return { initData, getData, refresh };
});
