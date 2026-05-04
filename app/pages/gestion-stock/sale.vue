<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- Header -->
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div>
              <h1 class="text-3xl font-bold mb-2">💸 Vente d'un produit (déstockage FIFO)</h1>
              <p class="text-sky-100 text-lg">Gérez vos ventes avec la méthode FIFO</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de vente -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">💰 Vendre un article</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Article *</label>
            <select v-model="vente.product_id" @change="onProductChange" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white">
              <option value="">-- Choisir --</option>
              <option v-for="article in availableProducts" :key="article.id" :value="article.id">
                {{ article.name }} (stock: {{ article.current_stock }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
            <input v-model.number="vente.quantity" type="number" min="1" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix de vente (FCFA) *</label>
            <input v-model.number="vente.selling_price" type="number" step="1" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
            <select v-model="vente.payment_method" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white">
              <option value="">-- Choisir --</option>
              <option value="cash">💵 Espèces</option>
              <option value="card">💳 Carte bancaire</option>
              <option value="transfer">🏦 Virement</option>
              <option value="check">📝 Chèque</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom client</label>
            <input v-model="vente.customer_name" type="text" placeholder="Nom du client" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email client</label>
            <input v-model="vente.customer_email" type="email" placeholder="Email du client" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input v-model="vente.notes" type="text" placeholder="Notes optionnelles" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div class="flex items-end">
            <button @click="validerVente" :disabled="isLoading || !isFormValid" class="bg-sky-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sky-700 transition disabled:opacity-50 shadow-sm">
              {{ isLoading ? 'Vente en cours...' : '💰 Vendre' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Récapitulatif de la vente -->
      <div v-if="resultat" :class="resultat.margin > 0 ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'" class="border-l-4 rounded-xl shadow-md p-6 mb-6">
        <h2 class="font-semibold text-gray-800 mb-3">📊 Récapitulatif de la vente</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">Chiffre d'affaires</p>
            <p class="text-xl font-bold text-gray-800">{{ formatPrice(resultat.total_amount) }} FCFA</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Coût d'achat (FIFO)</p>
            <p class="text-xl font-bold text-gray-800">{{ formatPrice(resultat.total_cost) }} FCFA</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Marge brute</p>
            <p class="text-xl font-bold" :class="resultat.margin > 0 ? 'text-emerald-600' : 'text-red-600'">{{ formatPrice(resultat.margin) }} FCFA</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Taux de marge</p>
            <p class="text-xl font-bold" :class="resultat.margin_percentage > 0 ? 'text-emerald-600' : 'text-red-600'">{{ resultat.margin_percentage }}%</p>
          </div>
        </div>
        <div v-if="resultat.invoice_number" class="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500">
          🧾 Facture: <span class="font-mono font-semibold text-gray-700">{{ resultat.invoice_number }}</span>
        </div>
      </div>

      <!-- Barre de recherche -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
        <div class="flex gap-4">
          <div class="relative flex-1">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="🔍 Rechercher par article, client, facture..." 
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button v-if="searchTerm" @click="searchTerm = ''" class="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">
            ✖️ Effacer
          </button>
        </div>
      </div>

      <!-- Historique des ventes -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">📜 Historique des ventes</h2>
          <div class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Total: {{ totalSalesCount }} ventes
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Facture</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Article</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Qté</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Marge</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(sale, index) in salesPaginated" :key="sale.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-6 py-4 text-sm font-mono font-semibold text-gray-800">{{ sale.invoice_number }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(sale.sale_date) }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-700">{{ sale.product?.name || sale.product_name || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ sale.customer_name || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ sale.quantity }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ formatPrice(sale.total_amount) }} FCFA</td>
                <td class="px-6 py-4 text-sm" :class="(sale.margin || 0) > 0 ? 'text-emerald-600 font-semibold' : 'text-red-600'">
                  {{ sale.margin_percentage ? sale.margin_percentage.toFixed(1) + '%' : '-' }}
                </td>
                <td class="px-6 py-4">
                  <span :class="getPaymentStatusClass(sale.payment_status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ getPaymentStatusLabel(sale.payment_status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button @click="voirDetails(sale)" class="text-sky-600 hover:text-sky-800 transition" title="Voir détails">👁️</button>
                    <button @click="modifierVente(sale)" class="text-indigo-600 hover:text-indigo-800 transition" title="Modifier">✏️</button>
                    <button @click="supprimerVente(sale.id)" class="text-red-500 hover:text-red-700 transition" title="Supprimer" :disabled="isDeleting === sale.id">
                      {{ isDeleting === sale.id ? '...' : '🗑️' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!isLoadingList && salesFiltered.length === 0">
                <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-5xl">💸</span>
                    <p class="font-medium">Aucune vente trouvée</p>
                    <p class="text-xs text-gray-400">Effectuez votre première vente ci-dessus</p>
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
                    <span>Chargement...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ salesFiltered.length }} ventes
          </div>
          <div class="flex gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              ← Précédent
            </button>
            <span class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
              Page {{ currentPage }} / {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
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
          <h3 class="text-xl font-bold text-gray-900">📄 Détails de la vente</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-3">
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Facture :</span><span class="text-gray-800 font-mono">{{ selectedSale?.invoice_number }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Date :</span><span class="text-gray-800">{{ formatDate(selectedSale?.sale_date) }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Article :</span><span class="text-gray-800">{{ selectedSale?.product?.name || selectedSale?.product_name }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Quantité :</span><span class="text-gray-800">{{ selectedSale?.quantity }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Prix unitaire :</span><span class="text-gray-800">{{ formatPrice(selectedSale?.selling_price) }} FCFA</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Total :</span><span class="text-gray-800">{{ formatPrice(selectedSale?.total_amount) }} FCFA</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Coût d'achat :</span><span class="text-gray-800">{{ formatPrice(selectedSale?.cost_amount) }} FCFA</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Marge :</span><span class="text-gray-800" :class="(selectedSale?.margin || 0) > 0 ? 'text-emerald-600' : 'text-red-600'">{{ formatPrice(selectedSale?.margin) }} FCFA ({{ selectedSale?.margin_percentage?.toFixed(1) }}%)</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Client :</span><span class="text-gray-800">{{ selectedSale?.customer_name || '-' }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Email :</span><span class="text-gray-800">{{ selectedSale?.customer_email || '-' }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Paiement :</span><span class="text-gray-800">{{ getPaymentMethodLabel(selectedSale?.payment_method) }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Statut :</span><span class="text-gray-800">{{ getPaymentStatusLabel(selectedSale?.payment_status) }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-36 text-gray-600">Notes :</span><span class="text-gray-800">{{ selectedSale?.notes || '-' }}</span></div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button @click="showDetailsModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition font-medium">Fermer</button>
        </div>
      </div>
    </div>

    <!-- Modal Modification -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showEditModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h3 class="text-xl font-bold text-gray-900">✏️ Modifier la vente</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut de paiement</label>
            <select v-model="editSale.payment_status" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
              <option value="pending">⏳ En attente</option>
              <option value="paid">✅ Payé</option>
              <option value="cancelled">❌ Annulé</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom client</label>
            <input v-model="editSale.customer_name" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email client</label>
            <input v-model="editSale.customer_email" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea v-model="editSale.notes" rows="2" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"></textarea>
          </div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button @click="showEditModal = false" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">Annuler</button>
          <button @click="mettreAJourVente" :disabled="isUpdating" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50 font-medium">
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
const isLoadingProducts = ref(false)
const isLoadingList = ref(false)
const isDeleting = ref(null)
const isUpdating = ref(false)
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const searchTerm = ref('')

// Données API
const availableProducts = ref([])
const sales = ref([])
const salesPagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15
})

// Formulaire de vente
const vente = ref({
  product_id: '',
  quantity: 1,
  selling_price: 0,
  customer_name: '',
  customer_email: '',
  payment_method: '',
  notes: ''
})

const resultat = ref(null)

// Modals
const selectedSale = ref(null)
const editSale = ref({
  id: null,
  payment_status: '',
  customer_name: '',
  customer_email: '',
  notes: ''
})

// Validation
const isFormValid = computed(() => {
  return vente.value.product_id && 
         vente.value.quantity > 0 && 
         vente.value.selling_price > 0
})

// Helper functions
const formatPrice = (price) => {
  if (!price && price !== 0) return '0'
  return Math.round(parseFloat(price)).toLocaleString('fr-FR')
}

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})
}

const getPaymentStatusLabel = (status) => {
  const labels = {
    'pending': '⏳ En attente',
    'paid': '✅ Payé',
    'cancelled': '❌ Annulé'
  }
  return labels[status] || status
}

const getPaymentStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'paid': 'bg-emerald-100 text-emerald-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentMethodLabel = (method) => {
  const labels = {
    'cash': '💵 Espèces',
    'card': '💳 Carte bancaire',
    'transfer': '🏦 Virement',
    'check': '📝 Chèque'
  }
  return labels[method] || method || '-'
}

// Sélection automatique
const onProductChange = () => {
  if (vente.value.product_id) {
    const selectedProduct = availableProducts.value.find(p => p.id === parseInt(vente.value.product_id))
    if (selectedProduct && selectedProduct.selling_price) {
      vente.value.selling_price = selectedProduct.selling_price
    }
  }
}

// Charger les produits disponibles
const chargerAvailableProducts = async () => {
  isLoadingProducts.value = true
  try {
    const response = await api.get('/sales/available-products')
    
    if (response.data.success) {
      availableProducts.value = response.data.data || []
    } else {
      availableProducts.value = []
    }
  } catch (error) {
    console.error('Erreur chargement produits:', error)
    availableProducts.value = []
  } finally {
    isLoadingProducts.value = false
  }
}

// Charger les ventes - CORRECTION IMPORTANTE
const chargerSales = async () => {
  isLoadingList.value = true
  try {
    const response = await api.get('/sales')
    
    console.log('📥 Réponse API ventes:', response.data)
    
    if (response.data && response.data.success) {
      // Le backend retourne un objet paginé: { success: true, data: { current_page, data, total, ... } }
      if (response.data.data && response.data.data.data) {
        // Format Laravel pagination
        sales.value = response.data.data.data
        salesPagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
          per_page: response.data.data.per_page
        }
      } else if (Array.isArray(response.data.data)) {
        // Format simple
        sales.value = response.data.data
      } else {
        sales.value = []
      }
      
      console.log('✅ Ventes chargées:', sales.value.length)
    } else {
      console.warn('⚠️ Réponse API sans succès:', response.data)
      sales.value = []
    }
  } catch (error) {
    console.error('❌ Erreur chargement ventes:', error)
    sales.value = []
  } finally {
    isLoadingList.value = false
  }
}

// Valider une vente
const validerVente = async () => {
  if (!vente.value.product_id) {
    alert("Veuillez sélectionner un article")
    return
  }
  if (vente.value.quantity <= 0) {
    alert("La quantité doit être supérieure à 0")
    return
  }
  if (vente.value.selling_price <= 0) {
    alert("Le prix de vente doit être supérieur à 0")
    return
  }

  isLoading.value = true
  try {
    const response = await api.post('/sales', {
      product_id: parseInt(vente.value.product_id),
      quantity: parseInt(vente.value.quantity),
      selling_price: parseFloat(vente.value.selling_price),
      customer_name: vente.value.customer_name || null,
      customer_email: vente.value.customer_email || null,
      payment_method: vente.value.payment_method || null,
      notes: vente.value.notes || null
    })

    if (response.data && response.data.success) {
      resultat.value = response.data.sale_details
      if (response.data.data && response.data.data.invoice_number) {
        resultat.value.invoice_number = response.data.data.invoice_number
      }
      
      alert(`✅ Vente effectuée avec succès !\n\nFacture: ${resultat.value.invoice_number || 'N/A'}\n💰 Marge: ${formatPrice(resultat.value.margin || 0)} FCFA (${resultat.value.margin_percentage || 0}%)`)
      
      // Réinitialiser le formulaire
      vente.value = {
        product_id: '',
        quantity: 1,
        selling_price: 0,
        customer_name: '',
        customer_email: '',
        payment_method: '',
        notes: ''
      }
      
      // Recharger les données
      await chargerAvailableProducts()
      await chargerSales()
      currentPage.value = 1
      
      // Effacer le résultat après 10 secondes
      setTimeout(() => {
        resultat.value = null
      }, 10000)
    } else {
      alert('❌ ' + (response.data?.message || 'Erreur lors de la vente'))
    }
  } catch (error) {
    console.error('❌ Erreur vente:', error)
    let errorMessage = 'Erreur lors de la vente'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error
    }
    alert(`❌ ${errorMessage}`)
  } finally {
    isLoading.value = false
  }
}

