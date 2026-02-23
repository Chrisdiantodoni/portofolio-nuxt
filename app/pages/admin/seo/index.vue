<script setup lang="ts">
import { ref, computed } from "vue";
import type { Seo } from "~~/src/db/schema/pages";

definePageMeta({
  title: "SEO",
});

interface SeoResponse {
  success: boolean;
  data: Seo[];
}

const { deleteSeo } = useSeo();

// Mengambil data dari API (asumsi endpoint sudah ada)
const { data, refresh } = await useFetch<SeoResponse>("/api/seo");

// Simulasi data - nanti diganti dengan fetch dari API/Drizzle
const pages = computed(() => data?.value?.data || []);
// Search
const search = ref("");

// Pagination
const page = ref(1);
const pageSize = 5;

const filtered = computed(() => {
  return pages.value.filter((p) => {
    const searchArea = [
      p.title,
      p.slug,
      p.seo?.title, // Gunakan ?. karena ini jsonb
      p.seo?.description, // Tambahan agar search lebih powerful
    ]
      .filter(Boolean) // Buang nilai null/undefined agar tidak error saat join
      .join(" ")
      .toLowerCase();

    return searchArea.includes(search.value.toLowerCase());
  });
});

const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize));

// Reset ke page 1 saat search berubah
watch(search, () => (page.value = 1));

// Delete
const deleteTarget = ref<number | null>(null);
const showDeleteModal = ref(false);

function confirmDelete(id: number) {
  deleteTarget.value = id;
  showDeleteModal.value = true;
}

async function doDelete() {
  showDeleteModal.value = false;
  await deleteSeo(deleteTarget.value as any);
  refresh();
  deleteTarget.value = null;
}

// Columns untuk UTable
const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "slug", header: "Slug" },
  { accessorKey: "seoTitle", header: "SEO Title" },
  { accessorKey: "actions", header: "Action" },
];

const tableRows = computed(() =>
  paginated.value.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    seoTitle: p.seo.title,
  })),
);
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Pages</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manage all your site pages</p>
      </div>
      <UButton to="/admin/seo/create" color="neutral" icon="i-lucide-plus">
        Add New Page
      </UButton>
    </div>

    <!-- Table Card -->
    <UCard>
      <!-- Search -->
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search pages..."
            class="w-full max-w-sm"
          />
          <p class="text-sm text-gray-400 shrink-0">
            {{ filtered.length }} page{{ filtered.length !== 1 ? "s" : "" }}
            found
          </p>
        </div>
      </template>

      <!-- Table -->
      <UTable :data="tableRows" :columns="columns">
        <!-- Slug -->
        <template #slug-data="{ row }">
          <span class="font-mono text-xs text-gray-400"
            >/{{ row.original.slug }}</span
          >
        </template>

        <!-- SEO Title -->
        <template #seoTitle-data="{ row }">
          <span class="text-sm text-gray-500">
            {{ row.original.seoTitle || "-" }}
          </span>
        </template>

        <!-- Actions -->
        <template #actions-cell="{ row }">
          <div class="flex items-center justify-start gap-2">
            <UButton
              :to="`/admin/seo/${row.original.id}/edit`"
              variant="ghost"
              color="neutral"
              size="xs"
              icon="i-lucide-pencil"
            >
              Edit
            </UButton>
            <UButton
              variant="ghost"
              color="error"
              size="xs"
              icon="i-lucide-trash-2"
              @click="confirmDelete(row.original.id)"
            >
              Delete
            </UButton>
          </div>
        </template>

        <!-- Empty State -->
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-12 gap-3">
            <UIcon name="i-lucide-file-x" class="w-10 h-10 text-gray-300" />
            <p class="text-gray-400 text-sm">No pages found</p>
            <UButton
              v-if="search"
              variant="soft"
              color="neutral"
              size="xs"
              @click="search = ''"
            >
              Clear search
            </UButton>
          </div>
        </template>
      </UTable>

      <!-- Pagination -->
      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-400">
            Showing
            {{ Math.min((page - 1) * pageSize + 1, filtered.length) }}–{{
              Math.min(page * pageSize, filtered.length)
            }}
            of {{ filtered.length }}
          </p>
          <UPagination
            v-model="page"
            :total="filtered.length"
            :page-count="pageSize"
          />
        </div>
      </template>
    </UCard>
  </div>
  <UModal v-model:open="showDeleteModal" title="Delete Page">
    <template #body>
      <p class="text-sm text-gray-500">
        Are you sure you want to delete this page? This action <br />
        <span class="font-semibold text-gray-700 dark:text-gray-300"
          >cannot be undone</span
        >.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          @click="showDeleteModal = false"
        >
          Cancel
        </UButton>
        <UButton color="error" icon="i-lucide-trash-2" @click="doDelete">
          Delete
        </UButton>
      </div>
    </template>
  </UModal>
  <!-- Delete Confirmation Modal -->
</template>
