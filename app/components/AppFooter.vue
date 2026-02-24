<script setup lang="ts">
defineProps<{
  // Gunakan tipe Button dari Nuxt UI karena kita akan v-bind ke UButton
  footer_links?: any;
}>();
</script>

<template>
  <UFooter class="z-10 bg-default" :ui="{ left: 'text-muted text-xs' }">
    <template #left>
      © {{ new Date().getFullYear() }} — All rights reserved.
    </template>

    <template #right>
      <template v-if="footer_links">
        <UButton
          v-for="(link, index) of footer_links"
          :key="index"
          v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