// Voir détails
const voirDetails = (sale) => {
  selectedSale.value = sale
  showDetailsModal.value = true
}

// Modifier une vente
const modifierVente = (sale) => {
  editSale.value = {
    id: sale.id,
    payment_status: sale.payment_status || 'pending',
    customer_name: sale.customer_name || '',
    customer_email: sale.customer_email || '',
    notes: sale.notes || ''
  }
  showEditModal.value = true
}

// Mettre à jour une vente
const mettreAJourVente = async () => {
  isUpdating.value = true
  try {
    const response = await api.put(`/sales/${editSale.value.id}`, {
      payment_status: editSale.value.payment_status,
      customer_name: editSale.value.customer_name || null,
      customer_email: editSale.value.customer_email || null,
      notes: editSale.value.notes || null
    })

    if (response.data && response.data.success) {
      alert('✅ Vente modifiée avec succès')
      showEditModal.value = false
      await chargerSales()
    } else {
      alert('❌ ' + (response.data?.message || 'Erreur lors de la modification'))
    }
  } catch (error) {
    console.error('Erreur modification:', error)
    alert('Erreur lors de la modification: ' + (error.response?.data?.message || error.message))
  } finally {
    isUpdating.value = false
  }
}

// Supprimer une vente
const supprimerVente = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette vente ? Cette action restaurera le stock.')) return

  isDeleting.value = id
  try {
    const response = await api.delete(`/sales/${id}`)
    if (response.data && response.data.success) {
      alert('✅ Vente supprimée avec succès')
      await chargerSales()
      await chargerAvailableProducts()
      
      if (salesPaginated.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    } else {
      alert('❌ ' + (response.data?.message || 'Erreur lors de la suppression'))
    }
  } catch (error) {
    console.error('Erreur suppression:', error)
    alert('Erreur lors de la suppression: ' + (error.response?.data?.message || error.message))
  } finally {
    isDeleting.value = null
  }
}

// Filtre par recherche
const salesFiltered = computed(() => {
  let filtered = sales.value
  if (searchTerm.value && sales.value.length > 0) {
    const search = searchTerm.value.toLowerCase()
    filtered = sales.value.filter(sale => 
      (sale.invoice_number && sale.invoice_number.toLowerCase().includes(search)) ||
      (sale.product?.name && sale.product.name.toLowerCase().includes(search)) ||
      (sale.product_name && sale.product_name.toLowerCase().includes(search)) ||
      (sale.customer_name && sale.customer_name.toLowerCase().includes(search))
    )
  }
  return filtered
})

// Total des ventes après filtre
const totalSalesCount = computed(() => salesFiltered.value.length)

// Pagination
const totalPages = computed(() => Math.ceil(salesFiltered.value.length / itemsPerPage) || 1)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, salesFiltered.value.length))

const salesPaginated = computed(() => {
  return salesFiltered.value.slice(startIndex.value, endIndex.value)
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
  await chargerAvailableProducts()
  await chargerSales()
})
</script>