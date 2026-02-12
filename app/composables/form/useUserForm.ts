// composables/useUserForm.ts
import * as z from "zod";

export const useUserForm = () => {
  const schema = z.object({
    name: z.string().min(2, "Nama terlalu pendek"),
    email: z.string().email("Email tidak valid"),
    username: z.string().min(4, "Username minimal 4 karakter"),
  });

  const initialState = {
    name: "",
    email: "",
    username: "",
  };

  const state = reactive({ ...initialState });

  const resetForm = () => {
    Object.assign(state, initialState);
  };

  return { schema, state, resetForm };
};
