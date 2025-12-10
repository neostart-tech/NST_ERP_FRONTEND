<template>
    <div class="flex-1 p-8 bg-gray-100 min-h-screen">
        <!-- Le composant ReapprovisionnementSection gère son propre titre et affichage avec le nouveau style -->
        <ReapprovisionnementSection />
    </div>
</template>

<script setup>
// L'auto-importation de ReapprovisionnementSection fonctionne car il est dans components/Reapprovisionnement/

console.log('Page reapprovisionnement.vue est exécutée.'); // Debug log

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Réapprovisionnement - Neo Start Tech',
});
</script>

<style scoped>
/* Pas de styles spécifiques ici, Tailwind CSS est suffisant */
</style>
