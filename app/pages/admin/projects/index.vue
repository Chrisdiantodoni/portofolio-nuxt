<script setup lang="ts">
definePageMeta({
  title: "Projects Management",
});
import * as z from "zod";
import { useProjectForm } from "~/composables/form/useProjectForm";

import type { FormSubmitEvent } from "@nuxt/ui";
import type { ProjectWithTechnologies } from "~~/src/db/schema/projects";

const { resetForm, schema, setFormData, state } = useProjectForm();
type Schema = z.output<typeof schema>;

const toast = useToast();
// 1. Mock Data (Data Dummy)
const items = ref(["web", "mobile", "desktop", "game"]);
// 2. UI State
const isFormOpen = ref(false);
const selectedProject = ref<ProjectWithTechnologies | null>(null);
const searchValue = ref("");

const { data, refresh } = useFetch("/api/project");

const projects = computed(() => data?.value?.data || []);

// 3. Table Configuration
const columns = [
  { accessorKey: "imageUrl", header: "Preview" },
  { accessorKey: "title", header: "Project Name" },
  { accessorKey: "year", header: "Year" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "technologies", header: "Stack" },
  { accessorKey: "actions", header: "" },
];

// 4. Actions
const openCreate = () => {
  selectedProject.value = null;
  isFormOpen.value = true;
};

const openEdit = (project: any) => {
  selectedProject.value = project; // Clone agar tidak langsung ngerubah list
  isFormOpen.value = true;
};

const { addNewProject, updateProject, updateProjectStatus, deleteProjects } =
  useProject();

const deleteProject = async (id: string) => {
  // Gunakan confirm yang lebih manis atau biarkan default browser
  try {
    // Memanggil API delete melalui helper useProject
    const response = await deleteProjects(id);

    if (response) {
      toast.add({
        title: "Deleted",
        description: "Proyek berhasil dihapus dari database.",
        color: "success",
      });
      // Refresh data tabel agar baris yang dihapus hilang
      refresh();
    }
  } catch (error: any) {
    console.error("Delete Error:", error);
    toast.add({
      title: "Error",
      description: error.statusMessage || "Gagal menghapus proyek.",
      color: "error",
    });
  }
};

const updateStatus = async (id: string) => {
  // Gunakan confirm yang lebih manis atau biarkan default browser
  try {
    // Memanggil API delete melalui helper useProject
    const response = await updateProjectStatus(id);

    if (response) {
      toast.add({
        title: "Deleted",
        description: "Status Project berhasil diupdate",
        color: "success",
      });
      // Refresh data tabel agar baris yang dihapus hilang
      refresh();
    }
  } catch (error: any) {
    console.error("Delete Error:", error);
    toast.add({
      title: "Error",
      description: error.statusMessage || "Gagal update proyek.",
      color: "error",
    });
  }
};

const { data: technologiesData, status } = await useFetch(
  "/api/technologies/list",
  {
    lazy: true,
  },
);

// Transform data menjadi format yang sesuai untuk USelectMenu
const technologies = computed(() => {
  if (!technologiesData.value) return [];

  // Jika API mengembalikan array of strings: ['vue', 'react', 'nuxt']
  // Transform menjadi array of objects dengan label dan value
  return technologiesData.value?.data?.map((item) => ({
    label: item?.name,
    value: item?.id,
    icon: item?.icon,
  }));
});

console.log(projects);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = {
    ...event.data,
    // Pastikan ambil ID-nya saja
    technologies: state.technologies?.map((item: any) =>
      typeof item === "object" ? item.value : item,
    ),
  };

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === "technologies") {
        // KUNCI: Ubah array jadi string JSON yang valid "[2,3,4]"
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    }
  });

  // Tambahkan file image jika ada
  if (state.imageUrl instanceof File) {
    formData.append("imageUrl", state.imageUrl);
  }

  try {
    let response;
    if (selectedProject?.value?.id) {
      response = await updateProject(selectedProject?.value?.id, formData);
      toast.add({
        title: "Success",
        description: "Project updated successfully",
        color: "success",
      });
    } else {
      response = await addNewProject(formData);
      toast.add({
        title: "Success",
        description: "Project added successfully",
        color: "success",
      });
    }
    if (response?.success) {
      refresh();
      resetForm();
      isFormOpen.value = false;
    }
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: selectedProject?.value?.id
        ? "Failed to update"
        : "Failed to create",
      color: "error",
    });
  }
}
const existingImageUrl = ref("");

watch(isFormOpen, () => {
  if (isFormOpen) {
    console.log({ selectedProject });
    existingImageUrl.value = selectedProject?.value?.imageUrl ?? "";

    setFormData({
      title: selectedProject?.value?.title,
      description: selectedProject?.value?.description,
      year: selectedProject?.value?.year as any,
      githubLink: selectedProject?.value?.githubLink ?? "",
      projectLink: selectedProject?.value?.projectLink ?? "",
      type: selectedProject?.value?.type ?? "web",
      technologies: selectedProject?.value?.technologies?.map((item) => ({
        label: item?.technology?.name,
        value: item?.technologyId,
        icon: item?.technology?.icon,
      })),
    });
  }
});

