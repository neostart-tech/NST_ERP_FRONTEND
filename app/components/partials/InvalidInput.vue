<script setup lang="ts">
defineProps({
	error: {
		type: String,
		required: true
	},
	errorMessage: {
		type: String | null,
		required: false
	}
})
</script>

<template>
	<p v-if="error" class="text-red-500 text-xs mt-1">{{ errorMessage || error }}</p>
</template>

