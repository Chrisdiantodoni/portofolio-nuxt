<script setup lang="ts">
import type { FormSubmitEvent, EditorToolbarItem } from "@nuxt/ui";
import { statusOptions, useAboutForm } from "~/composables/form/useAboutForm";
import * as z from "zod";

definePageMeta({
  title: "About Me",
});

const toast = useToast();
const { schema, state, setFormData } = useAboutForm();

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

const { updateAbout } = useAbout();

const { data, status, refresh } = useFetch("/api/about");

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const formData = new FormData();

    // Append text fields
    if (event.data.name) formData.append("name", event.data.name);
    if (event.data.email) formData.append("email", event.data.email);
    if (event.data.location) formData.append("location", event.data.location);
    if (event.data.status) formData.append("status", event.data.status);
    if (event.data.headline) formData.append("headline", event.data.headline);
    if (event.data.shortBio) formData.append("shortBio", event.data.shortBio);
    if (event.data.longBio) formData.append("longBio", event.data.longBio);
    if (event.data.about_page)
      formData.append("about_page", event.data.about_page);

    // Append avatar file jika ada
    if (event.data.avatarUrl) {
      formData.append("avatarUrl", event.data.avatarUrl);
    }

    // Append CV file jika ada
    if (event.data.cvUrl) {
      formData.append("cvUrl", event.data.cvUrl);
    }

    const response = await updateAbout(formData);
    if (response?.success) {
      refresh();
      toast.add({
        title: "Success",
        description: "About updated!",
        color: "success",
      });
    }
  } catch (error) {
    toast.add({
      title: "Error",
      description: `Add New User Error`,
      color: "error",
    });
  }
}
const existingAvatarUrl = ref("");
const existingCvUrl = ref("");
watchEffect(() => {
  if (data.value?.success && data.value?.data) {
    const d = data.value.data;
    existingAvatarUrl.value = d.avatarUrl || "";
    existingCvUrl.value = d.cvUrl || "";
    setFormData({
      name: d.name,
      email: d.email ?? "",
      location: d.location ?? "",
      status: d.status ?? "",
      headline: d.headline,
      shortBio: d.shortBio,
      longBio: d.longBio,
      about_page: d.about_page,
      avatarUrl: null,
      cvUrl: null,
    });
  }
});

const avatarPreview = computed(() => {
  const avatar = state.avatarUrl;

  // 1. Jika ada file baru yang dipilih di UFileUpload
  // UFileUpload biasanya mengembalikan Array [File]
  if (avatar instanceof File) {
    return URL.createObjectURL(avatar);
  }

  // 2. Jika tidak ada file baru, tampilkan URL lama dari database
  return existingAvatarUrl.value || null;
});

const cvPreview = computed(() => {
  const cv = state.cvUrl;

  // 1. Jika ada file baru dipilih (UFileUpload mengembalikan Array)
  if (Array.isArray(cv) && cv.length > 0) {
    return {
      name: cv[0].name,
      size: (cv[0].size / 1024 / 1024).toFixed(2) + " MB",
      isNew: true,
      url: URL.createObjectURL(cv[0]),
    };
  }

  // 2. Jika tidak ada file baru, gunakan URL dari database
  if (existingCvUrl.value) {
    return {
      name: "Current_Resume.pdf",
      isNew: false,
      url: existingCvUrl.value,
    };
  }

  return null;
});
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

          <USeparator class="md:col-span-2" />

          <UFormField label="Headline" name="headline" class="md:col-span-2">
            <UEditor
              v-model="state.headline"
              v-slot="{ editor }"
              content-type="markdown"
              placeholder="Write your professional headline..."
              class="w-full min-h-32 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all"
            >
              <UEditorToolbar
                :editor="editor"
                :items="editorItems"
                class="border-b border-gray-200 dark:border-gray-800 mb-5"
              />
            </UEditor>
          </UFormField>
          <UFormField label="Short Bio" name="shortbio" class="md:col-span-2">
            <UEditor
              v-model="state.shortBio"
              v-slot="{ editor }"
              content-type="markdown"
              placeholder="Write your short bio..."
              class="w-full min-h-32 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all"
            >
              <UEditorToolbar
                :editor="editor"
                :items="editorItems"
                class="border-b border-gray-200 dark:border-gray-800 mb-5"
              />
            </UEditor>
          </UFormField>
          <UFormField label="Long Bio" name="longbio" class="md:col-span-2">
            <UEditor
              v-model="state.longBio"
              v-slot="{ editor }"
              content-type="markdown"
              placeholder="Write your Long Bio..."
              class="w-full min-h-32 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all"
            >
              <UEditorToolbar
                :editor="editor"
                :items="editorItems"
                class="border-b border-gray-200 dark:border-gray-800 mb-5"
              />
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
              class="w-full min-h-48 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all"
            >
              <UEditorToolbar
                :editor="editor"
                :items="editorItems"
                class="border-b border-gray-200 dark:border-gray-800 mb-5"
              />
            </UEditor>
          </UFormField>

          <USeparator class="md:col-span-2" />

          <UFormField label="Avatar Image" name="avatarUrl">
            <div class="flex items-center gap-5">
              <UAvatar
                :src="avatarPreview || ''"
                :alt="'Avatar'"
                size="xl"
                class="ring-2 ring-primary-500 bg-gray-100 dark:bg-gray-800 shadow-sm"
              />
              <UFileUpload
                v-model="state.avatarUrl"
                accept="image/*"
                label="Upload avatar"
                class="w-full"
              />
            </div>
          </UFormField>

          <UFormField
            label="CV / Resume (PDF)"
            name="cvUrl"
            class="md:col-span-1"
          >
            <div class="space-y-3">
              <UFileUpload
                v-model="state.cvUrl as File"
                accept=".pdf"
                icon="i-lucide-file-text"
                label="Upload New CV"
                class="w-full"
              />

              <div
                v-if="cvPreview"
                class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50"
              >
                <div class="flex items-center gap-3 overflow-hidden">
                  <UIcon
                    name="i-lucide-file-text"
                    class="w-8 h-8 text-red-500 shrink-0"
                  />
                  <div class="text-sm truncate">
                    <p
                      class="font-medium text-gray-900 dark:text-white truncate"
                    >
                      {{ cvPreview.name }}
                    </p>
                    <p
                      v-if="cvPreview.isNew"
                      class="text-xs text-green-500 font-semibold"
                    >
                      Ready to upload ({{ cvPreview.size }})
                    </p>
                    <p v-else class="text-xs text-gray-500">Stored on server</p>
                  </div>
                </div>

                <UButton
                  :to="cvPreview.url"
                  target="_blank"
                  variant="ghost"
                  color="neutral"
                  icon="i-lucide-external-link"
                  size="xs"
                >
                  View
                </UButton>
              </div>
            </div>
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
