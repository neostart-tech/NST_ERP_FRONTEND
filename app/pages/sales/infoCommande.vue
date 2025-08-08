<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Titre et bouton -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-extrabold text-gray-900">Gestion des Commandes</h1>
      <NuxtLink :to=AppUrl.ORDER
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out" >
        <i class="fas fa-add w-8"></i>Nouvelle commande
      </NuxtLink>
    </div>

    <!-- Section des statistiques (cartes) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class=" flex  gap-4 bg-indigo-100 p-6 rounded-lg text-center shadow-md border-l-4 border-blue-500">
        <i class="fas fa-box text-blue-600 text-3xl "></i><p class="text-sm font-medium text-center text-gray-500">Total des Commandes</p>
        <p class="mt-1 text-4xl  text-center font-extrabold text-gray-900"></p>
      </div>
      <div class="flex gap-4 bg-yellow-100 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
         <i class="fas fa-spinner text-yellow-500 text-3xl  "></i><p class="text-sm font-medium text-center text-gray-500">Commandes En Cours</p>
        <p class="mt-1 text-4xl font-extrabold text-gray-900"></p>
      </div>
      <div flex class=" flex gap-4 bg-green-100 p-6 rounded-lg shadow-md border-l-4 border-green-500">
         <i class="fas fa-check-circle text-green-600 text-3xl "></i><p class="text-sm  text-center font-medium text-gray-500">Commandes Livrées</p>
        <p class="mt-1 text-4xl text-center font-extrabold text-gray-900"></p>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="w-[300px] bg-indigo-100 p-6 rounded-lg shadow-[10px] mb-8 border border-gray-400"> 
    <!-- Filtre par statut -->
      <div class="w-[200px]">
        <label for="status-filter" >Filtrer par statut</label>
        <select id="status-filter" v-model="selectedStatus " class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md  bg-indigo focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Tous les status</option>
          <option value="pending">En attente</option>
          <option value="delivered">Livrée</option>
          <option value="canceled">Annulée</option>
        </select>
      </div>
    </div>

    <!-- Tableau des Commandes -->
    <div class="bg-white  shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-400 rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="border border-gray-400 px-6 py-3 text-center   text-gray-900 uppercase tracking-wider">REF</th>
              <th scope="col" class="border border-gray-400 px-6 py-3 text-center  font-medium text-gray-900 uppercase tracking-wider">Client</th>
              <th scope="col" class="border border-gray-400 px-6 py-3 text-center  font-medium text-gray-900 uppercase tracking-wider">Statut</th>
              <th scope="col" class="border border-gray-400 relative px-6 py-3 text-center"> Actions </th>
              <th scope="col" class="border border-gray-400 relative px-6 py-3 text-center"> Statuts update </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(order, index) in orderStore.commande"  :key="order.id" class="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td class="border border-gray-400 px-6 py-4  text-center text-sm font-medium text-gray-900">
                {{ 'CMD ' + String(orderStore.commande.length - index).padStart(3, '0') }}
              </td>
              <td class="border border-gray-400 px-6 py-4  text-[16px] text-gray-900">{{order.client.last_name}} {{order.client.first_name}}</td>
              <td class="border border-gray-400 px-6 py-4 text-center uppercase">
                <span :class="statusClass(order.status)" class="px-2 py-1 rounded font-semibold">{{ translateStatus(order.status) }}</span>

              </td>

              <!-- <td class="border border-gray-400 border border-gray-400 px-6 py-4  text-sm text-gray-900"></td> -->
              <td class="border border-gray-400 px-6 py-4  text-center text-[16px] font-medium">
               
                <div class="flex items-center justify-center space-x-2">
                  <!-- voir -->
                  <div class="relative group">
                    <button @click="viewOrder(order)" class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
                      <i class="fas fa-eye"></i>
                    </button>
                    <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Voir</span>
                  </div>

                  <!--Télécharger -->
                  <div class="relative group">
                    <button @click="downloadOrder(order.id)" class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out">
                      <i class="fas fa-download"></i>
                       
                       <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24" fill="currentColor">
                        <path d="M224 0C100.3 0 0 100.3 0 224c0 123.7 100.3 224 224 224s224-100.3 224-224C448 100.3 347.7 0 224 0zm0 320v96c0 8.8-7.2 16-16 16s-16-7.2-16-16v-96H112c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V144c0-8.8 7.2-16 16-16s16 7.2 16 16v96h80c8.8 0 16 7.2 16 16s-7.2 16-16 16H224z"/>
                      </svg> -->

                    </button>
                    <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Télécharger pdf</span>
                  </div>


                  <!-- Bouton Modifier -->
                  <div class="relative group">
                    <button @click="editOrder(order.id)" class="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100 transition duration-150 ease-in-out">
                      <i class="fas fa-edit"></i>
                      <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor">
                        <path d="M290.74 93.24l128 128L142.36 497.65a48 48 0 01-21.4 12.14l-107.34 29.26a12 12 0 01-14.75-14.75l29.26-107.34a48 48 0 0112.14-21.4L290.74 93.24zM497.94 74.22l-60.16-60.15a48 48 0 00-67.88 0L303 81.99l128 128 67.88-67.88a48 48 0 000-67.89z"/>
                      </svg>
                      -->
                   </button>
                    <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Modifier</span>
                  </div>

                </div>
              </td>
              <td>       <!-- Changer Statut -->
                  <div class="relative group">
                    <select v-model="order.status" @change="updateStatus(order.id, order.status)" class="text-sm border rounded px-2 py-1">
                      <option value="delivered">Livrée</option>
                      <option value="canceled">Annulée</option>
                    </select>
                  </div>
              </td>
            </tr>
            <!-- <tr v-if="filteredOrders.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500 text-lg">
                <p>Aucune commande trouvée.</p>
                <p class="mt-2 text-sm">Essayez d'ajuster votre recherche ou de créer une nouvelle commande.</p>
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>
<!-- Modal Overlay -->
<div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <!-- Modal Content -->
  <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h3V7l4 4-4 4v-2h-3a2 2 0 00-2 2v2H9z" />
        </svg>
        Détails de la commande
      </h2>
    </div>

    <!-- Client & Infos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
      <p><strong>Client :</strong> {{ selectedOrder.client.last_name }} {{ selectedOrder.client.first_name }}</p>
      <p><strong>Date :</strong> {{ selectedOrder.date }}</p>
      <p><strong>Statut :</strong> <span :class="statusClass(selectedOrder.status)">{{ translateStatus(selectedOrder.status) }}</span></p>
      <p><strong>Montant HT :</strong> <span></span></p>

      <p><strong>Proforma associée :</strong> 
        <span v-if="selectedOrder.proforma">Oui ({{ selectedOrder.proforma.reference }})</span>
        <span v-else class="italic text-gray-500">Aucune</span>
      </p>
    </div>

    <!-- Articles Commande -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">
        Articles de la commande :
      </h3>
      <table class="w-full border rounded overflow-hidden text-sm">
        <thead class="bg-indigo-100">
          <tr>
            <th class="px-3 py-2 text-left">Nom</th>
            <th class="px-3 py-2 text-left">Désignation</th>
            <th class="px-3 py-2 text-left">Quantité</th>
            <th class="px-3 py-2 text-left">Prix Unitaire</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in selectedOrder.articles" :key="item.id" class="border-t">
            <td class="px-3 py-2">{{ item.label }}</td>
            <td class="px-3 py-2">{{ item.description }}</td>
            <td class="px-3 py-2">{{ item.pivot.quantity }}</td>
            <td class="px-3 py-2">{{formatCurrency( item.pivot.unit_price) }} FCFA</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Articles Proforma -->
    <div v-if="selectedOrder.proforma">
      <h3 class="text-lg font-semibold mb-2">Articles de la Proforma</h3>
      <table class="w-full text-sm text-left text-gray-700 border border-gray-300 rounded-lg">
        <thead class="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th scope="col" class="px-4 py-2">Désignation</th>
            <th scope="col" class="px-4 py-2">Quantité</th>
            <th scope="col" class="px-4 py-2">Prix Unitaire</th>
            <th scope="col" class="px-4 py-2">Total </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(article, index) in selectedOrder.proforma.articles"
            :key="index"
            class="border-t border-gray-200"
          >
            <td class="px-4 py-2">{{ article.label }}</td>
            <td class="px-4 py-2">{{ article.pivot.quantity }}</td>
            <td class="px-4 py-2">{{ article.pivot.unit_price }} FCFA</td>
            <td class="px-4 py-2">{{ article.pivot.unit_price * article.pivot.quantity}} FCFA</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-sm text-gray-500">
      Aucune proforma associée.
    </div>

    <!-- Footer -->
    <div class="mt-6 text-right">
      <button @click="closeModal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow-sm">
        Fermer
      </button>
    </div>
  </div>
</div>


      
        <!-- Pagination -->
    <!-- <div class="flex justify-center items-center space-x-4 mt-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Précédent</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Suivant</button>
    </div> -->
  </div>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '#imports'
import {onMounted} from 'vue'

const selectedOrder = ref()
const showModal = ref(false)
import Swal from 'sweetalert2'

const router = useRouter()



const orders = ref([])

const search = ref('')

const orderStore =useOrderStore()
onMounted(()=>{
  orderStore.fetchOrder()
})
const updateStatus = async (orderId, newStatus) => {
  try {
    //  Demande confirmation 
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


//Afficher les details d'une commande
function viewOrder(order) {
  selectedOrder.value = order
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedOrder.value = null
}

// Fonction pour la classe CSS du statut 
const statusClass = (status) => {
  switch (status) {
    case 'pending':      // En attente
      return 'bg-yellow-100 text-yellow-800'
    case 'canceled':     // Annulée
      return 'bg-red-100 text-red-800'
    case 'delivered':     // Livrée
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
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

// Pagination
const itemsPerPage = 3
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(orderStore.commande.length / itemsPerPage)
})
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return orderStore.commande.slice(start, start + itemsPerPage)
})

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)

</script>

