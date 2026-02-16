import * as z from "zod";
import { reactive } from "vue";

export const articleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  publishedAt: z.string().nonempty("Tanggal terbit harus diisi"),
  imageUrl: z.any().optional(),
});

export const useArticleForm = () => {
  const state = reactive({
    title: "",
    description: "",
    publishedAt: new Date().toISOString().split("T")[0], // Default ke hari ini
    imageUrl: undefined as any,
  });

  const resetForm = () => {
    state.title = "";
    state.description = "";
    state.publishedAt = new Date().toISOString().split("T")[0];
    state.imageUrl = undefined;
  };

  const setFormData = (data: any) => {
    state.title = data.title;
    state.description = data.description;
    state.publishedAt = data.publishedAt;
    state.imageUrl = data.imageUrl;
  };

  return { state, schema: articleSchema, resetForm, setFormData };
};
