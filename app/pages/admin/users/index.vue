<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { upperFirst } from "scule";
import { getPaginationRowModel } from "@tanstack/table-core";
import type { Row } from "@tanstack/table-core";
import type { User } from "~/types";
import { watchDebounced } from "@vueuse/core";

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UCheckbox = resolveComponent("UCheckbox");

const toast = useToast();
const table = useTemplateRef("table");

definePageMeta({
  title: "Users",
});

const page = ref(1);
const limit = ref(10);
const search = ref("");
const searchValue = ref("");

// Fetching data dari server (Gunakan API get list yang kita buat tadi)
const {
  data: apiResponse,
  status,
  refresh,
} = await useFetch("/api/user/list", {
  query: {
    page: page,
    limit: limit,
    search: search,
  },
  watch: [page, search], // Otomatis fetch ulang jika page/search berubah
});
const users = computed(() => apiResponse.value?.data || []);
const totalUsers = computed(() => apiResponse.value?.meta?.total || 0);

const columnFilters = ref([
  {
    id: "email",
    value: "",
  },
]);
const columnVisibility = ref();
const rowSelection = ref({ 1: true });

const isAddModalOpen = ref(false);
const selectedUser = ref<any | null>(null);

function getRowItems(row: Row<User>) {
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
        selectedUser.value = row.original;

        // 2. Buka modal dari sini
        isAddModalOpen.value = true;
      },
    },

    {
      type: "separator",
    },
    {
      label: "Delete user",
      icon: "i-lucide-trash",
      color: "error",
      onSelect() {
        toast.add({
          title: "User deleted",
          description: "The user has been deleted.",
        });
      },
    },
  ];
}

const columns: TableColumn<User>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          src: row.original.avatarUrl, // Jika ada
          alt: row.original.name,
          text: row.original.name.substring(0, 2).toUpperCase(), // Fallback inisial
          size: "lg",
        }),
        h("div", undefined, [
          h("p", { class: "font-medium text-highlighted" }, row.original.name),
          h("p", { class: "" }, `@${row.original.username}`),
        ]),
      ]);
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Email",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },

  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   filterFn: "equals",
  //   cell: ({ row }) => {
  //     const color = {
  //       subscribed: "success" as const,
  //       unsubscribed: "error" as const,
  //       bounced: "warning" as const,
  //     }[row.original.status];

  //     return h(
  //       UBadge,
  //       { class: "capitalize", variant: "subtle", color },
  //       () => row.original.status,
  //     );
  //   },
  // },
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
// const searchValue = computed({
//   get: () => search.value,
//   set: (value: string) => {
//     search.value = value;
//     page.value = 1; // Reset ke hal 1 saat mencari
//   },
// });
watchDebounced(
  searchValue,
  (newValue) => {
    search.value = newValue;
    page.value = 1; // Reset ke halaman 1 setiap kali mencari
  },
  { debounce: 500, maxWait: 1000 }, // Tunggu 500ms
);

watch(isAddModalOpen, (value) => {
  if (!value) {
    selectedUser.value = null;
  }
});
const statusFilter = ref("all");
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex justify-end my-5">
      <UsersAddModal
        @success="refresh"
        v-model:open="isAddModalOpen"
        :user-data="selectedUser"
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

        <div class="flex flex-wrap items-center gap-2">
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
          </UDropdownMenu>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
        :data="users"
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
      <div class="text-sm text-muted">
        <span class="font-medium text-highlighted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }}
        </span>
        of
        <span class="font-medium">
          {{ apiResponse?.meta?.total || 0 }}
        </span>
        row(s) selected.
      </div>

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
        :total="totalUsers"
        @update:page="(p: number) => (page = p)"
      />
    </div>
  </div>
</template>
