<script setup lang="ts">
import { useTestimonialForm } from "~/composables/form/useTestimonialForm";
import type { Testimonial } from "~~/src/db/schema/testimonials";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

// Definisikan interface response API kamu
interface TestimonialResponse {
  success: boolean;
  data: Testimonial[];
}

definePageMeta({
  title: "Testimonial",
});

type Schema = z.output<typeof schema>;

const { state, schema, resetForm } = useTestimonialForm();
const toast = useToast();
const isOpen = ref(false);
const isEditing = ref(false);
const selectedId = ref<number | null>(null);
const existingAvatarUrl = ref("");

// Mengambil data dari API (asumsi endpoint sudah ada)
const { data, refresh } =
  await useFetch<TestimonialResponse>("/api/testimonial");

console.log({ data });

const testimonials = computed(() => data?.value?.data);

const columns = [
  { accessorKey: "id", header: "id" },
  { accessorKey: "authorName", header: "Author" },
  { accessorKey: "authorRole", header: "Role" },
  {
    accessorKey: "content",
    header: "Testimonial",
    class: "max-w-[300px] truncate",
  },
  { accessorKey: "actions", header: "Actions" },
];

const openCreate = () => {
  isEditing.value = false;
  resetForm();
  isOpen.value = true;
};

const openEdit = (row: any) => {
  isEditing.value = true;
  isOpen.value = true;
  console.log({ row });
  selectedId.value = row.id;
  state.authorName = row.authorName;
  state.authorRole = row.authorRole;
  state.authorCompany = row.authorCompany;
  state.content = row.content;
  existingAvatarUrl.value = row.avatarUrl;
};
const { addNewTestimonial, updateTestimonial } = useTestimonial();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    let body = {
      ...event.data,
      avatarUrl:
        existingAvatarUrl.value == ""
          ? state.avatarUrl
          : existingAvatarUrl.value,
    };
    console.log(existingAvatarUrl.value, "existing");
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Jika upload file, gunakan FormData. Jika text saja, JSON biasa.
    if (isEditing.value) {
      await updateTestimonial(Number(selectedId.value), formData);
    } else {
      await addNewTestimonial(formData);
    }

    toast.add({ title: "Berhasil!", color: "success" });
    isOpen.value = false;
    refresh();
  } catch (e) {
    toast.add({ title: "Gagal menyimpan", color: "error" });
  }
};

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
const { deleteTestimonial } = useTestimonial();

const handleDelete = async (id: number) => {
  // Gunakan confirm yang lebih manis atau biarkan default browser
  try {
    // Memanggil API delete melalui helper useProject
    const response = await deleteTestimonial(id);

    if (response) {
      toast.add({
        title: "Deleted",
        description: "Testimonial berhasil dihapus dari database.",
        color: "success",
      });
      // Refresh data tabel agar baris yang dihapus hilang
      refresh();
    }
  } catch (error: any) {
    console.error("Delete Error:", error);
    toast.add({
      title: "Error",
      description: error.statusMessage || "Gagal menghapus testimonial.",
      color: "error",
    });
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Testimonials
        </h1>
        <p class="text-sm text-gray-500">
          Kelola apa yang client katakan tentang Anda.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Add Testimonial"
        @click="openCreate"
      />
    </div>

    <UCard>
      <UTable :data="testimonials || []" :columns="columns">
        <template #authorName-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="(row.original.avatarUrl as string) || ''"
              alt="Avatar"
              size="xl"
              class="ring-2 ring-primary-500 bg-gray-100 dark:bg-gray-800 shadow-sm"
            />
            <div class="flex flex-col">
              <span class="font-medium">{{ row.original.authorName }}</span>
              <span class="text-xs text-gray-400">{{
                row.original.authorCompany
              }}</span>
            </div>
          </div>
        </template>
        <template #content-cell="{ row }">
          <div class="max-w-[250px] lg:max-w-[400px]">
            <span
              class="block truncate text-sm text-gray-600 dark:text-gray-300"
              :title="row.original.content"
            >
              {{ row.original.content }}
            </span>
          </div>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              @click="openEdit(row.original)"
            />
            <UButton
              icon="i-lucide-trash"
              variant="ghost"
              color="error"
              @click="handleDelete(row.original.id)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model:open="isOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                {{ isEditing ? "Edit Testimonial" : "Create New Testimonial" }}
              </h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                @click="isOpen = false"
              />
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
                label="Author Name"
                name="authorName"
                class="col-span-2"
              >
                <UInput
                  v-model="state.authorName"
                  placeholder="e.g. John Doe"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Role" name="authorRole">
                <UInput
                  v-model="state.authorRole"
                  placeholder="e.g. CEO"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Company" name="authorCompany">
                <UInput
                  v-model="state.authorCompany"
                  placeholder="e.g. Acme Corp"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="Testimonial Content" name="content">
              <UTextarea
                v-model="state.content"
                :rows="4"
                placeholder="Write their kind words here..."
                class="w-full"
              />
            </UFormField>

            <UFormField label="Logo URL" name="logoUrl">
              <div class="flex items-center gap-6 p-2">
                <UAvatar
                  :src="avatarPreview ?? 'av'"
                  alt="Avatar Preview"
                  size="xl"
                  class="ring-2 ring-primary-500 bg-gray-100 dark:bg-gray-800 shadow-sm"
                />

                <div class="flex-1">
                  <UFileUpload
                    accept="image/*"
                    label="Upload avatar"
                    v-model="state.avatarUrl"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG. Max 2MB.
                  </p>
                </div>
              </div>
            </UFormField>
            <div class="flex justify-end gap-3 mt-6">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="isOpen = false"
              />
              <UButton type="submit" label="Save Testimonial" />
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
