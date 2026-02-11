<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { sub } from "date-fns";
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Period, Range } from "~/types";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const toast = useToast();

const open = ref(false);

const links = [
  [
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/admin/dashboard",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Inbox",
      icon: "i-lucide-inbox",
      to: "/admin/inbox",
      badge: "4",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Customers",
      icon: "i-lucide-users",
      to: "/admin/customers",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Master Data",
      icon: "i-lucide-database",
      defaultOpen: true,
      children: [
        {
          label: "Technologies",
          to: "/admin/master-data/technologies",
          exact: true,
          onSelect: () => {
            open.value = false;
          },
        },
      ],
    },
    {
      label: "Users",
      icon: "i-lucide-users",
      to: "/admin/users",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Projects",
      icon: "i-lucide-briefcase",
      to: "/admin/projects",
    },
    {
      label: "Work Experiences",
      icon: "i-lucide-history",
      to: "/admin/experiences",
    },
    {
      label: "Articles",
      icon: "i-lucide-newspaper",
      to: "/admin/articles",
    },
    {
      label: "About Me",
      icon: "i-lucide-user-circle",
      to: "/admin/about",
    },
    {
      label: "Testimonials",
      icon: "i-lucide-quote",
      to: "/admin/testimonials",
    },
    {
      label: "FAQs",
      icon: "i-lucide-help-circle",
      to: "/admin/faqs",
    },
    {
      label: "Contacts",
      icon: "i-lucide-contact",
      to: "/admin/contacts",
    },
    // {
    //   label: "Settings",
    //   to: "/admin/settings",
    //   icon: "i-lucide-settings",
    //   defaultOpen: true,
    //   type: "trigger",
    //   children: [
    //     {
    //       label: "General",
    //       to: "/admin/settings",
    //       exact: true,
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //     {
    //       label: "Members",
    //       to: "/admin/settings/members",
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //     {
    //       label: "Notifications",
    //       to: "/admin/settings/notifications",
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //     {
    //       label: "Security",
    //       to: "/admin/settings/security",
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //     {
    //       label: "Users",
    //       to: "/admin/users",
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //   ],
    // },
  ],
  [
    {
      label: "Feedback",
      icon: "i-lucide-message-circle",
      to: "https://github.com/nuxt-ui-templates/dashboard",
      target: "_blank",
    },
    {
      label: "Help & Support",
      icon: "i-lucide-info",
      to: "https://github.com/nuxt-ui-templates/dashboard",
      target: "_blank",
    },
  ],
] satisfies NavigationMenuItem[][];

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.flat(),
  },
  {
    id: "code",
    label: "Code",
    items: [
      {
        id: "source",
        label: "View page source",
        icon: "i-simple-icons-github",
        to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${
          route.path === "/" ? "/index" : route.path
        }.vue`,
        target: "_blank",
      },
    ],
  },
]);
const { isNotificationsSlideoverOpen } = useDashboard();

// onMounted(async () => {
//   const cookie = useCookie("cookie-consent");
//   if (cookie.value === "accepted") {
//     return;
//   }

//   toast.add({
//     title:
//       "We use first-party cookies to enhance your experience on our website.",
//     duration: 0,
//     close: false,
//     actions: [
//       {
//         label: "Accept",
//         color: "neutral",
//         variant: "outline",
//         onClick: () => {
//           cookie.value = "accepted";
//         },
//       },
//       {
//         label: "Opt out",
//         color: "neutral",
//         variant: "ghost",
//       },
//     ],
//   });
// });

const items = [
  [
    {
      label: "New mail",
      icon: "i-lucide-send",
      to: "/inbox",
    },
    {
      label: "New customer",
      icon: "i-lucide-user-plus",
      to: "/customers",
    },
  ],
] satisfies DropdownMenuItem[][];
const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const period = ref<Period>("daily");

const auth = useAuthStore();

onMounted(() => {
  auth.fetchUser();
});

// Jalankan fetchUser saat aplikasi diinisialisasi
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          class="bg-transparent ring-default"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />
    <UDashboardPanel grow id="home">
      <template #header>
        <UDashboardNavbar
          :title="(route.meta.title as string) || 'Default Title'"
          :ui="{ right: 'gap-3' }"
        >
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <template #right>
            <UTooltip text="Notifications" :shortcuts="['N']">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="isNotificationsSlideoverOpen = true"
              >
                <UChip color="error" inset>
                  <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
                </UChip>
              </UButton>
            </UTooltip>

            <UDropdownMenu :items="items">
              <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
    <NotificationsSlideover />
  </UDashboardGroup>
</template>
