<template>
    <div class="flex-1 p-8 bg-gray-100 min-h-screen">
        <!-- Le composant CommandesList gère son propre titre et affichage avec le nouveau style -->
        <CommandesList />
    </div>
</template>

<script setup>
// L'auto-importation de CommandesList fonctionne car il est dans components/Commandes/

console.log('Page commandes.vue est exécutée.'); // Debug log

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Suivi des Commandes - Neo Start Tech',
});
</script>

<style scoped>
/* Pas de styles spécifiques ici, Tailwind CSS est suffisant */
</style>
