<template>
  <div class="max-w-7xl mx-auto p-6 bg-gray-50">
    <!-- Titre -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <i class="fas fa-list text-indigo-600"></i>
        Suivi des Bordereaux de Livraison
      </h1>
      <NuxtLink :to="AppUrl.DELIVERY" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
        <i class="fas fa-add w-8"></i>Nouvelle livraison
      </NuxtLink>
    </div>
    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <i class="fas fa-box-open text-indigo-500 text-3xl mb-2"></i>
        <h2 class="text-lg font-semibold">Total Bordereaux</h2>
        <p class="text-2xl font-bold text-gray-700"></p>
      </div>
      <div
        class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <i class="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
        <h2 class="text-lg font-semibold">Livraisons Complètes</h2>
        <p class="text-2xl font-bold text-gray-700"></p>
      </div>
      <div
        class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
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
            <th class="p-3 text-left">Client</th>
            <th class="p-3 text-center">Type</th>
            <th class="p-3 text-center">Date</th>
            <th class="p-3 text-center">Adresse</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="delivery in filteredDeliveries" :key="delivery.id" class="hover:bg-gray-100 border-t text-sm">
            <td class="p-3"> {{ delivery.order.client.name }}  </td>
            <td class="p-3 text-center">{{ delivery.delivery_type }}</td>
            <td class="p-3 text-center">{{ formatDate(delivery.delivery_date) }}</td>
            <td class="p-3 text-center">{{ delivery.delivery_address }}</td>
            <td class="p-3 text-center">
              <button
                @click="viewDetails(delivery)" title="Voir" class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
                <i class="fas fa-eye"></i>
              </button>
              <button
                @click="downloadDelivery(delivery)" title="Télecharger" class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out">
                <i class="fas fa-download"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredDeliveries.length === 0">
            <td colspan="5" class="text-center p-4 text-gray-500">
              Aucune livraison trouvée.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal Détails -->
    <div v-if="showModal "class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl p-6 relative">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i> Fermer
        </button>
        <h2 class="text-xl font-bold mb-4">Détails Bordereau</h2>
        <p>
          <strong>Commande :</strong> CMD
        </p>
        <p>
          <strong>Client :</strong>
          {{ selectedDelivery.order.client.last_name }}
          {{ selectedDelivery.order.client.first_name }}
        </p>
        <p><strong>Date :</strong> {{ formatDate(selectedDelivery.delivery_date) }}</p>
        <p><strong>Adresse :</strong> {{ selectedDelivery.delivery_address }}</p>

        <h3 class="text-lg font-semibold mt-4 mb-2">Articles Livrés</h3>
        <table class="w-full border border-gray-300 text-sm">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-2">Désignation</th>
              <th class="p-2">Code</th>
              <th class="p-2">Numéro Série</th>
              <th class="p-2">Qté Livrée</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in selectedDelivery.articles" :key="article.id" class="border-t">
              <td class="p-2">{{ article.designation }}</td>
              <td class="p-2">{{ article.code }}</td>
              <td class="p-2">{{ article.serial_number }}</td>
              <td class="p-2">{{ article.quantity_delivered }}</td>
            </tr>
            <tr v-if="!selectedDelivery.articles || selectedDelivery.articles.length === 0">
              <td colspan="4" class="text-center p-4 text-gray-500">
                Aucun article livré.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDeliveryStore } from '#imports'

const filterType = ref('')
const selectedDelivery = ref(null)
const showModal = ref(false)

const deliveryStore = useDeliveryStore()

onMounted(() => {
  deliveryStore.fetchDelivery()
})
function downloadDelivery(delivery){
  deliveryStore.downloadDelivery(delivery)
}

function viewDetails(delivery) {
  selectedDelivery.value = delivery
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedDelivery.value = null
}

const filteredDeliveries = computed(() => {
  if (!filterType.value) return deliveryStore.livraison
  return deliveryStore.livraison.filter(
    (d) => d.delivery_type === filterType.value
  )
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

</script>
