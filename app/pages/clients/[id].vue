<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Détails du client</h1>
    
    <div v-if="clientStore.loading" class="text-center">Chargement...</div>
    
    <div v-else-if="clientStore.currentClient" class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">{{ clientStore.currentClient.name }}</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Type:</strong> {{ clientStore.currentClient.client_type }}</p>
          <p><strong>Email:</strong> {{ clientStore.currentClient.email }}</p>
          <p><strong>Téléphone:</strong> {{ clientStore.currentClient.phone }}</p>
        </div>
        <div>
          <p><strong>Ville:</strong> {{ clientStore.currentClient.city }}</p>
          <p><strong>Région:</strong> {{ clientStore.currentClient.region }}</p>
          <p><strong>Pays:</strong> {{ clientStore.currentClient.country }}</p>
        </div>
      </div>
      
      <h3 class="text-lg font-semibold mt-6 mb-3">Contacts</h3>
      <div v-for="contact in clientStore.currentClient.contacts" :key="contact.id" class="bg-gray-50 p-3 rounded mb-2">
        <p><strong>{{ contact.name }}</strong> ({{ contact.role }})</p>
        <p>Email: {{ contact.email }}</p>
        <p>Téléphone: {{ contact.phone }}</p>
      </div>
      
      <div class="mt-6">
        <button @click="$router.back()" class="bg-gray-500 text-white px-4 py-2 rounded">Retour</button>
      </div>
    </div>
    
    <div v-else class="text-center">Client non trouvé</div>
  </div>
</template>

<script setup>
import { useClientStore } from '~/app/stores/ClientStore';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const clientStore = useClientStore();
const route = useRoute();

onMounted(async () => {
  await clientStore.fetchClient(route.params.id);
});
</script>