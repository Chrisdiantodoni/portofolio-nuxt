<script setup lang="ts">
definePageMeta({
  title: "Create",
});

import type { FormSubmitEvent, EditorToolbarItem } from "@nuxt/ui";

import * as z from "zod";

const schema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().optional(),
  logoUrl: z.any(),
});

const state = reactive({
  company: "",
  role: "",
  period: "",
  description: "",
  logoUrl: "" as any,
});

type Schema = z.output<typeof schema>;

const editorItems: EditorToolbarItem[][] = [
  [
    { kind: "mark", mark: "bold", icon: "i-lucide-bold" },
    { kind: "mark", mark: "italic", icon: "i-lucide-italic" },
  ],
  [
    { kind: "heading", level: 1, icon: "i-lucide-heading-1" },
    { kind: "heading", level: 2, icon: "i-lucide-heading-2" },
  ],
  [
    { kind: "bulletList", icon: "i-lucide-list" },
    { kind: "orderedList", icon: "i-lucide-list-ordered" },
  ],
  [
    { kind: "link", icon: "i-lucide-link" },
    { kind: "blockquote", icon: "i-lucide-quote" },
  ],
];

const loading = ref(false);
const toast = useToast();

const { addNewWorkExperience } = useWorkExperience();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const formData = new FormData();
    Object.entries(event.data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    await addNewWorkExperience(formData);
    toast.add({ title: "Success saved", color: "success" });
    navigateTo("/admin/work-experience");
  } catch (e) {
    toast.add({ title: "Error saving", color: "error" });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UContainer class="max-w-3xl py-10">
    <UCard>
      <template #header>
        <div class="flex items-center gap-4">
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            @click="navigateTo('/admin/work-experience')"
          />
          <h2 class="font-bold">New Experience</h2>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormField
            label="Company Name"
            name="company"
            class="col-span-2 md:col-span-1"
          >
            <UInput
              v-model="state.company"
              placeholder="e.g. PT. Maju Jaya"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Role / Position"
            name="role"
            class="col-span-2 md:col-span-1"
          >
            <UInput
              v-model="state.role"
              placeholder="e.g. Senior Frontend Developer"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField
          label="Period"
          name="period"
          help="Contoh: Jan 2022 - Present"
        >
          <UInput
            v-model="state.period"
            placeholder="e.g. 2023 - Present"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Logo" name="logoUrl">
          <UFileUpload
            v-model="state.logoUrl"
            accept="image/*"
            label="Upload Logo"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Description" name="description">
          <UEditor
            v-model="state.description"
            v-slot="{ editor }"
            content-type="markdown"
            placeholder="Describe yourself..."
            class="w-full min-h-48 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all"
          >
            <UEditorToolbar
              :editor="editor"
              :items="editorItems"
              class="border-b border-gray-200 dark:border-gray-800 mb-5"
            />
          </UEditor>
        </UFormField>

        <div class="flex justify-end gap-3">
          <UButton
            variant="ghost"
            color="neutral"
            label="Cancel"
            @click="navigateTo('/admin/work-experience')"
          />
          <UButton type="submit" :loading="loading" label="Save Experience" />
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
