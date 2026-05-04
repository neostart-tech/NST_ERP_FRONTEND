<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- Header dégradé sky -->
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div>
              <h1 class="text-3xl font-bold mb-2">📥 Réception de commande & création de lot</h1>
              <p class="text-sky-100 text-lg">Gérez vos lots en stock avec la méthode FIFO</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de réception -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">📦 Réceptionner une commande</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Champ de recherche bon de commande -->
          <div class="lg:col-span-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Bon de commande *</label>
            <div class="relative">
              <input 
                v-model="searchOrderTerm"
                type="text"
                @focus="showOrderDropdown = true"
                @blur="closeOrderDropdown"
                @input="filterOrders"
                @keydown.enter.prevent="selectFirstOrder"
                placeholder="🔍 Rechercher un bon de commande livré..."
                class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <div v-if="showOrderDropdown && filteredOrders.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                <div
                  v-for="order in filteredOrders"
                  :key="order.id"
                  @mousedown.prevent="selectOrder(order)"
                  class="px-4 py-2 hover:bg-sky-50 cursor-pointer transition border-b border-gray-100 last:border-0"
                >
                  <div class="font-medium text-gray-800">{{ order.order_number }}</div>
                  <div class="text-xs text-gray-500">
                    {{ order.product_name }} - {{ order.quantity }} unités - {{ order.supplier_name }}
                  </div>
                </div>
              </div>
            </div>
            <p v-if="deliveredOrders.length === 0 && !isLoadingOrders" class="text-xs text-amber-600 mt-1">
              ⚠️ Aucun bon de commande livré trouvé.
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de lot *</label>
            <input v-model="newBatch.batch_number" type="text" placeholder="Ex: LOT-2026-001" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantité à lotir *</label>
            <input v-model="newBatch.quantity" type="number" min="1" :max="maxQuantity" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
            <p v-if="selectedOrderInfo && newBatch.quantity > maxQuantity" class="text-xs text-red-500 mt-1">
              ⚠️ Quantité maximale disponible: {{ maxQuantity }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
            <input 
              v-model="newBatch.expiry_date" 
              type="date" 
              :min="todayDate"
              class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-400 mt-1">Optionnel - Laissez vide si pas d'expiration</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix d'achat (FCFA)</label>
            <input 
              v-model="newBatch.purchase_price" 
              type="number" 
              min="0" 
step="1"
              :placeholder="selectedOrderUnitPrice ? `Prix unitaire: ${formatPrice(selectedOrderUnitPrice)}` : 'Auto-calculé'"
              class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-gray-50"
              readonly
            />
            <p class="text-xs text-gray-400 mt-1">Prix automatique depuis la commande</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
            <input v-model="newBatch.location" type="text" placeholder="Ex: Entrepôt A - Étagère 1" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input v-model="newBatch.notes" type="text" placeholder="Notes optionnelles" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div class="flex items-end">
            <button @click="creerLot" :disabled="isLoading || !isFormValid" class="bg-sky-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
              {{ isLoading ? 'Création...' : '📦 Créer le lot' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Barre de recherche -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
        <div class="flex gap-4">
          <div class="relative flex-1">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="🔍 Rechercher par numéro de lot, article, fournisseur..." 
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button 
            v-if="searchTerm"
            @click="searchTerm = ''" 
            class="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
          >
            ✖️ Effacer
          </button>
        </div>
      </div>

      <!-- Lots en stock -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">📋 Lots en stock</h2>
          <div class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Total: {{ batchesFiltered.length }} lots
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Lot</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Article</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fournisseur</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quantité</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Prix achat</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date réception</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Expiration</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(batch, index) in batchesPaginated" :key="batch.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-6 py-4 text-sm font-mono font-semibold text-gray-800">{{ batch.batch_number }}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ batch.product?.name || batch.product_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ batch.supplier?.name || batch.supplier_name }}</td>
                <td class="px-6 py-4 text-sm">
                  <span class="font-medium text-sky-600">{{ batch.remaining_quantity || batch.quantity }}</span>
                  <span class="text-gray-400"> / {{ batch.quantity }}</span>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-sky-600">{{ formatPrice(batch.purchase_price) }} FCFA</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(batch.received_date) }}</td>
                <td class="px-6 py-4 text-sm">
                  <span :class="getExpiryClass(batch.expiry_date)">
                    {{ batch.expiry_date ? formatDate(batch.expiry_date) : '-' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(batch.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ getStatusLabel(batch.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button @click="voirDetails(batch)" class="text-sky-600 hover:text-sky-800 transition" title="Voir détails">👁️</button>
                    <button @click="modifierLot(batch)" class="text-indigo-600 hover:text-indigo-800 transition" title="Modifier">✏️</button>
                    <button @click="supprimerLot(batch.id)" class="text-red-500 hover:text-red-700 transition" title="Supprimer" :disabled="isDeleting === batch.id">
                      {{ isDeleting === batch.id ? '...' : '🗑️' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="batchesFiltered.length === 0 && !isLoadingList">
                <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-5xl">📦</span>
                    <p class="font-medium">Aucun lot trouvé</p>
                    <p class="text-xs text-gray-400">Commencez par réceptionner une commande</p>
                  </div>
                </td>
               </tr>
              <tr v-if="isLoadingList">
                <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex justify-center items-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Chargement des lots...</span>
                  </div>
                </td>
               </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ batchesFiltered.length }} lots
          </div>
          <div class="flex gap-2">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Précédent
            </button>
            <span class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
              Page {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showDetailsModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 class="text-xl font-bold text-gray-900">📄 Détails du lot</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-3">
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">ID :</span><span class="text-gray-800">{{ selectedBatch?.id }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Numéro lot :</span><span class="text-gray-800 font-mono font-semibold">{{ selectedBatch?.batch_number }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Article :</span><span class="text-gray-800">{{ selectedBatch?.product?.name || selectedBatch?.product_name }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Fournisseur :</span><span class="text-gray-800">{{ selectedBatch?.supplier?.name || selectedBatch?.supplier_name }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Quantité :</span><span class="text-gray-800">{{ selectedBatch?.remaining_quantity || selectedBatch?.quantity }} / {{ selectedBatch?.quantity }} unités</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Prix achat :</span><span class="text-gray-800 font-semibold text-sky-600">{{ formatPrice(selectedBatch?.purchase_price) }} FCFA</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Date réception :</span><span class="text-gray-800">{{ formatDate(selectedBatch?.received_date) }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Date expiration :</span><span class="text-gray-800" :class="getExpiryClass(selectedBatch?.expiry_date)">{{ selectedBatch?.expiry_date ? formatDate(selectedBatch.expiry_date) : '-' }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Emplacement :</span><span class="text-gray-800">{{ selectedBatch?.location || '-' }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Statut :</span><span class="text-gray-800">{{ getStatusLabel(selectedBatch?.status) }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Notes :</span><span class="text-gray-800">{{ selectedBatch?.notes || '-' }}</span></div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button @click="showDetailsModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition font-medium">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Modification -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showEditModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h3 class="text-xl font-bold text-gray-900">✏️ Modifier le lot</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de lot</label>
            <input v-model="editBatch.batch_number" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
            <input v-model="editBatch.quantity" type="number" min="0" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix achat (FCFA)</label>
            <input v-model="editBatch.purchase_price" type="number" min="0" step="0.01" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
            <input v-model="editBatch.expiry_date" type="date" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
            <input v-model="editBatch.location" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select v-model="editBatch.status" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white">
              <option value="in_stock">📦 En stock</option>
              <option value="partial_used">⚠️ Partiellement utilisé</option>
              <option value="empty">✅ Épuisé</option>
              <option value="expired">❌ Expiré</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea v-model="editBatch.notes" rows="2" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"></textarea>
          </div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button @click="closeEditModal" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
            Annuler
          </button>
          <button @click="mettreAJourLot" :disabled="isUpdating" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50 font-medium">
            {{ isUpdating ? 'Mise à jour...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Configuration Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Pagination
const itemsPerPage = 10
const currentPage = ref(1)

// États
const isLoading = ref(false)
const isLoadingList = ref(false)
const isLoadingOrders = ref(false)
const isDeleting = ref(null)
const isUpdating = ref(false)
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const searchTerm = ref('')

// Données API
const deliveredOrders = ref([])
const batches = ref([])

// États pour la recherche de bon de commande
const searchOrderTerm = ref('')
const showOrderDropdown = ref(false)
const filteredOrders = ref([])
const selectedOrderId = ref('')
const selectedOrderInfo = ref('')
const selectedOrderUnitPrice = ref(0)
const maxQuantity = ref(0)

// Date du jour pour le min de date picker
const todayDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Nouveau lot
const newBatch = ref({
  purchase_order_id: '',
  batch_number: '',
  quantity: 0,
  expiry_date: '',
  location: '',
  notes: '',
  purchase_price: 0
})

// Validation du formulaire
const isFormValid = computed(() => {
  return selectedOrderId.value && 
         newBatch.value.batch_number && 
         newBatch.value.batch_number.trim() !== '' &&
         newBatch.value.quantity > 0 &&
         newBatch.value.quantity <= maxQuantity.value
})

// Modal sélection
const selectedBatch = ref(null)

// Édition
const editBatch = ref({
  id: null,
  batch_number: '',
  quantity: 0,
  purchase_price: 0,
  expiry_date: '',
  location: '',
  status: '',
  notes: ''
})

// Helper functions
const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Math.round(parseFloat(price)).toLocaleString('fr-FR')
}

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR')
}

const getExpiryClass = (expiryDate) => {
  if (!expiryDate) return 'text-gray-400'
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600 font-bold'
  if (diffDays < 30) return 'text-amber-600 font-semibold'
  return 'text-emerald-600'
}

const getStatusLabel = (status) => {
  const labels = {
    'in_stock': '📦 En stock',
    'partial_used': '⚠️ Partiellement utilisé',
    'empty': '✅ Épuisé',
    'expired': '❌ Expiré'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'in_stock': 'bg-emerald-100 text-emerald-800',
    'partial_used': 'bg-amber-100 text-amber-800',
    'empty': 'bg-gray-100 text-gray-800',
    'expired': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Filtrer les commandes
const filterOrders = () => {
  if (!searchOrderTerm.value) {
    filteredOrders.value = deliveredOrders.value
  } else {
    const search = searchOrderTerm.value.toLowerCase()
    filteredOrders.value = deliveredOrders.value.filter(order => 
      order.order_number?.toLowerCase().includes(search) ||
      order.product_name?.toLowerCase().includes(search) ||
      order.supplier_name?.toLowerCase().includes(search)
    )
  }
}

// Sélectionner la première commande
const selectFirstOrder = () => {
  if (filteredOrders.value.length > 0) {
    selectOrder(filteredOrders.value[0])
  }
}

// Sélectionner une commande
const selectOrder = (order) => {
  selectedOrderId.value = order.id
  selectedOrderInfo.value = `${order.order_number} - ${order.product_name} (${order.quantity} unités) - ${order.supplier_name}`
  searchOrderTerm.value = selectedOrderInfo.value
  newBatch.value.purchase_order_id = order.id
  newBatch.value.purchase_price = order.unit_price || 0
  selectedOrderUnitPrice.value = order.unit_price || 0
  maxQuantity.value = order.quantity || 0
  showOrderDropdown.value = false
}

// Fermer le dropdown
const closeOrderDropdown = () => {
  setTimeout(() => {
    showOrderDropdown.value = false
  }, 200)
}

// Fermer le modal d'édition
const closeEditModal = () => {
  showEditModal.value = false
  editBatch.value = {
    id: null,
    batch_number: '',
    quantity: 0,
    purchase_price: 0,
    expiry_date: '',
    location: '',
    status: '',
    notes: ''
  }
}

// Charger les commandes livrées
const chargerDeliveredOrders = async () => {
  isLoadingOrders.value = true
  try {
    const response = await api.get('/batches/delivered-orders')
    
    if (response.data.success) {
      deliveredOrders.value = response.data.data || []
      filteredOrders.value = deliveredOrders.value
      console.log('Commandes livrées chargées:', deliveredOrders.value.length)
    } else {
      deliveredOrders.value = []
    }
  } catch (error) {
    console.error('Erreur chargement commandes livrées:', error)
    deliveredOrders.value = []
  } finally {
    isLoadingOrders.value = false
  }
}

// Charger les lots
const chargerBatches = async () => {
  isLoadingList.value = true
  try {
    const response = await api.get('/batches')
    
    if (response.data.success) {
      batches.value = response.data.data.data || response.data.data || []
      console.log('Lots chargés:', batches.value.length)
    } else {
      batches.value = []
    }
  } catch (error) {
    console.error('Erreur chargement lots:', error)
    batches.value = []
  } finally {
    isLoadingList.value = false
  }
}

// Créer un lot
const creerLot = async () => {
  if (!isFormValid.value) {
    alert("Veuillez remplir tous les champs obligatoires")
    return
  }

  isLoading.value = true
  try {
    const payload = {
      purchase_order_id: parseInt(selectedOrderId.value),
      batch_number: newBatch.value.batch_number.trim(),
      quantity: parseInt(newBatch.value.quantity),
      purchase_price: selectedOrderUnitPrice.value,
      expiry_date: newBatch.value.expiry_date || null,
      location: newBatch.value.location || null,
      notes: newBatch.value.notes || null
    }
    
    console.log('Envoi payload:', payload)
    
    const response = await api.post('/batches', payload)

    if (response.data.success) {
      alert(`✅ Lot ${newBatch.value.batch_number} créé avec succès !`)
      
      // Reset
      selectedOrderId.value = ''
      selectedOrderInfo.value = ''
      searchOrderTerm.value = ''
      selectedOrderUnitPrice.value = 0
      maxQuantity.value = 0
      newBatch.value = {
        purchase_order_id: '',
        batch_number: '',
        quantity: 0,
        expiry_date: '',
        location: '',
        notes: '',
        purchase_price: 0
      }
      
      await chargerBatches()
      await chargerDeliveredOrders()
      currentPage.value = 1
    } else {
      alert('❌ ' + (response.data.message || 'Erreur lors de la création'))
    }
  } catch (error) {
    console.error('Erreur création lot:', error)
    
    let errorMessage = 'Erreur lors de la création du lot'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      errorMessage = errors.join('\n')
    } else if (error.message) {
      errorMessage = error.message
    }
    alert(`❌ ${errorMessage}`)
  } finally {
    isLoading.value = false
  }
}

// Voir détails
const voirDetails = (batch) => {
  selectedBatch.value = batch
  showDetailsModal.value = true
}

// Modifier un lot
const modifierLot = (batch) => {
  editBatch.value = {
    id: batch.id,
    batch_number: batch.batch_number,
    quantity: batch.quantity,
    purchase_price: batch.purchase_price,
    expiry_date: batch.expiry_date || '',
    location: batch.location || '',
    status: batch.status,
    notes: batch.notes || ''
  }
  showEditModal.value = true
}

// Mettre à jour un lot
const mettreAJourLot = async () => {
  if (!editBatch.value.batch_number || editBatch.value.batch_number.trim() === '') {
    alert("Veuillez saisir un numéro de lot")
    return
  }
  
  if (editBatch.value.quantity < 0) {
    alert("Veuillez saisir une quantité valide")
    return
  }

  const updateData = {
    batch_number: editBatch.value.batch_number.trim(),
    quantity: parseInt(editBatch.value.quantity),
    purchase_price: parseFloat(editBatch.value.purchase_price),
    status: editBatch.value.status
  }
  
  if (editBatch.value.expiry_date) {
    updateData.expiry_date = editBatch.value.expiry_date
  } else {
    updateData.expiry_date = null
  }
  
  if (editBatch.value.location) {
    updateData.location = editBatch.value.location
  }
  
  if (editBatch.value.notes) {
    updateData.notes = editBatch.value.notes
  }

  isUpdating.value = true
  try {
    const response = await api.put(`/batches/${editBatch.value.id}`, updateData)

    if (response.data.success) {
      alert('✅ Lot modifié avec succès')
      closeEditModal()
      await chargerBatches()
    } else {
      alert('❌ ' + (response.data.message || 'Erreur lors de la modification'))
    }
  } catch (error) {
    console.error('Erreur modification:', error)
    let errorMessage = 'Erreur lors de la modification du lot'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      errorMessage = errors.join('\n')
    }
    
    alert(`❌ ${errorMessage}`)
  } finally {
    isUpdating.value = false
  }
}

// Supprimer un lot
const supprimerLot = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce lot ? Cette action est irréversible.')) return

  isDeleting.value = id
  try {
    const response = await api.delete(`/batches/${id}`)
    if (response.data.success) {
      alert('✅ Lot supprimé avec succès')
      await chargerBatches()
      await chargerDeliveredOrders()
      
      if (batchesPaginated.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    }
  } catch (error) {
    console.error('Erreur suppression:', error)
    alert('Erreur lors de la suppression du lot')
  } finally {
    isDeleting.value = null
  }
}

// Filtre par recherche
const batchesFiltered = computed(() => {
  let filtered = batches.value
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = batches.value.filter(batch => 
      batch.batch_number?.toLowerCase().includes(search) ||
      batch.product?.name?.toLowerCase().includes(search) ||
      batch.supplier?.name?.toLowerCase().includes(search) ||
      batch.product_name?.toLowerCase().includes(search) ||
      batch.supplier_name?.toLowerCase().includes(search)
    )
  }
  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(batchesFiltered.value.length / itemsPerPage) || 1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, batchesFiltered.value.length))

const batchesPaginated = computed(() => {
  return batchesFiltered.value.slice(startIndex.value, endIndex.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Chargement initial
onMounted(async () => {
  await chargerDeliveredOrders()
  await chargerBatches()
})
</script>