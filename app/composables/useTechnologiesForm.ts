// composables/useTechnologiesForm.ts
import * as z from "zod";

export const useTechnologiesForm = () => {
  // 1. Sesuaikan schema untuk Master Data Technology
  const schema = z.object({
    name: z.string().min(1, "Nama teknologi wajib diisi"),
    icon: z.string().min(1, "Icon wajib dipilih"),
    description: z.string().optional(), // Deskripsi opsional
  });

  // 2. Initial state sesuai kolom di database
  const initialState = {
    name: "",
    icon: "i-lucide-box", // Beri default icon agar tidak kosong
    description: "",
  };

  // 3. Gunakan reactive untuk state form
  const state = reactive({ ...initialState });

  // 4. Fungsi reset untuk membersihkan form setelah submit atau saat modal tutup
  const resetForm = () => {
    Object.assign(state, initialState);
  };

  return {
    schema,
    state,
    resetForm,
  };
};
