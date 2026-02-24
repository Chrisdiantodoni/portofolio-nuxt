<script setup lang="ts">
import { format, isToday } from "date-fns";
import type { Mail } from "~/types";

const props = defineProps<{
  mails: Mail[];
}>();
const emit = defineEmits(["refresh"]);

// Fix 1: Use HTMLElement instead of Element for proper DOM typing
const mailsRefs = ref<Record<number, HTMLElement | null>>({});

const selectedMail = defineModel<Mail | null>();
const { moveToArchive, moveToTrash, readMail } = useMail();

watch(selectedMail, async (newMail) => {
  if (!newMail) return;

  const ref = mailsRefs.value[newMail.id];
  if (ref) {
    ref.scrollIntoView({ block: "nearest" });
  }

  if (newMail.unread) {
    try {
      await readMail(newMail.id);

      // Fix 2: Mutate the mail object inside props.mails instead of newMail directly.
      // newMail is the same object reference, so this is fine, but being explicit
      // about finding it in the source array is safer and more intentional.
      const mailInList = props.mails.find((m) => m.id === newMail.id);
      if (mailInList) {
        mailInList.unread = false;
      }

      emit("refresh");
    } catch (error) {
      console.error("Gagal menandai pesan sebagai terbaca", error);
    }
  }
});

defineShortcuts({
  arrowdown: () => {
    const index = props.mails.findIndex(
      (mail: Mail) => mail.id === selectedMail.value?.id,
    );

    if (index === -1) {
      selectedMail.value = props.mails[0];
    } else if (index < props.mails.length - 1) {
      selectedMail.value = props.mails[index + 1];
    }
  },
  arrowup: () => {
    const index = props.mails.findIndex(
      (mail: Mail) => mail.id === selectedMail.value?.id,
    );

    if (index === -1) {
      selectedMail.value = props.mails[props.mails.length - 1];
    } else if (index > 0) {
      selectedMail.value = props.mails[index - 1];
    }
  },
});

const toast = useToast();

const onArchive = async (id: number) => {
  try {
    const response = await moveToArchive(id);

    if (response.success !== true) {
      throw new Error(response.message || "Gagal mengarsipkan");
    }

    toast.add({
      title: "Pesan diarsipkan",
      color: "success",
      icon: "i-lucide-archive",
    });
    emit("refresh");
  } catch (error) {
    toast.add({
      title: "Gagal memindahkan ke arsip",
      description:
        error instanceof Error ? error.message : "Terjadi kesalahan sistem",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  }
};

const onTrash = async (id: number) => {
  try {
    const response = await moveToTrash(id);

    if (response.success !== true) {
      throw new Error(response.message || "Gagal membuang");
    }

    toast.add({
      title: "Pesan dibuang",
      color: "error",
      icon: "i-lucide-trash",
    });
    emit("refresh");
  } catch (error) {
    toast.add({
      title: "Gagal memindahkan ke Trash",
      description:
        error instanceof Error ? error.message : "Terjadi kesalahan sistem",
      color: "error",
      icon: "i-lucide-circle-alert",
    });
  }
};

const getStatusAttributes = (status: string) => {
  switch (status) {
    case "draft":
      return {
        label: "Draft",
        color: "warning" as const,
        variant: "subtle" as const,
      };
    case "archive":
      return {
        label: "Archived",
        color: "neutral" as const,
        variant: "outline" as const,
      };
    case "sent":
      return {
        label: "Sent",
        color: "primary" as const,
        variant: "subtle" as const,
      };
    case "trash":
      return {
        label: "Trash",
        color: "error" as const,
        variant: "subtle" as const,
      };
    default:
      return null;
  }
};
</script>

<template>
  <div class="overflow-y-auto divide-y divide-default">
    <div
      v-for="mail in mails"
      :key="mail.id"
      :ref="
        (el) => {
          mailsRefs[mail.id] = el as HTMLElement | null;
        }
      "
      class="group relative"
    >
      <div
        class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors relative"
        :class="[
          mail.unread ? 'text-highlighted' : 'text-toned',
          selectedMail && selectedMail.id === mail.id
            ? 'border-primary bg-primary/10'
            : 'border-bg hover:border-primary hover:bg-primary/5',
        ]"
        @click="selectedMail = mail"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span :class="[mail.unread && 'font-semibold']">{{
              mail.senderName
            }}</span>
            <UChip v-if="mail.unread" />
          </div>

          <div class="relative flex items-center justify-end min-w-[80px]">
            <span class="text-xs transition-opacity group-hover:opacity-0">
              {{
                isToday(new Date(mail.date))
                  ? format(new Date(mail.date), "HH:mm")
                  : format(new Date(mail.date), "dd MMM")
              }}
            </span>

            <div
              class="absolute right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-inherit pl-2"
            >
              <UButton
                icon="i-lucide-archive"
                variant="ghost"
                color="neutral"
                size="xs"
                @click.stop="onArchive(mail.id)"
              />
              <UButton
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click.stop="onTrash(mail.id)"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-0.5">
          <p class="truncate" :class="[mail.unread && 'font-semibold']">
            {{ mail.subject }}
          </p>
          <UBadge
            v-if="getStatusAttributes(mail.status)"
            :label="getStatusAttributes(mail.status)!.label"
            :color="getStatusAttributes(mail.status)!.color"
            :variant="getStatusAttributes(mail.status)!.variant"
            size="sm"
            class="shrink-0"
          />
        </div>
        <p class="text-dimmed line-clamp-1">
          {{ mail.body }}
        </p>
      </div>
    </div>
  </div>
</template>
