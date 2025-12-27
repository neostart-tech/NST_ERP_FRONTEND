<template>
  <!-- <div>
    <p>Redirection vers la page de connexion...</p>
  </div> -->

  <Login />
</template>

<script setup>
definePageMeta({
  layout: false
});
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Login from './auth/login.vue';

// Redirection vers la page de connexion au chargement de la page
const router = useRouter();

onMounted(() => {
  console.log("Redirection vers la page de connexion...");
  // Rediriger vers /login
  router.push('/auth');
});
</script>
