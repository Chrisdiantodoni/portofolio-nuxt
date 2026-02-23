<script setup lang="ts">
import { useSeoForm } from "~/composables/form/useSeoForm";

definePageMeta({
  title: "SEO",
});

const { resetForm, setFormData, schema, state } = useSeoForm();
const { addNewSeo, updateSeo } = useSeo();

const toast = useToast();
const loading = ref(false);
const existingOgImage = ref("");

const ogImagePreview = computed(() => {
  const image = state.seo.image;

  // 1. Jika ada file baru yang dipilih di UFileUpload
  // UFileUpload biasanya mengembalikan Array [File]
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }

  // 2. Jika tidak ada file baru, tampilkan URL lama dari database
  return existingOgImage.value || null;
});

async function onSubmit() {
  loading.value = true;

  const formData = new FormData();

  // General Information
  formData.append("title", state.title);
  formData.append("slug", state.slug);
  formData.append("content", state.content);

  // SEO
  formData.append("seo[title]", state.seo.title);
  formData.append("seo[description]", state.seo.description);

  // OG Image — kirim sebagai File kalau ada upload baru
  if (state.seo.image instanceof File) {
    formData.append("seo[image]", state.seo.image);
  } else if (typeof state.seo.image === "string" && state.seo.image) {
    // Kalau string (URL lama dari DB), kirim as-is
    formData.append("seo[image]", state.seo.image);
  }
  try {
    await addNewSeo(formData);
    toast.add({
      title: "Success",
      description: "SEO berhasil diterbitkan!",
      color: "success",
    });
    navigateTo("/admin/seo");
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.statusMessage || "Gagal menyimpan seo",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UContainer class="py-5">
    <UForm :state="state" @submit="onSubmit" class="space-y-6" :schema="schema">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Add Page Content</h1>
        <UButton type="submit" color="neutral" icon="i-lucide-save">
          Save Changes
        </UButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Kiri: General Information -->
        <div class="col-span-1 lg:col-span-3 space-y-6">
          <UCard>
            <template #header>
              <h3 class="font-semibold">General Information</h3>
            </template>

            <div class="space-y-4">
              <UFormField label="Page Title" name="title" required>
                <UInput
                  v-model="state.title"
                  placeholder="e.g. About Our Company"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Slug"
                name="slug"
                hint="URL unik untuk halaman ini"
                required
              >
                <UInput
                  v-model="state.slug"
                  icon="i-lucide-link"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Content" name="content">
                <UTextarea
                  v-model="state.content"
                  :rows="10"
                  placeholder="Write your page body here..."
                  class="w-full"
                />
              </UFormField>
            </div>
          </UCard>
        </div>

        <!-- Kanan: SEO -->
        <div class="col-span-1 lg:col-span-2 space-y-6">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-search-check"
                  class="w-5 h-5 text-primary"
                />
                <h3 class="font-semibold">Search Engine (SEO)</h3>
              </div>
            </template>

            <div class="space-y-4">
              <UFormField label="Meta Title" hint="Judul yang muncul di Google">
                <UInput
                  v-model="state.seo.title"
                  placeholder="SEO Title..."
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Meta Description">
                <UTextarea
                  v-model="state.seo.description"
                  :rows="4"
                  placeholder="Brief summary for search results..."
                  class="w-full"
                />
              </UFormField>

              <!-- OG Image Upload -->
              <UFormField label="OG Image">
                <div class="space-y-2 w-full">
                  <UFileUpload
                    accept="image/*"
                    :multiple="false"
                    v-model="state.seo.image"
                  >
                  </UFileUpload>

                  <!-- Tombol hapus gambar -->
                </div>
              </UFormField>

              <!-- Google Preview -->
              <div
                class="mt-2 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden"
              >
                <p
                  class="text-[11px] text-gray-400 font-bold mb-2 uppercase tracking-wider"
                >
                  Preview
                </p>
                <!-- OG Image thumbnail di preview -->
                <div
                  v-if="ogImagePreview"
                  class="w-full h-24 rounded mb-2 overflow-hidden"
                >
                  <img
                    :src="ogImagePreview"
                    alt="OG Preview"
                    class="w-full h-full object-cover"
                  />
                </div>
                <p
                  class="text-blue-600 text-base truncate leading-tight font-medium"
                >
                  {{ state.seo.title || state.title || "Untitled Page" }}
                </p>
                <p
                  class="text-green-700 dark:text-green-500 text-sm truncate my-0.5"
                >
                  https://yoursite.com/{{ state.slug || "slug" }}
                </p>
                <p class="text-gray-500 text-xs line-clamp-2 leading-snug">
                  {{
                    state.seo.description ||
                    "Provide a description to see how this page will appear in search results."
                  }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UForm>
  </UContainer>
</template>
