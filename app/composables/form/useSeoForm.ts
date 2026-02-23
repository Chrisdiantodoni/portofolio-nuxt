import * as z from "zod";

export const useSeoForm = () => {
  const schema = z.object({
    // Field Utama
    title: z.string().min(1, "Title harus diisi").nullable(),
    slug: z.string().min(1, "Slug tidak boleh kosong"),
    content: z.string().min(10, "Content minimal 10 karakter"),

    // Field SEO (Nested Object)
    seo: z
      .object({
        title: z.string().optional().or(z.literal("")),
        description: z.string().optional().or(z.literal("")),
        image: z.any().optional(),
      })
      .optional(),
  });

  const initialState = {
    title: "",
    slug: "",
    content: "",
    seo: {
      title: "",
      description: "",
      image: "" as any,
    },
  };

  const state = reactive({ ...initialState });
  const resetForm = () => {
    Object.assign(state, initialState);
  };

  const setFormData = (data: Partial<typeof initialState>) => {
    Object.assign(state, data);
  };

  return {
    state,
    resetForm,
    setFormData,
    schema,
    initialState,
  };
};
