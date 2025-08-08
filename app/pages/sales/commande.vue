<template>
  <div class="p-6 space-y-6">
    <!-- Titre -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Détails de la Commande</h1>
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
        Télécharger en PDF
      </button>
    </div>

    <!-- Infos Client & Commande -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Informations de la commande</h2>
      <p><span class="font-medium">Client :</span> {{ order?.client?.last_name }} {{ order?.client?.first_name }}</p>
      <p><span class="font-medium">Date de commande :</span> {{ order?.created_at }}</p>
      <p><span class="font-medium">Statut :</span> {{ order?.status }}</p>
    </div>

    <!-- Proforma -->
    <div  class="bg-white rounded-lg shadow-md p-4">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Facture Proforma</h2>
      <p><span class="font-medium">Nom :</span> </p>
      <p><span class="font-medium">Date :</span> </p>
    </div>

    <div class="text-gray-500 italic">Aucune facture proforma liée à cette commande.</div>

    <!-- Articles -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Articles de la commande</h2>
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">#</th>
            <th class="px-4 py-2 text-left">Désignation</th>
            <th class="px-4 py-2 text-left">Quantité</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in order?.items || []" :key="idx" class="border-t">
            <td class="px-4 py-2">{{ idx + 1 }}</td>
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2">{{ item.qty }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useOrderStore } from '#imports';

const  route=useRoute()
const orderStore=useOrderStore()
const order = ref(null)
const orderId = route.params.id
onMounted(async () => {
  order.value = await orderStore.fetchOneOrder(orderId)
})

</script>
