<script setup lang="ts">
definePageMeta({
  title: "Contacts",
});

import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import draggable from "vuedraggable";
// 1. Schema Validasi Zod
const schema = z.object({
  // Izinkan null atau number, dan buat opsional
  id: z.number().nullable().optional(),
  platform: z.string().min(1, "Platform wajib diisi"),
  url: z
    .string()
    .url("Format URL tidak valid (gunakan https://)")
    .min(1, "URL wajib diisi"),
  icon: z.string().min(1, "Icon wajib dipilih"),
});

type Schema = z.output<typeof schema>;

// 2. State untuk Form (Sisi Kiri)
const state = reactive({
  id: null,
  platform: "",
  url: "",
  icon: "i-lucide-box",
});
const searchTerm = ref("");
const searchTermDebounced = refDebounced(searchTerm, 200);

const resetForm = () => {
  ((state.platform = ""),
    (state.url = ""),
    (state.icon = "i-lucide-box"),
    (state.id = null));
};

const loading = ref(false);

const social_links = ref<any[]>([]);
const { data, refresh } = useFetch<navigation[]>("/api/social-links", {
  transform: (res: any) => res.data || [],
});

watch(
  data,
  (newVal) => {
    if (newVal) social_links.value = [...newVal];
  },
  { immediate: true },
);
const {
  addNewSocialLinks,
  updateSocialLinks,
  updateSocialLinksStatus,
  deleteSocialLinks,
  reorderSocialLinks,
} = useSocialLinks();

const { data: iconsData, status } = await useFetch("/api/icons/search", {
  params: {
    q: searchTermDebounced,
  },
  lazy: true,
  watch: [searchTermDebounced],
});

// Transform data menjadi format yang sesuai untuk USelectMenu
const icons = computed(() => {
  if (!iconsData.value) return [];

  // Jika API mengembalikan array of strings: ['vue', 'react', 'nuxt']
  // Transform menjadi array of objects dengan label dan value
  return iconsData.value?.map((item) => ({
    label: item?.label,
    value: item?.icon,
    icon: item?.icon,
  }));
});

// 6. Submit Handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  console.log({ event });
  try {
    let response;
    if (state.id == null) {
      response = await addNewSocialLinks(event.data);
    } else {
      response = await updateSocialLinks(event.data.id!, event.data);
    }
    if (response?.success) {
      toast.add({
        title: "Success",
        description: "Social Links updated successfully",
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
  previousNavigations.value = JSON.parse(JSON.stringify(social_links.value));
};
async function onDragEnd() {
  // Simpan urutan baru yang sudah di-drag ke variabel lokal untuk API
  const newOrder = [...social_links.value];

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
    const response = await reorderSocialLinks({ orders: updatedOrders });

    if (response?.success) {
      toast.add({ title: "Order updated", color: "success" });
    } else {
      throw new Error("API failure");
    }
  } catch (error) {
    // KALO GAGAL: Balikin ke urutan awal dari snapshot
    social_links.value = [...previousNavigations.value];

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
        state.url = item.url;
        state.platform = item.platform;
        state.icon = item.icon;
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
          const res = await updateSocialLinksStatus(item.id);

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
          const res = await deleteSocialLinks(item.id);

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
            <h3 class="font-bold">Add Social Link</h3>
            <UButton size="sm" variant="ghost" @click="() => resetForm()">
              Clear
            </UButton>
          </div>
        </template>

        <UForm
          :schema="schema"
          :state="state"
          @error="(err) => console.log('Validation Errors:', err)"
          @submit="onSubmit"
          class="space-y-4"
        >
          <UFormField label="Platform" name="platform">
            <UInput
              v-model="state.platform"
              placeholder="e.g. Twitter, Instagram"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Link / URL" name="url">
            <UInput
              v-model="state.url"
              placeholder="e.g. https"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Icon" name="icon">
            <USelectMenu
              v-model="state.icon"
              v-model:search-term="searchTerm"
              :items="icons as any[]"
              :loading="status === 'pending'"
              placeholder="Select Icon"
              class="w-full"
              value-attribute="value"
              option-attribute="label"
              ignore-filter
              @update:model-value="
                (val) => {
                  state.icon = typeof val === 'object' ? val.value : val;
                  searchTerm = '';
                }
              "
            >
              <template #leading>
                <UIcon
                  v-if="state.icon"
                  :name="state.icon"
                  class="size-5 text-primary"
                />
                <UIcon
                  v-else
                  name="i-lucide-search"
                  class="size-5 text-muted"
                />
              </template>

              <template #item="{ item }">
                <UIcon :name="item.value" class="size-5" />
                <span class="truncate">{{ item.label }}</span>
              </template>
            </USelectMenu>
          </UFormField>
          <UButton type="submit" block :loading="loading">
            {{ state.id ? "Update" : "Add" }}
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
            v-model="social_links"
            item-key="id"
            handle=".drag-handle"
            ghost-class="opacity-50"
            @start="onDragStart"
            @end="onDragEnd"
            class="space-y-2"
          >
            <template #item="{ element }">
              <div
                class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 group hover:border-primary/50 transition-colors shadow-sm"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="drag-handle text-gray-400 hover:text-primary cursor-grab active:cursor-grabbing"
                  >
                    <UIcon name="i-lucide-grip-vertical" class="w-5 h-5" />
                  </div>

                  <UAvatar
                    :icon="element.icon || 'i-lucide-link'"
                    size="md"
                    class="bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                  />

                  <div>
                    <p
                      class="font-bold text-gray-900 dark:text-white leading-tight"
                    >
                      {{ element.platform }}
                    </p>
                    <ULink
                      :to="element.url"
                      target="_blank"
                      class="text-xs text-gray-500 hover:text-primary transition-colors truncate max-w-[150px] md:max-w-xs block"
                    >
                      {{ element.url }}
                    </ULink>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <UBadge
                    size="sm"
                    variant="subtle"
                    :color="element.isActive ? 'success' : 'neutral'"
                    class="capitalize"
                  >
                    {{ element.isActive ? "Active" : "Hidden" }}
                  </UBadge>

                  <UDropdownMenu :items="getActionItems(element)">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-more-vertical"
                      size="sm"
                    />
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
          <div v-if="social_links.length === 0" class="text-center py-10">
            <UIcon
              name="i-lucide-menu"
              class="w-12 h-12 mx-auto text-gray-300"
            />
            <p class="text-gray-500 mt-2 text-sm">No Social Link found.</p>
          </div>
        </ClientOnly>
      </UCard>
    </div>
  </UContainer>
</template>
