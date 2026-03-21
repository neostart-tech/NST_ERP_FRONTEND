<template>
	<footer class="w-full py-4 px-6 bg-white text-gray-600 text-center text-sm">
		{{ appVersion }} © {{ new Date().getFullYear() }} {{ appName }}. Tous droits
		réservés.
	</footer>
</template>
<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME || "Mon Application";
const appVersion = import.meta.env.VITE_APP_VERSION
	? `v${import.meta.env.VITE_APP_VERSION}`
	: "";
</script>
