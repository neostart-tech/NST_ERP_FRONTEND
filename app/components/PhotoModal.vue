<template>
	<div v-if="isOpen"
		class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
		<div class="relative max-w-6xl max-h-full">
			<button @click="$emit('close')"
				class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
				<Icon name="heroicons:x-mark" class="w-8 h-8" />
			</button>
			<img :src="photoUrl" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl">
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	isOpen: boolean;
	photoUrl: string;
}>();

defineEmits<{
	close: [];
}>();
</script>
