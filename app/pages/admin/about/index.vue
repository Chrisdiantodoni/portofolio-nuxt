<script setup lang="ts">
import type { FormSubmitEvent, EditorToolbarItem } from "@nuxt/ui";
import { statusOptions, useAboutForm } from "~/composables/form/useAboutForm";
import * as z from "zod";

definePageMeta({
  title: "About Me",
});

const toast = useToast();
const { schema, state } = useAboutForm();

// Type untuk submit handler
type Schema = z.output<typeof schema>;

// Toolbar items untuk UEditor
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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Karena ada file (avatarUrl & cvUrl), gunakan FormData untuk kirim ke API
  console.log("Data form:", event.data);

  toast.add({
    title: "Success",
    description: "Profile has been updated.",
    color: "success",
  });
}
</script>

<template>
  <UContainer class="py-5">
    <UCard>
      <template #header>
        <h3 class="text-lg font-bold">Edit Profile & About</h3>
        <p class="text-sm text-gray-500">
          Informasi ini akan muncul di halaman portfolio kamu.
        </p>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Name" name="name">
            <UInput
              v-model="state.name"
              class="w-full"
              placeholder="Your Name"
            />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput
              v-model="state.email"
              class="w-full"
              placeholder="email@example.com"
            />
          </UFormField>

          <UFormField label="Location" name="location">
            <UInput
              v-model="state.location"
              class="w-full"
              placeholder="City, Country"
            />
          </UFormField>

          <UFormField label="Current Status" name="status">
            <USelectMenu
              v-model="state.status"
              :items="statusOptions as any[]"
              value-attribute="value"
              label-attribute="label"
              placeholder="Select status"
              class="w-full"
            >
              <template #leading>
                <span
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-green-500':
                      state.status === 'Available for new projects',
                    'bg-orange-500': state.status === 'Busy',
                    'bg-red-500': state.status === 'Not Available',
                    'bg-blue-500': state.status === 'On Vacation',
                  }"
                />
              </template>
            </USelectMenu>
          </UFormField>

          <UDivider class="md:col-span-2" />

          <UFormField label="Headline" name="headline" class="md:col-span-2">
            <UEditor
              v-model="state.headline"
              v-slot="{ editor }"
              content-type="markdown"
              placeholder="Write your professional headline..."
              class="w-full min-h-32"
            >
              <UEditorToolbar :editor="editor" :items="editorItems" />
            </UEditor>
          </UFormField>
          <UFormField label="Short Bio" name="shortbio" class="md:col-span-2">
            <UEditor
              v-model="state.shortBio"
              v-slot="{ editor }"
              content-type="markdown"
              placeholder="Write your short bio..."
              class="w-full min-h-32"
            >
              <UEditorToolbar :editor="editor" :items="editorItems" />
            </UEditor>
          </UFormField>
          <UFormField label="Long Bio" name="longbio" class="md:col-span-2">
            <UEditor
              v-model="state.longBio"
              v-slot="{ editor }"
              content-type="markdown"
              placeholder="Write your Long Bio..."
              class="w-full min-h-32"
            >
              <UEditorToolbar :editor="editor" :items="editorItems" />
            </UEditor>
          </UFormField>
          <UFormField
            label="About Page Content"
            name="about_page"
            class="md:col-span-2"
          >
            <UEditor
              v-model="state.about_page"
              v-slot="{ editor }"
              content-type="markdown"
              placeholder="Describe yourself..."
              class="w-full min-h-48"
            >
              <UEditorToolbar :editor="editor" :items="editorItems" />
            </UEditor>
          </UFormField>

          <UDivider class="md:col-span-2" />

          <UFormField label="Avatar Image" name="avatarUrl">
            <UFileUpload
              v-model="state.avatarUrl"
              accept="image/*"
              label="Upload avatar"
              class="w-full"
            />
          </UFormField>

          <UFormField label="CV / Resume (PDF)" name="cvUrl">
            <UFileUpload
              v-model="state.cvUrl"
              accept=".pdf"
              label="Upload CV"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="flex justify-end pt-4">
          <AboutPreviewModal :state="state" />
          <!-- <UButton type="submit" size="lg"> Save Changes </UButton> -->
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
