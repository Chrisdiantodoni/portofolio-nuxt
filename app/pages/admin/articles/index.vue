<script setup lang="ts">
import { useArticleForm } from "~/composables/form/useArticleForm";

definePageMeta({
  title: "Articles",
});

// Ambil data dari API
const { data: articles, refresh } = await useFetch("/api/articles");

const columns = [
  { accessorKey: "imageUrl", header: "Cover" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "publishedAt", header: "Published Date" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "actions", header: "" },
];

const { deleteArticle, updateArticleStatus } = useArticle();
const toast = useToast();
const handleDelete = async (id: number) => {
  // Gunakan confirm yang lebih manis atau biarkan default browser
  try {
    // Memanggil API delete melalui helper useProject
    const response = await deleteArticle(id);

    if (response) {
      toast.add({
        title: "Deleted",
        description: "Article berhasil dihapus dari database.",
        color: "success",
      });
      // Refresh data tabel agar baris yang dihapus hilang
      refresh();
    }
  } catch (error: any) {
    console.error("Delete Error:", error);
    toast.add({
      title: "Error",
      description: error.statusMessage || "Gagal menghapus article.",
      color: "error",
    });
  }
};

const updateStatus = async (id: number) => {
  // Gunakan confirm yang lebih manis atau biarkan default browser
  try {
    // Memanggil API delete melalui helper useProject
    const response = await updateArticleStatus(id);

    if (response) {
      toast.add({
        title: "Deleted",
        description: "Status Article berhasil diupdate",
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
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Articles Management</h1>
      <UButton
        icon="i-lucide-plus"
        label="Write Article"
        :to="{ name: 'admin-articles-create' }"
      />
    </div>

    <UCard>
      <div class="max-h-[600px] overflow-y-auto relative rounded-lg">
        <UTable :data="articles?.data || []" :columns="columns">
          <template #imageUrl-cell="{ row }">
            <img
              :src="
                row.original.imageUrl ||
                'https://placehold.co/200x120?text=No+Cover'
              "
              class="w-24 h-14 object-cover rounded border"
            />
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
            <div class="flex justify-end gap-2">
              <UButton
                icon="i-lucide-pencil"
                variant="ghost"
                color="neutral"
                :to="{ path: `/admin/articles/${row.original.id}` }"
              />
              <UButton
                color="info"
                variant="ghost"
                icon="i-lucide-eye"
                @click="updateStatus(row.original.id)"
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
      </div>
    </UCard>
  </div>
</template>
