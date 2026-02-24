<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { breakpointsTailwind } from "@vueuse/core";
import type { Mail } from "~/types";

definePageMeta({
  title: "Inbox",
});

const tabItems = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Unread",
    value: "unread",
  },
];

const page = ref(1);
const limit = ref(10);
const status = ref("draft"); // inbox, archive, trash, draft
const selectedTab = ref("all"); // all, unread

// Gunakan computed untuk query agar useFetch otomatis refresh saat nilai berubah
const queryParams = computed(() => ({
  page: page.value,
  limit: limit.value,
  status: status.value,
  unread: selectedTab.value === "unread" ? true : undefined,
}));

interface MailResponse {
  success: boolean;
  data: Mail[];
  pagination: {
    total: number;
    page: number;
    lastPage: number;
  };
}

interface MailResponse {
  success: boolean;
  data: Mail[];
}
const { data, pending, refresh } = await useFetch<MailResponse>("/api/mails", {
  query: queryParams,
  watch: [queryParams], // Memastikan refresh saat params berubah
});

const mails = computed(() => data?.value?.data || []);
const totalMails = computed(() => data?.value?.pagination?.total || 0);

const selectedMail = ref<Mail | null>();

const isMailPanelOpen = computed({
  get() {
    return !!selectedMail.value;
  },
  set(value: boolean) {
    if (!value) {
      selectedMail.value = null;
    }
  },
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller("lg");
</script>

<template>
  <div class="flex flex-1 h-full">
    <UDashboardPanel
      id="inbox-1"
      :default-size="25"
      :min-size="20"
      :max-size="30"
      resizable
    >
      <UDashboardNavbar title="Mails">
        <template #trailing>
          <UBadge :label="mails.length" variant="subtle" />
        </template>

        <template #right>
          <UTabs
            v-model="selectedTab"
            :items="tabItems"
            :content="false"
            size="xs"
          />
        </template>
      </UDashboardNavbar>
      <InboxList v-model="selectedMail" :mails="mails" @refresh="refresh" />
      <template #footer>
        <div
          class="flex items-center justify-between w-full px-4 py-2 border-t border-default"
        >
          <UPagination
            v-model="page"
            :page-count="limit"
            :total="totalMails"
            size="xs"
          />
          <span class="text-xs text-dimmed">Total: {{ totalMails }}</span>
        </div>
      </template>
    </UDashboardPanel>

    <InboxMail
      v-if="selectedMail"
      :mail="selectedMail"
      @close="selectedMail = null"
    />
    <div v-else class="hidden lg:flex flex-1 items-center justify-center">
      <UIcon name="i-lucide-inbox" class="size-32 text-dimmed" />
    </div>

    <ClientOnly>
      <USlideover v-if="isMobile" v-model:open="isMailPanelOpen">
        <template #content>
          <InboxMail
            v-if="selectedMail"
            :mail="selectedMail"
            @close="selectedMail = null"
          />
        </template>
      </USlideover>
    </ClientOnly>
  </div>
</template>
