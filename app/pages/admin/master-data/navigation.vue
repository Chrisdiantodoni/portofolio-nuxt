<script setup lang="ts">
definePageMeta({
  title: "Navigation",
});

import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import draggable from "vuedraggable";
// 1. Schema Validasi Zod
const schema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label wajib diisi"),
  link: z
    .string()
    .min(1, "Link wajib diisi")
    .startsWith("/", "Harus dimulai dengan /"),
});

type Schema = z.output<typeof schema>;

// 2. State untuk Form (Sisi Kiri)
const state = reactive({
  label: "",
  id: "",
  link: "",
});

const resetForm = () => {
  ((state.label = ""), (state.link = ""), (state.id = ""));
};

const loading = ref(false);

const navigations = ref<any[]>([]);
const { data, status, refresh } = useFetch<navigation[]>("/api/navigation", {
  transform: (res: any) => res.data || [],
});

watch(
  data,
  (newVal) => {
    if (newVal) navigations.value = [...newVal];
  },
  { immediate: true },
);
const {
  addNewNavigation,
  updateNavigation,
  reorderNavigation,
  deleteNavigation,
  updateNavigationStatus,
} = useNavigation();

// 6. Submit Handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    let response;
    if (state.id == "") {
      response = await addNewNavigation(event.data);
    } else {
      response = await updateNavigation(event?.data.id ?? "", event.data);
    }
    if (response?.success) {
      toast.add({
        title: "Success",
        description: "Navigation updated successfully",
        color: "success",
      });
      refresh();
      resetForm();
    } else {
      toast.add({
        title: "Error",
        description: response?.statusMessage,
        color: "error",
      });
    }

    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    toast.add({
      title: "Error",
      description: error?.statusMessage,
      color: "error",
    });
  }
}

const toast = useToast();

const previousNavigations = ref<any[]>([]);

const onDragStart = () => {
  // Ambil snapshot urutan saat ini sebelum diubah
  previousNavigations.value = JSON.parse(JSON.stringify(navigations.value));
};
async function onDragEnd() {
  // Simpan urutan baru yang sudah di-drag ke variabel lokal untuk API
  const newOrder = [...navigations.value];

  // Update sortOrder di frontend secara reaktif agar UI terlihat update
  newOrder.forEach((item, index) => {
    item.sortOrder = index + 1;
  });

  try {
    const updatedOrders = newOrder.map((item) => ({
      id: item.id,
      sortOrder: item.sortOrder,
    }));

    // Kirim ke API
    const response = await reorderNavigation({ orders: updatedOrders });

    if (response?.success) {
      toast.add({ title: "Order updated", color: "success" });
    } else {
      throw new Error("API failure");
    }
  } catch (error) {
    // KALO GAGAL: Balikin ke urutan awal dari snapshot
    navigations.value = [...previousNavigations.value];

    toast.add({
      title: "Failed to update order",
      description: "Urutan dikembalikan ke posisi semula",
      color: "error",
    });
  }
}

// Fungsi untuk mendefinisikan item menu pada setiap baris navigasi
const getActionItems = (item: any) => [
  [
    {
      label: "Edit",
      icon: "i-lucide-pencil",
      onSelect() {
        // Isi form dengan data item yang dipilih untuk diedit
        state.label = item.label;
        state.link = item.link;
        state.id = item.id;
      },
    },
    {
      label: item.isActive ? "Nonaktifkan" : "Aktifkan",
      icon: item.isActive ? "i-lucide-eye-off" : "i-lucide-eye",
      async onSelect() {
        // Tambahkan konfirmasi biar tidak asal hapus
        try {
          const body = {};
          const res = await updateNavigationStatus(item.id);

          if (res?.success) {
            toast.add({
              title: `Status ${item.label} diperbarui`,
              color: "success",
            });
            // Pastikan refresh() dipanggil untuk sinkronisasi data
            await refresh();
          } else {
            throw new Error("Gagal");
          }
        } catch (err) {
          toast.add({
            title: "Error",
            description: "status gagal diubah",
            color: "error",
          });
        }
      },
    },
  ],
  [
    {
      label: "Hapus",
      icon: "i-lucide-trash",
      slot: "delete", // Bisa pakai slot khusus untuk styling merah
      async onSelect() {
        // Tambahkan konfirmasi biar tidak asal hapus
        try {
          const res = await deleteNavigation(item.id);

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
  <UContainer class="py-5">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-1">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold">Add Navigation Item</h3>
            <UButton size="sm" variant="ghost" @click="() => resetForm()">
              Clear
            </UButton>
          </div>
        </template>

        <UForm
          :schema="schema"
          :state="state"
          @submit="onSubmit"
          class="space-y-4"
        >
          <UFormField label="Label" name="label">
            <UInput
              v-model="state.label"
              placeholder="e.g. Projects"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Link / URL" name="link">
            <UInput
              v-model="state.link"
              placeholder="e.g. /projects"
              class="w-full"
            />
          </UFormField>

          <UButton type="submit" block :loading="loading">
            {{ state.id ? "Update" : "Add to menu" }}
          </UButton>
        </UForm>
      </UCard>

      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold">Menu Structure</h3>
            <p class="text-xs text-gray-500">Drag the handle to reorder</p>
          </div>
        </template>
        <ClientOnly>
          <draggable
            v-model="navigations"
            item-key="id"
            handle=".drag-handle"
            ghost-class="opacity-50"
            @start="onDragStart"
            @end="onDragEnd"
            class="space-y-2"
          >
            <template #item="{ element }">
              <div
                class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 group"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="drag-handle text-gray-400 hover:text-primary cursor-grab active:cursor-grabbing"
                  >
                    <UIcon name="i-lucide-grip-vertical" class="w-5 h-5" />
                  </div>

                  <div>
                    <p class="font-medium text-md">{{ element.label }}</p>
                    <p class="text-sm text-gray-500">{{ element.link }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UBadge
                    size="md"
                    :color="element.isActive ? 'success' : 'neutral'"
                  >
                    {{ element.isActive ? "Active" : "Inactive" }}
                  </UBadge>

                  <UBadge variant="outline" size="md"
                    >Order: {{ element.sortOrder }}</UBadge
                  >

                  <UDropdownMenu
                    :items="getActionItems(element)"
                    :popper="{ placement: 'bottom-end' }"
                  >
                    <UButton
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-more-vertical"
                      class="hover:bg-gray-100 dark:hover:bg-gray-800"
                    />

                    <template #delete="{ item }">
                      <span class="text-red-500 flex items-center gap-2">
                        <UIcon :name="item.icon" class="w-4 h-4" />
                        <span class="truncate">{{ item.label }}</span>
                      </span>
                    </template>
                  </UDropdownMenu>
                </div>
              </div>
            </template>
          </draggable>
          <template #fallback>
            <div class="space-y-2">
              <div
                v-for="i in 3"
                :key="i"
                class="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"
              />
            </div>
          </template>
          <div v-if="navigations.length === 0" class="text-center py-10">
            <UIcon
              name="i-lucide-menu"
              class="w-12 h-12 mx-auto text-gray-300"
            />
            <p class="text-gray-500 mt-2 text-sm">No navigation items found.</p>
          </div>
        </ClientOnly>
      </UCard>
    </div>
  </UContainer>
</template>
