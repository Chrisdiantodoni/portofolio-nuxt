<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
definePageMeta({
  layout: "authentication",
});

const toast = useToast();
const router = useRouter();

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    name: "remember",
    label: "Remember me",
    type: "checkbox",
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;
const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: payload.data,
    });

    console.log("Response:", response); // Debug

    if (response?.success) {
      toast.add({
        title: "Berhasil",
        description: "Selamat datang kembali!",
        color: "success",
      });

      await navigateTo("/admin/dashboard", { replace: true });
    } else {
      toast.add({
        title: "Login Gagal",
        description: response?.message || "Terjadi kesalahan",
        color: "error",
      });
    }
  } catch (error) {
    console.error("Login error:", error); // Debug
    toast.add({
      title: "Error",
      description: "Terjadi kesalahan saat login",
      color: "error",
    });
  }
};
</script>

<template>
  <ClientOnly>
    <div class="flex justify-center w-full">
      <UPageCard variant="subtle" class="w-full max-w-sm shadow-xl">
        <UAuthForm
          :schema="schema"
          title="Login"
          description="Enter your credentials to access your account."
          icon="i-lucide-user"
          :fields="fields"
          @submit="onSubmit"
        />
      </UPageCard>
    </div>
  </ClientOnly>
</template>
