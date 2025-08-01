<script setup lang="ts">
defineProps({
	isLoading: {
		type: Boolean,
		default: false
	}
})
</script>

<template>
	<span class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white border-t-transparent mr-2 my-auto" v-if="isLoading"></span>
</template>
