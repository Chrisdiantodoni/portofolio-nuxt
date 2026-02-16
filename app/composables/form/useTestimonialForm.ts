// composables/form/useTestimonialForm.ts
import { z } from "zod";

export const useTestimonialForm = () => {
  const schema = z.object({
    authorName: z.string().min(3, "Nama minimal 3 karakter"),
    authorRole: z.string().min(2, "Role/Jabatan harus diisi"),
    authorCompany: z.string().optional(),
    content: z.string().min(10, "Testimoni terlalu pendek"),
    avatarUrl: z.any().optional(), // Bisa berupa File atau String URL
  });

  const state = reactive({
    authorName: "",
    authorRole: "",
    authorCompany: "",
    content: "",
    avatarUrl: undefined as any,
  });

  const resetForm = () => {
    state.authorName = "";
    state.authorRole = "";
    state.authorCompany = "";
    state.content = "";
    state.avatarUrl = undefined;
  };

  return { state, schema, resetForm };
};
