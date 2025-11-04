<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-extrabold text-gray-900">Gestion des Commandes</h1>
      <NuxtLink :to=AppUrl.ORDER class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
        <i class="fas fa-add"></i> Nouvelle commande
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-gray-300 shadow rounded p-4 text-center">
        <i class="fas fa-info-circle text-gray-500 text-3xl"></i>
        <p class="text-sm text-gray-500">Total Commandes</p>
        <p class="text-2xl font-bold">{{ stats.total }}</p>
      </div>
      <div class="bg-yellow-200 shadow rounded p-4 text-center">
        <i class="fas fa-spinner text-yellow-500 text-3xl"></i>
        <p class="text-sm text-gray-600">En Cours</p>
        <p class="text-2xl font-bold text-yellow-700">{{ stats.pending }}</p>
      </div>
      <div class="bg-green-200 shadow rounded p-4 text-center">
        <i class="fas fa-check-circle text-green-600 text-3xl"></i>
        <p class="text-sm text-gray-600">Livrées</p>
        <p class="text-2xl font-bold text-green-700">{{ stats.delivered }}</p>
      </div>
      <div class="bg-red-200 shadow rounded p-4 text-center">
        <i class="fas fa-times-circle text-red-600 text-3xl"></i>
        <p class="text-sm text-gray-600">Annulées</p>
        <p class="text-2xl font-bold text-red-700">{{ stats.canceled }}</p>
      </div>
    </div>

    <div class="flex justify-between items-center mb-8">
      <div class="w-1/3">
        <label for="status-filter" class="sr-only">Filtrer par statut</label>
        <select id="status-filter" v-model="selectedStatus" class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="delivered">Livrée</option>
          <option value="canceled">Annulée</option>
        </select>
      </div>
    </div>

    <div class="bg-white shadow rounded overflow-x-auto">
      <table class="w-full text-sm border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-3 py-2 border">REF</th>
            <th class="px-3 py-2 border">Client</th>
            <th class="px-3 py-2 border">Statut</th>
            <th class="px-3 py-2 border text-center">Actions</th>
            <th class="px-3 py-2 border text-center">Modifier Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="border px-3 py-2 text-center"></td>
            <td class="border px-3 py-2 text-center"> </td>
            <td class="border px-3 py-2 text-center">
              <span :class="statusClass(order.status)" class="px-2 py-1 rounded text-xs font-bold">{{ translateStatus(order.status) }}</span>
            </td>
            <td class="border px-3 py-2 flex justify-center gap-2">
              <button @click="viewOrder(order)" title="Voir" class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
                <i class="fas fa-eye"></i>
              </button>
              <!-- <button @click="downloadOrder(order)" title="Télécharger" class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out">
                <i class="fas fa-download"></i>
              </button>
              <button @click="editOrder(order.id)" title="Modifier" class="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100 transition duration-150 ease-in-out">
                <i class="fas fa-edit"></i>
              </button> -->
            </td>
            <td class="border px-3 py-2 text-center">
              <select v-model="order.status" @change="updateStatus(order.id, order.status)" class="text-sm border rounded px-2 py-1">
                <option value="pending">En attente</option>
                <option value="delivered">Livrée</option>
                <option value="canceled">Annulée</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredOrders.length === 0" class="text-center py-8 text-gray-500">
        <p>Aucune commande trouvée.</p>
      </div>
    </div>

    <div v-if="showModal && selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="text-2xl font-bold mb-4 text-indigo-700">Détails de la Commande</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <p><strong>Référence :</strong> </p>
          <p><strong>Client :</strong> {{ selectedOrder.client.name }} </p>
          <p><strong>Date :</strong> {{ formatDate(selectedOrder.created_at) }}</p>
          <p><strong>Statut :</strong> <span :class="statusClass(selectedOrder.status)">{{ translateStatus(selectedOrder.status) }}</span></p>
          <p><strong>Proforma associée :</strong>
            <span v-if="selectedOrder.proforma">Oui ({{ selectedOrder.proforma.reference }})</span>
            <span v-else class="italic text-gray-500">Aucune</span>
          </p>
        </div>

        <h3 class="font-semibold text-lg mb-2">Articles de la commande</h3>
        <table class="w-full text-sm border">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left border">Article</th>
              <th class="px-4 py-2 text-left border">Description</th>
              <th class="px-4 py-2 text-right border">Quantité</th>
              <th class="px-4 py-2 text-right border">Prix Unitaire</th>
              <th class="px-4 py-2 text-right border">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in selectedOrder.articles" :key="article.id" class="border-t">
              <td class="px-4 py-2 border">{{ article.label }}</td>
              <td class="px-4 py-2 border">{{ article.description }}</td>
              <td class="px-4 py-2 text-right border">{{ article.pivot.quantity }}</td>
              <td class="px-4 py-2 text-right border">{{ formatCurrency(article.pivot.unit_price) }}</td>
              <td class="px-4 py-2 text-right border">{{ formatCurrency(article.pivot.quantity * article.pivot.unit_price) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-6 flex justify-end">
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
import { useRouter } from 'vue-router'
import { useOrderStore } from '#imports'
import Swal from 'sweetalert2'

const router = useRouter()
const orderStore = useOrderStore()

const selectedOrder = ref(null)
const showModal = ref(false)
const selectedStatus = ref('')
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  await orderStore.fetchOrder()
  isLoading.value = false
})

const stats = computed(() => {
  const allOrders = orderStore.commande
  return {
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    canceled: allOrders.filter(o => o.status === 'canceled').length,
  }
})

const filteredOrders = computed(() => {
  if (!selectedStatus.value) {
    return orderStore.commande.map((order, index) => ({
      ...order,
     
    }))
  }
  return orderStore.commande
    .filter(order => order.status === selectedStatus.value)
    .map((order, index) => ({
      ...order,
    }))
})

const updateStatus = async (orderId, newStatus) => {
  try {
    const confirm = await Swal.fire({
      title: 'Confirmer la mise à jour',
      text: `Voulez-vous vraiment changer le statut en "${translateStatus(newStatus)}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, changer',
      cancelButtonText: 'Annuler',
    })

    if (!confirm.isConfirmed) return

    await orderStore.updateStatus(orderId, newStatus)
    Swal.fire('Succès', 'Statut mis à jour avec succès.', 'success')
  } catch (error) {
    console.error(error)
    Swal.fire('Erreur', "Impossible de mettre à jour le statut", 'error')
  }
}

const viewOrder = (order) => {
  selectedOrder.value = order
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedOrder.value = null
}

const downloadOrder = (order) => {
  orderStore.downloadOrder(order)
}

const editOrder = (id) => {
  router.push(`/orders/${id}/edit`)
}

const statusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-200 text-yellow-800'
    case 'canceled':
      return 'bg-red-200 text-red-800'
    case 'delivered':
      return 'bg-green-200 text-green-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

const translateStatus = (status) => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'canceled':
      return 'Annulée'
    case 'delivered':
      return 'Livrée'
    default:
      return status
  }
}

const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
const formatDate = (date) => new Date(date).toLocaleDateString()
</script>