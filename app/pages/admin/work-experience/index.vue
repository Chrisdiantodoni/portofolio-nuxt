<script setup lang="ts">
definePageMeta({
  title: "Work Experience",
});

import type { WorkExperience } from "~~/src/db/schema/work";

// Definisikan interface response API kamu
interface ExperienceResponse {
  success: boolean;
  data: WorkExperience[];
}

const searchValue = ref("");
const { data: experiences, refresh } = await useFetch<ExperienceResponse>(
  "/api/work-experience/list",
);
const toast = useToast();

const { deleteWorkExperience } = useWorkExperience();

const getActionItems = (item: any) => [
  [
    {
      label: "Edit",
      icon: "i-lucide-pencil",
      to: `/admin/work-experience/${item.id}`,
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-lucide-trash",
      class: "text-red-500",
      async onSelect() {
        // Tambahkan konfirmasi biar tidak asal hapus
        try {
          const res = await deleteWorkExperience(item.id);

          if (res?.success) {
            toast.add({
              title: "Berhasil",
              description: "Item telah dihapus",
              color: "success", // Pakai success/green untuk info berhasil
            });
            // Pastikan refresh() dipanggil untuk sinkronisasi data
            await refresh();
          } else {
            throw new Error("Gagal");
          }
        } catch (err) {
          toast.add({
            title: "Error",
            description: "Item gagal dihapus",
            color: "error",
          });
        }
      },
    },
  ],
];
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex justify-between items-center my-5">
      <div>
        <h1 class="text-2xl font-bold">Work Experience</h1>
        <p class="text-sm text-gray-500">
          Manage your professional career history
        </p>
      </div>
      <UButton
        :to="{ name: 'admin-work-experience-create' }"
        label="Create"
        icon="i-lucide-plus"
      />
    </div>
    <div class="py-2 border-b border-default space-y-4 bg-background">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <UInput
          v-model="searchValue"
          class="w-full max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter "
        />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-1 mt-4 custom-scrollbar">
      <div class="grid gap-4 mt-4 mx-1">
        <UCard
          v-for="exp in experiences?.data"
          :key="exp.id"
          class="overflow-hidden"
        >
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <UAvatar
                :src="exp.logoUrl || ''"
                :icon="exp.icon || 'i-lucide-briefcase'"
                size="lg"
                class="bg-primary-50 dark:bg-primary-900/20 text-primary-600"
              />

              <div class="space-y-1">
                <h3 class="font-bold text-lg leading-none">{{ exp.role }}</h3>
                <p class="text-gray-500 font-medium text-sm">
                  {{ exp.company }}
                </p>
                <p class="text-xs text-gray-500 flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" /> {{ exp.period }}
                </p>

                <p
                  class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 max-w-2xl"
                >
                  {{ exp.description }}
                </p>
              </div>
            </div>

            <UDropdownMenu :items="getActionItems(exp)">
              <UButton
                color="info"
                variant="ghost"
                icon="i-lucide-more-vertical"
              />
            </UDropdownMenu>
          </div>
        </UCard>
        <div
          v-if="!experiences?.data?.length"
          class="text-center py-20 border-2 border-dashed rounded-xl"
        >
          <UIcon
            name="i-lucide-briefcase"
            class="w-12 h-12 mx-auto text-gray-300"
          />
          <p class="text-gray-500 mt-2">Belum ada pengalaman kerja.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Opsional: Biar scrollbar-nya tipis dan rapi di Mac/Windows */
</style>
