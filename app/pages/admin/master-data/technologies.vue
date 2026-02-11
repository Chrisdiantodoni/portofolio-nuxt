<script setup lang="ts">
definePageMeta({
  title: "Technologies",
});
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/table-core";

const selectedTechnologies = ref<Technologies | null>(null);
const isOpenAddModal = ref(false);
const isOpenDeleteModal = ref(false);
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");
const toast = useToast();

const page = ref(1);
const limit = ref(10);
const search = ref("");
const searchValue = ref("");

function getRowItems(row: Row<Technologies>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      type: "separator",
    },
    {
      label: "View user details",
      icon: "i-lucide-list",
      onSelect() {
        selectedTechnologies.value = row.original;

        // 2. Buka modal dari sini
        isOpenAddModal.value = true;
      },
    },

    {
      type: "separator",
    },
    {
      label: "Delete Tech",
      icon: "i-lucide-trash",
      color: "error",
      onSelect() {
        selectedTechnologies.value = row.original;
        isOpenDeleteModal.value = true;
      },
    },
  ];
}

// Fetching data dari server (Gunakan API get list yang kita buat tadi)
const {
  data: apiResponse,
  status,
  refresh,
} = await useFetch("/api/technologies/list", {
  query: {
    page: page,
    limit: limit,
    search: search,
  },
  watch: [page, search], // Otomatis fetch ulang jika page/search berubah
});

const technologies = computed(() => apiResponse.value?.data || []);
const totalTechs = computed(() => apiResponse.value?.meta?.total || 0);

const columns: TableColumn<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const iconName = row.getValue("icon") as string;

      return h("div", { class: "flex items-center justify-center" }, [
        h(
          "div",
          {
            class:
              "p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center w-10 h-10",
          },
          [
            h(resolveComponent("UIcon"), {
              name: iconName || "i-lucide-help-circle",
              class:
                "size-6 text-primary-500 hover:scale-110 transition-transform duration-200",
            }),
          ],
        ),
      ]);
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
            }),
        ),
      );
    },
  },
];
</script>

<template>
  <TechnologiesDeleteModal
    @success="refresh"
    v-model:open="isOpenDeleteModal"
    :selected-technologies="selectedTechnologies"
  />
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex justify-end my-5">
      <TechnologiesAddModal
        :technology-data="selectedTechnologies"
        @success="refresh"
        v-model:open="isOpenAddModal"
      />
    </div>
    <div class="py-2 border-b border-default space-y-4 bg-background">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <UInput
          v-model="searchValue"
          class="w-full max-w-sm"
          icon="i-lucide-search"
          placeholder="Filter emails..."
        />

        <!-- <div class="flex flex-wrap items-center gap-2">
          <CustomersDeleteModal
            :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
          >
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              label="Delete"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd size="sm">
                  {{
                    table?.tableApi?.getFilteredSelectedRowModel().rows.length
                  }}
                </UKbd>
              </template>
            </UButton>
          </CustomersDeleteModal>

          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'All Status', value: 'all' },
              { label: 'Subscribed', value: 'subscribed' },
              { label: 'Unsubscribed', value: 'unsubscribed' },
              { label: 'Bounced', value: 'bounced' },
            ]"
            class="w-40"
          />

          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi
                      ?.getColumn(column.id)
                      ?.toggleVisibility(!!checked);
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault();
                  },
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Columns"
              color="neutral"
              variant="outline"
              icon="i-lucide-settings-2"
            />
          </UDropdownMenu> -->
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <UTable
        ref="table"
        :data="technologies"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'min-w-full table-fixed',
          thead: 'sticky top-0 z-10 bg-background shadow-sm',
          th: 'py-3.5 px-4 text-left text-sm font-semibold border-b border-default',
          td: 'py-4 px-4 text-sm border-b border-default align-middle',
        }"
      />
    </div>
    <div
      class="flex items-center justify-between gap-3 border-t border-default p-4 bg-background"
    >
      <!-- <UPagination
        :default-page="
          (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
        "
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      /> -->

      <UPagination
        v-model="page"
        :items-per-page="limit"
        :total="totalTechs"
        @update:page="(p: number) => (page = p)"
      />
    </div>
  </div>
</template>
<!--
     v-model:column-visibility="columnVisibility"
        v-model:pagination="pagination" -->
