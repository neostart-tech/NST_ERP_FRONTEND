<template>
    <!-- Le contenu de cette page sera inséré dans le <slot /> de layouts/default.vue -->
    <DashboardOverview />
</template>

<script setup>
// L'auto-importation de DashboardOverview fonctionne car il est dans components/dashboard/

// Indique à Nuxt d'utiliser le layout par défaut
definePageMeta({
  layout: 'default',
});

// Définir le titre de la page pour le navigateur
useHead({
  title: 'Tableau de Bord - Neo Start Tech',
});
</script>

<style scoped>
/* Pas de styles spécifiques ici, Tailwind CSS est suffisant */
</style>
