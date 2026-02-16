import * as z from "zod";
import { reactive } from "vue";

export const useProjectForm = () => {
  const schema = z.object({
    // ID opsional karena otomatis di-generate UUID oleh Postgres saat Create
    id: z.string().nullable(),

    title: z
      .string()
      .min(1, "Judul proyek wajib diisi")
      .max(255, "Judul terlalu panjang"),

    description: z.string().min(10, "Deskripsi minimal 10 karakter"),

    // Year dikirim sebagai string dari form, jadi kita transform ke number
    year: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .int()
        .min(2000, "Tahun tidak valid")
        .max(new Date().getFullYear() + 1),
    ),

    // Enum sesuai dengan pgEnum yang kita buat di database
    type: z.enum(["web", "mobile", "desktop", "game"]),

    // Validasi URL (opsional tapi jika diisi harus format URL)
    githubLink: z
      .string()
      .url()
      .nullable()
      .or(z.literal("")) // Mengizinkan string kosong
      .optional(),
    projectLink: z
      .string()
      .url()
      .nullable()
      .or(z.literal("")) // Mengizinkan string kosong
      .optional(),
    imageUrl: z.any(),

    // Array ID teknologi dari tabel master
    technologies: z.array(z.object()).min(1, "Pilih minimal satu teknologi"),
  });

  const initialState = {
    id: "",
    title: "",
    description: "",
    year: "",
    slug: "",
    type: "web" as any,
    projectLink: "",
    githubLink: "",
    imageUrl: null as any,
    technologies: [] as any,
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
