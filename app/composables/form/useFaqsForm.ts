import { z } from "zod";

export const useFaqForm = () => {
  const schema = z.object({
    question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
    answer: z.string().min(5, "Jawaban minimal 5 karakter"),
    category: z.string().min(1, "Kategori harus diisi"),
  });

  const state = reactive({
    question: "",
    answer: "",
    category: "General", // Default category
  });

  const resetForm = () => {
    state.question = "";
    state.answer = "";
    state.category = "General";
  };

  return { state, schema, resetForm };
};
