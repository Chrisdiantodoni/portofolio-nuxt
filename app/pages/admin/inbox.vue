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
const selectedTab = ref("all");

interface MailResponse {
  success: boolean;
  data: Mail[];
}

const { data } = await useFetch<MailResponse>("/api/mails");

const mails = computed(() => data?.value?.data || []);

// Filter mails based on the selected tab
const filteredMails = computed(() => {
  if (selectedTab.value === "unread") {
    return mails.value.filter((mail: Mail) => !!mail.unread);
  }

  return mails.value;
});

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

// Reset selected mail if it's not in the filtered mails
watch(filteredMails, () => {
  if (!filteredMails.value.find((mail) => mail.id === selectedMail.value?.id)) {
    selectedMail.value = null;
  }
});

watch(
  selectedMail,
  (newVal, oldVal) => {
    console.log("--- Debug selectedMail ---");
    console.log("Sebelumnya:", oldVal);
    console.log("Sekarang:", newVal);
    if (newVal) {
      console.log("ID yang dipilih:", newVal.id);
    }
  },
  { deep: true },
);

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
          <UBadge :label="filteredMails.length" variant="subtle" />
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
      <InboxList v-model="selectedMail" :mails="filteredMails" />
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
