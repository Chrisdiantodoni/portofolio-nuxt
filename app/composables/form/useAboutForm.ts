// composables/useAboutForm.ts
import * as z from "zod";
import { reactive } from "vue";

export const statusOptions = [
  {
    label: "Available for new projects",
    value: "Available for new projects",
    color: "green",
  },
  { label: "Busy / Working on projects", value: "Busy", color: "orange" },
  { label: "Not Available", value: "Not Available", color: "red" },
  { label: "On Vacation", value: "On Vacation", color: "blue" },
];

export const useAboutForm = () => {
  // 1. Schema Validasi
  const schema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    headline: z.string().min(1, "Headline wajib diisi"),
    shortBio: z.string().min(1, "Short bio wajib diisi"),
    longBio: z.string().min(1, "Long bio wajib diisi"),
    about_page: z.string().min(1, "Konten about page wajib diisi"),
    location: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    email: z.string().email("Format email tidak valid").optional().nullable(),
    // Karena ini file, validasi di zod bisa dibuat lebih fleksibel
    // atau divalidasi manual saat proses upload
    avatarUrl: z.any().optional(),
    cvUrl: z.any().optional(),
  });

  // 2. Initial state
  // Untuk file, kita inisialisasi dengan null
  const initialState = {
    name: "",
    headline: "",
    shortBio: "",
    longBio: "",
    about_page: "",
    location: "",
    status: statusOptions[0]?.value ?? "",
    email: "",
    avatarUrl: null as any | File | string | null, // Bisa berupa file baru atau URL string yang sudah ada
    cvUrl: null as any,
  };

  const state = reactive({ ...initialState });

  const resetForm = () => {
    Object.assign(state, initialState);
  };

  const setFormData = (data: Partial<typeof initialState>) => {
    Object.assign(state, data);
  };

  return {
    schema,
    state,
    resetForm,
    setFormData,
  };
};
