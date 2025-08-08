<template>
  <div class="p-6 space-y-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Proformas</h1>
      <NuxtLink :to=AppUrl.PROPO
        class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
        <i class="fas fa-add"></i>  Nouvelle Proforma
      </NuxtLink>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gray-300 shadow rounded p-4 text-center">
        <p class="text-sm text-gray-500">Total Proformas</p>
        <p class="text-2xl font-bold">{{ stats.total }}</p>
      </div>
      <div class="bg-yellow-200 shadow rounded p-4 text-center">
        <i class="fas fa-pencil-alt text-yellow-500 text-3xl"></i>
        <p class="text-sm text-gray-600">Draft</p>
        <p class="text-2xl font-bold text-yellow-700">{{ stats.draft }}</p>
      </div>
      <div class="bg-green-200 shadow rounded p-4 text-center">
        <i class="fas fa-check-circle text-green-600 text-3xl"></i>
        <p class="text-sm text-gray-600">Validés</p>
        <p class="text-2xl font-bold text-green-700">{{ stats.validated }}</p>
      </div>
      <div class="bg-red-200 shadow rounded p-4 text-center">
        <i class="fas fa-times-circle text-red-600 text-3xl"></i>
        <p class="text-sm text-gray-600">Rejetés</p>
        <p class="text-2xl font-bold text-red-700">{{ stats.rejected }}</p>
      </div>
    </div>

    <!-- TABLEAU -->
    <div class="bg-white shadow rounded overflow-x-auto">
      <table class="w-full text-sm border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-3 py-2 border">Réf</th>
            <th class="px-3 py-2 border">Client</th>
            <th class="px-3 py-2 border">Objet</th>
            <th class="px-3 py-2 border">Montant TTC</th>
            <th class="px-3 py-2 border">Statut</th>
            <th class="px-3 py-2 border">Date</th>
            <th class="px-3 py-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proforma in proformas" :key="proforma.id" class="hover:bg-gray-50">
            <td class="border px-3 py-2">{{ proforma.reference }}</td>
            <td class="border px-3 py-2">{{ proforma.client?.last_name }} {{ proforma.client?.first_name }}</td>
            <td class="border px-3 py-2">{{ proforma.object }}</td>
            <td class="border px-3 py-2">{{ proforma.total_ttc.toLocaleString() }} FCFA</td>
            <td class="border px-3 py-2">
              <span :class="badgeClass(proforma.status)" class="px-2 py-1 rounded text-xs font-bold">
                {{ translateStatus(proforma.status) }}
              </span>
            </td>
            <td class="border px-3 py-2">{{ formatDate(proforma.created_at) }}</td>
            <td class="border px-3 py-2 flex justify-center gap-2">
              <button v-if="proforma.status === 'draft'" @click="updateStatus(proforma.id, 'validated')" class="bg-green-500 text-white px-2 py-1 rounded text-xs">Valider</button>
              <button v-if="proforma.status === 'draft'" @click="updateStatus(proforma.id, 'rejected')" class="bg-red-500 text-white px-2 py-1 rounded text-xs">Rejeter</button>
              <button @click="viewProforma(proforma)" title="Voir" class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">  <i class="fas fa-eye"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
      <h2 class="text-2xl font-bold mb-4 text-indigo-700">Détails de la Proforma</h2>

      <!-- Infos Proforma -->
      <div class="mb-4 space-y-1 text-sm text-gray-700">
        <p><strong>Référence :</strong> {{ selectedProforma.reference }}</p>
        <p><strong>Date :</strong> {{ formatDate(selectedProforma.created_at) }}</p>
        <p><strong>Statut :</strong> {{translateStatus(selectedProforma.status) }}</p>
        <p><strong>Objet :</strong> {{ selectedProforma.object }}</p>
      </div>

      <!-- Client -->
      <div class="mb-4 text-sm text-gray-700">
        <h3 class="font-semibold text-lg mb-2">Client</h3>
        <p>{{ selectedProforma.client.last_name }} {{ selectedProforma.client.first_name }}</p>
      </div>

      <!-- Articles -->
      <div class="overflow-x-auto">
        <h3 class="font-semibold text-lg mb-2">Articles</h3>
        <table class="w-full table-auto border text-sm">
          <thead class="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th class="border px-4 py-2 text-left">Article</th>
              <th class="border px-4 py-2 text-left">Description</th>
              <th class="border px-4 py-2 text-right">Quantité</th>
              <th class="border px-4 py-2 text-right">Prix unitaire</th>
              <th class="border px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in selectedProforma.articles" :key="article.id" class="hover:bg-gray-50">
              <td class="border px-4 py-2">{{ article.label }}</td>
              <td class="border px-4 py-2">{{ article.description }}</td>
              <td class="border px-4 py-2 text-right">{{ article.pivot.quantity }}</td>
              <td class="border px-4 py-2 text-right">{{ formatCurrency(article.pivot.unit_price) }}</td>
              <td class="border px-4 py-2 text-right">
                {{ formatCurrency(article.pivot.quantity * article.pivot.unit_price) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="4" class="text-right font-bold px-4 py-2">Total HT</td>
              <td class="text-right font-bold px-4 py-2">{{ formatCurrency(selectedProforma.total_ht) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="text-right font-bold px-4 py-2">Total TTC</td>
              <td class="text-right font-bold px-4 py-2">{{ formatCurrency(selectedProforma.total_ttc) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="mt-6 flex justify-end">
        <button @click="closeModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProformaStore } from '~/app/stores/proforma'

const proformaStore = useProformaStore()
const proformas = ref([])
const stats = ref({ total: 0, draft: 0, validated: 0, rejected: 0 })
const selectedProforma=ref()
const showModal=ref(false)

onMounted(async () => {
  await proformaStore.fetchProforma()
  proformas.value = proformaStore.proforma
  computeStats()
})

const computeStats = () => {
  stats.value.total = proformas.value.length
  stats.value.draft = proformas.value.filter(p => p.status === 'draft').length
  stats.value.validated = proformas.value.filter(p => p.status === 'validated').length
  stats.value.rejected = proformas.value.filter(p => p.status === 'rejected').length
}

const badgeClass = (status) => {
  return {
    'bg-yellow-200 text-yellow-800': status === 'draft',
    'bg-green-200 text-green-800': status === 'validated',
    'bg-red-200 text-red-800': status === 'rejected'
  }
}
const statusColor=(status)=>{
    switch(status){
        case 'draft':
            return 'bg-yellow-200 text-yellow-100'
        case 'validated':
            return 'bg-gren-200 text-green-800'
        case 'rejected':
            return 'bg-red-200 text-red-800'
    }
}
const translateStatus= (status)=>{
    switch(status){
        case 'draft':
            return 'Non Validée'
        case 'validated':
            return 'Validée'
        case 'rejected':
            return 'Rejettée'
    }
}

const updateStatus = async (id, status) => {
    console.log('Mise à jour du statut : ${status} pour ID ${id');
  await proformaStore.updateStatus(id, status) // PATCH
  await proformaStore.fetchProforma()
  proformas.value = proformaStore.proforma
  computeStats()
}
function viewProforma(proforma){
  selectedProforma.value=proforma
  showModal.value=true

}
function closeModal(){
  showModal.value=false
  selectedProforma.value=null
}
function formatCurrency(amount){
  return new Intl.NumberFormat('fr-FR',
    {
      style:'currency',
      currency:'XOF'
    }
  ).format(amount)
}

const formatDate = (date) => new Date(date).toLocaleDateString()
</script>
