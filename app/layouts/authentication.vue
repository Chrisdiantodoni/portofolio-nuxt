<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: "AuthenticationLayout",
});
const router = useRouter();
const token = useCookie("auth_token", {
  path: "/",
});
console.log(token.value);
// onMounted(() => {
//   const token = useCookie("auth_token");
//   console.log(token.value);
//   if (token.value) {
//     router.push("/");
//   }
// });
</script>
