<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-extrabold text-gray-900">Suivi des Bordereaux de Livraison</h1>
      <NuxtLink :to="AppUrl.DELIVERY" class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
        <i class="fas fa-add"></i> Nouvelle livraison
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
      <div class="shadow rounded-lg p-4 text-center bg-blue-200">
        <i class="fas fa-box-open text-indigo-500 text-3xl mb-2"></i>
        <h2 class="text-lg font-semibold">Total Bordereaux</h2>
        <p class="text-2xl font-bold text-gray-700">{{ stats.total }}</p>
      </div>
      <div class="bg-green-200 shadow rounded-lg p-4 text-center bg-green-200">
        <i class="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
        <h2 class="text-lg font-semibold">Livraisons Complètes</h2>
        <p class="text-2xl font-bold text-gray-700">{{ stats.complete }}</p>
      </div>
      <div class="bg-orange-200 shadow rounded-lg p-4 text-center ">
        <i class="fas fa-exclamation-circle text-yellow-500 text-3xl mb-2"></i>
        <h2 class="text-lg font-semibold">Livraisons Partielles</h2>
        <p class="text-2xl font-bold text-gray-700">{{ stats.partial }}</p>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Liste des Bordereaux</h2>
      <select v-model="filterType" class="border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        <option value="">Tous les types</option>
        <option value="complete">Livraison Complète</option>
        <option value="partial">Livraison Partielle</option>
      </select>
    </div>

    <div class="bg-white shadow-lg rounded-lg overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th class="p-3 text-center border border-gray-200">Client</th>
            <th class="p-3 text-center border border-gray-200">Commande</th>
            <th class="p-3 text-center border border-gray-200">Type</th>
            <th class="p-3 text-center border border-gray-200">Date</th>
            <th class="p-3 text-center border border-gray-200">Adresse</th>
            <th class="p-3 text-center border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="delivery in filteredDeliveries" :key="delivery.id" class="hover:bg-gray-50 border-b border-gray-200">
            <td class="p-3  text-center border border-gray-200"> </td>
            <td class="p-3  text-center border border-gray-200"></td>
            <td class="p-3 text-center  border border-gray-200">
              <span  class="px-2 py-1 rounded text-xs font-bold">
                {{ translateDeliveryType(delivery.delivery_type) }}
              </span>
            </td>
            <td class="p-3 text-center  border border-gray-200">{{ formatDate(delivery.delivery_date) }}</td>
            <td class="p-3 text-center  border border-gray-200">{{ delivery.delivery_address }}</td>
            <td class="p-3 text-center space-x-2">
              <button @click="viewDetails(delivery)" title="Voir" class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="downloadDelivery(delivery)" title="Télécharger" class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out">
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

    <div v-if="showModal && selectedDelivery" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-3/4 max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4 text-indigo-700">Détails du Bordereau</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <!-- <p><strong>Commande :</strong> {{ selectedDelivery.order.reference }}</p> -->
          <!-- <p><strong>Client :</strong> {{ selectedDelivery.order.client.name }} </p> -->
          <p><strong>Date :</strong> {{ formatDate(selectedDelivery.delivery_date) }}</p>
          <p><strong>Adresse :</strong> {{ selectedDelivery.delivery_address }}</p>
          <p><strong>Type :</strong>
            <span :class="deliveryTypeClass(selectedDelivery.delivery_type)" class="px-2 py-1 rounded text-xs font-bold">
              {{ translateDeliveryType(selectedDelivery.delivery_type) }}
            </span>
          </p>
        </div>

        <h3 class="text-lg font-semibold mt-4 mb-2">Articles Livrés</h3>
        <table class="w-full text-sm border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left border  text-center">Désignation</th>
              <th class="p-2 text-left border   text-center">Code</th>
              <th class="p-2 text-left border   text-center">Numéro Série</th>
              <th class="p-2 text-center border   text-center">Qté Livrée</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in selectedDelivery.items" :key="article.id" class="border-t">
              <td class="p-2 border  text-center">{{ article.designation }}</td>
              <td class="p-2 border  text-center">{{ article.product_code }}</td>
              <td class="p-2 border  text-center">{{ article.serial_number }} </td>
              <td class="p-2 text-center border  text-center">{{ article.quantity_delivered }}</td>
            </tr>
            <tr v-if="!selectedDelivery.items || selectedDelivery.items.length === 0">
              <td colspan="4" class="text-center p-4 text-gray-500">
                Aucun article livré.
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-6 text-right flex justify-between">
           <button @click="downloadDelivery(selectedDelivery)" title="Télécharger" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
                <i class="fas fa-download"></i>
          </button>
          <button @click="closeModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
            Fermer
          </button>

        </div>
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

const stats = computed(() => {
  const allDeliveries = deliveryStore.livraison
  return {
    total: allDeliveries.length,
    complete: allDeliveries.filter(d => d.delivery_type === 'complete').length,
    partial: allDeliveries.filter(d => d.delivery_type === 'partial').length,
  }
})

const filteredDeliveries = computed(() => {
  if (!filterType.value) {
    return deliveryStore.livraison
  }
  return deliveryStore.livraison.filter(
    (d) => d.delivery_type === filterType.value
  )
})

const deliveryTypeClass = (type) => {
  switch (type) {
    case 'complete':
      return 'bg-green-200 text-green-800'
    case 'partial':
      return 'bg-yellow-200 text-yellow-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

const translateDeliveryType = (type) => {
  switch (type) {
    case 'complete':
      return 'Complète'
    case 'partial':
      return 'Partielle'
    default:
      return type
  }
}

function viewDetails(delivery) {
  selectedDelivery.value = delivery
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedDelivery.value = null
}

function downloadDelivery(delivery) {
  deliveryStore.downloadDelivery(delivery)
}

const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')
</script>
