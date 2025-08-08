<template>
  <div class="max-w-7xl mx-auto p-6 bg-gray-50">
    <!-- Titre -->
     <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <i class="fas fa-list text-indigo-600"></i>
          Suivi des Bordereaux de Livraison
          </h1>
          <NuxtLink :to="AppUrl.DELIVERY"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out" >
            <i class="fas fa-add w-8"></i>Nouvelle livraison
          </NuxtLink>
     </div>
    

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <i class="fas fa-box-open text-indigo-500 text-3xl mb-2"></i>
        <h2 class="text-lg font-semibold">Total Bordereaux</h2>
        <p class="text-2xl font-bold text-gray-700"></p>
      </div>
      <div class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <i class="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
        <h2 class="text-lg font-semibold">Livraisons Complètes</h2>
        <p class="text-2xl font-bold text-gray-700"></p>
      </div>
      <div class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-2"></i>
        <h2 class="text-lg font-semibold">Livraisons Partielles</h2>
        <p class="text-2xl font-bold text-gray-700"></p>
      </div>
    </div>

    <!-- Filtre -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Liste des Bordereaux</h2>
      <select v-model="filterType" class="border border-gray-400 rounded-md px-3 py-2">
        <option value="">Tous</option>
        <option value="complete">Livraison Complète</option>
        <option value="partial">Livraison Partielle</option>
      </select>
    </div>

    <!-- Tableau -->
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <table class="w-full border-collapse">
        <thead class="bg-indigo-100 text-gray-700 text-sm uppercase">
          <tr>
            <!-- <th class="p-3 text-left">Commande</th> -->
            <th class="p-3 text-left">Client</th>
            <th class="p-3 text-center">Type</th>
            <th class="p-3 text-center">Date</th>
            <th class="p-3 text-center">Adresse</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="delivery in deliveryStore.livraison" :key="delivery.id" :value="delivery.id" class="hover:bg-gray-100 border-t text-sm">
            <!-- <td class="p-3"> CMD-{{ String(index + 1).padStart(3, '0') }} - {{delivery.order.client.last_name }} {{ cmd.client.first_name }} </td> -->
            <td class="p-3">{{delivery.order.client.last_name}} {{delivery.order.client.first_name}}</td>
            <td class="p-3 text-center">{{delivery.delivery_type}}</td>
            <td class="p-3 text-center">{{delivery.delivery_date}}</td>
            <td class="p-3 text-center">{{delivery.delivery_address}}</td>
            <td class="p-3 text-center">
              <button @click="showDetails(delivery.id)" title="Voir" class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
                      <i class="fas fa-eye"></i>
             </button>
              
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Détails -->
    <div v-if="selectedNote" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl p-6 relative">
        <button
          @click="selectedNote = null"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="text-xl font-bold mb-4">Détails Bordereau</h2>
        <p><strong>Commande :</strong> CMD-</p>
        <p><strong>Client : </strong> </p>
        <p><strong>Date :</strong> </p>
        <p><strong>Adresse :</strong> </p>
        <h3 class="text-lg font-semibold mt-4 mb-2">Articles Livrés</h3>
        <table class="w-full border border-gray-300 text-sm">
          <thead class="bg-gray-200">
            <tr >
              <th class="p-2">Désignation</th>
              <th class="p-2">Code</th>
              <th class="p-2">Numéro Série</th>
              <th class="p-2">Qté Livrée</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="delivery in deliveryStore.livraison" :key="delivery.id" :value="delivery.id" class="border-t">
              <td class="p-2">{{ delivery.items.designation }}</td>
              <td class="p-2">{{ delivery.items.product_code}}</td>
              <td class="p-2">{{ delivery.items.serial_number }}</td>
              <td class="p-2">{{ delivery.items.quantity_delivered }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
// definePageMeta({
//   layout: 'default' // Assure que cette page utilise le layout 'default.vue'
// })
import { useDeliveryStore } from '#imports'
import { onMounted } from 'vue'



const deliveryNotes = ref([])
const stats = ref({ total: 0, complete: 0, partial: 0 })
const filterType = ref('')
const selectedNote = ref(null)


//Affichege des bordereaux et infos
const deliveryStore=useDeliveryStore()
onMounted(()=>{
    deliveryStore.fetchDelivery()
})






const showDetails = (note) => {
  selectedNote.value = note
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>