const imagePreview = computed(() => {
  const imagePreview = state.imageUrl;

  // 1. Jika ada file baru yang dipilih di UFileUpload
  // UFileUpload biasanya mengembalikan Array [File]
  if (imagePreview instanceof File) {
    return URL.createObjectURL(imagePreview);
  }

  // 2. Jika tidak ada file baru, tampilkan URL lama dari database
  return existingImageUrl.value || null;
});
</script>

<template>
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-2xl font-bold">Projects Management</h1>
      <p class="text-sm text-gray-500">
        Kelola daftar portofolio showcase kamu.
      </p>
    </div>
    <UButton icon="i-lucide-plus" label="Add New Project" @click="openCreate" />
  </div>

  <UCard>
    <div class="mb-4">
      <UInput
        v-model="searchValue"
        icon="i-lucide-search"
        placeholder="Cari nama proyek..."
        class="max-w-xs"
      />
    </div>
    <div class="max-h-[500px] overflow-y-auto overflow-x-auto relative">
      <UTable :data="projects" :columns="columns">
        <template #imageUrl-cell="{ row }">
          <div
            class="w-32 h-20 rounded border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <img
              v-if="row.original.imageUrl"
              :src="row.original.imageUrl"
              class="w-full h-full object-cover"
              @error="
                (e) =>
                  ((e.target as HTMLImageElement).src =
                    'https://placehold.co/600x400?text=No+Image')
              "
            />

            <UIcon v-else name="i-lucide-image" class="size-8 text-gray-400" />
          </div>
        </template>

        <template #technologies-cell="{ row }">
          <div class="flex flex-wrap gap-1">
            <UBadge
              v-for="tech in row.original.technologies"
              :key="tech.id"
              variant="subtle"
              size="md"
              color="primary"
            >
              {{ tech.technology.name }}
            </UBadge>
          </div>
        </template>

        <template #status-cell="{ row }">
          <div class="flex flex-wrap gap-1">
            <UBadge
              variant="subtle"
              size="md"
              :color="row.original.isActive ? 'success' : 'neutral'"
            >
              {{ row.original.isActive ? "Active" : "Inactive" }}
            </UBadge>
          </div>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-1">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openEdit(row.original)"
            />
            <UButton
              icon="i-lucide-eye"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="updateStatus(row.original.id)"
            />
            <UButton
              icon="i-lucide-trash"
              variant="ghost"
              color="error"
              size="xs"
              @click="deleteProject(row.original.id)"
            />
          </div>
        </template>
      </UTable>
    </div>
  </UCard>

  <USlideover
    side="right"
    v-model:open="isFormOpen"
    :title="selectedProject ? 'Edit Project' : 'New Project'"
  >
    <template #header>
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold">
          {{ selectedProject ? " Update Projects" : "Add Projects" }}
        </h1>
        <p class="text-sm text-gray-500">
          Kelola daftar portofolio showcase kamu.
        </p>
      </div>
    </template>
    <template #body>
      <div class="p-4 overflow-y-auto h-full flex flex-col gap-4">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
          @error="(err) => console.log('Validation Errors:', err)"
        >
          <UFormField label="Project Title" name="title">
            <UInput
              v-model="state.title"
              placeholder="Contoh: My Cool App"
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Year" name="year">
              <UInput
                v-maska="'####'"
                placeholder="2025"
                v-model="state.year"
                maxlength="4"
                @keypress="onlyNumber"
              />
            </UFormField>
            <UFormField label="Type" name="type">
              <USelect :items="items" v-model="state.type" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Description">
            <UTextarea
              v-model="state.description"
              :rows="4"
              placeholder="Jelaskan detail proyek..."
              class="w-full"
            />
          </UFormField>

          <UFormField label="Image" name="imageUrl">
            <div class="flex flex-col gap-3">
              <UFileUpload
                v-model="state.imageUrl"
                accept="image/*"
                label="Upload Project Image"
                class="w-full"
              />
              <div
                v-if="imagePreview"
                class="relative w-full h-40 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <img
                  :src="imagePreview"
                  class="w-full h-full object-cover"
                  alt="Project Preview"
                />
              </div>
            </div>
          </UFormField>
          <UFormField label="Technology" name="technologies">
            <USelectMenu
              v-model="state.technologies"
              :items="technologies || []"
              :loading="status === 'pending'"
              placeholder="Pilih Stack Teknologi"
              class="w-full"
              multiple
              searchable
            >
              <template #leading>
                <UIcon name="i-lucide-search" class="size-5 text-gray-400" />
              </template>

              <template #item="{ item }">
                <UIcon :name="item.icon" class="size-5" />
                <span class="truncate">{{ item.label }}</span>
              </template>
            </USelectMenu>
          </UFormField>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Github">
              <UInput icon="i-lucide-github" placeholder="https://..." />
            </UFormField>
            <UFormField label="Project Link">
              <UInput icon="i-lucide-external-link" placeholder="https://..." />
            </UFormField>
          </div>

          <div class="mt-auto pt-6 flex gap-3">
            <UButton label="Save Changes" block class="flex-1" type="submit" />
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="isFormOpen = false"
            />
          </div>
        </UForm>
      </div>
    </template>
  </USlideover>
</template>
