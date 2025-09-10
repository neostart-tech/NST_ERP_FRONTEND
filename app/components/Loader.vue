<template>
  <div class="text-center py-10 mt-10">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#085681] mx-auto"></div>
    <p class="mt-4 text-gray-600">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: 'Chargement...'
  }
})
</script>

