<script setup lang="ts">
import type { FormSubmitEvent, EditorToolbarItem } from "@nuxt/ui";
import { useArticleForm } from "~/composables/form/useArticleForm";

definePageMeta({
  title: "Create New Article",
});

const route = useRoute();

// Mengambil ID dari parameter URL
const id = route.params.id as any;

const { data } = useFetch(`/api/articles/${id}`);

const { state, schema, resetForm } = useArticleForm();
const toast = useToast();
const router = useRouter();
const loading = ref(false);

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
const existingImageUrl = ref("");

const imagePreview = computed(() => {
  if (state.imageUrl instanceof File)
    return URL.createObjectURL(state.imageUrl);
  if (existingImageUrl.value) return existingImageUrl.value;

  return null;
});

const { updateArticle } = useArticle();

watchEffect(() => {
  const articleData = data?.value?.data;
  if (data?.value?.success) {
    state.title = articleData?.title ?? "";
    state.description = articleData?.description ?? "";
    state.publishedAt = articleData?.publishedAt ?? "";
    existingImageUrl.value = articleData?.imageUrl ?? "";
  }
});

async function onSubmit() {
  loading.value = true;
  const formData = new FormData();

  formData.append("title", state.title);
  formData.append("description", state.description);
  formData.append("publishedAt", state.publishedAt || "");

  if (state.imageUrl instanceof File) {
    formData.append("imageUrl", state.imageUrl);
  }

  try {
    await updateArticle(id, formData);
    toast.add({
      title: "Success",
      description: "Artikel berhasil diterbitkan!",
      color: "success",
    });
    navigateTo("/admin/articles");
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.statusMessage || "Gagal menyimpan artikel",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-4">
        <UButton
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          @click="router.back()"
        />
        <div>
          <h1 class="text-2xl font-bold">Update Article</h1>
          <p class="text-sm text-gray-500">
            Tulis ide atau panduan teknis barumu.
          </p>
        </div>
      </div>
    </template>

    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Title" name="title" class="md:col-span-1">
          <UInput
            v-model="state.title"
            placeholder="Contoh: Tutorial Docker Stardew Valley"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Publish Date"
          name="publishedAt"
          class="md:col-span-1"
        >
          <UInput
            v-model="state.publishedAt"
            type="date"
            icon="i-lucide-calendar"
            class="w-full"
          />
        </UFormField>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <UFormField label="Cover Image" name="imageUrl">
          <UFileUpload
            v-model="state.imageUrl"
            accept="image/*"
            class="h-64"
            :ui="{ base: 'h-full' }"
          />
        </UFormField>

        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200"
            >Image Preview</span
          >
          <div
            class="relative w-full h-64 rounded-xl overflow-hidden border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center"
          >
            <template v-if="imagePreview">
              <img :src="imagePreview" class="w-full h-full object-cover" />
              <UButton
                icon="i-lucide-x"
                color="error"
                variant="solid"
                class="absolute top-2 right-2 rounded-full"
                @click="state.imageUrl = undefined"
              />
            </template>

            <div v-else class="text-center p-4">
              <UIcon name="i-lucide-image" class="size-12 text-gray-400 mb-2" />
              <p class="text-xs text-gray-500">No image selected</p>
            </div>
          </div>
        </div>
      </div>

      <UFormField label="Content" name="description">
        <UEditor
          v-model="state.description"
          v-slot="{ editor }"
          content-type="markdown"
          placeholder="Write your professional headline..."
          class="w-full min-h-64 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all"
        >
          <UEditorToolbar
            :editor="editor"
            :items="editorItems"
            class="border-b border-gray-200 dark:border-gray-800 mb-5"
          />
        </UEditor>
      </UFormField>

      <div class="flex justify-end gap-3 pt-6 border-t">
        <UButton
          label="Cancel"
          variant="ghost"
          color="neutral"
          @click="router.back()"
        />
        <UButton
          type="submit"
          label="Publish Now"
          icon="i-lucide-send"
          :loading="loading"
        />
      </div>
    </UForm>
  </UCard>
</template>
