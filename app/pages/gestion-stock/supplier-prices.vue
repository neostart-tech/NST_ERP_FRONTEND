<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- Header dégradé sky -->
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div>
              <h1 class="text-3xl font-bold mb-2">💰 Prix par fournisseur</h1>
              <p class="text-sky-100 text-lg">Gérez les prix d'achat de vos articles par fournisseur</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire d'association -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">🔗 Associer un prix (article + fournisseur)</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Champ de recherche article avec autocomplétion -->
          <div class="relative">
            <input 
              v-model="searchArticleTerm"
              type="text"
              @focus="showArticleDropdown = true"
              @blur="closeArticleDropdown"
              @input="filterArticles"
              @keydown.enter.prevent="selectFirstArticle"
              placeholder="🔍 Rechercher un article..."
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <div v-if="showArticleDropdown && filteredArticles.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <div
                v-for="article in filteredArticles"
                :key="article.id"
                @mousedown.prevent="selectArticle(article)"
                class="px-4 py-2 hover:bg-sky-50 cursor-pointer transition border-b border-gray-100 last:border-0"
              >
                <div class="font-medium text-gray-800">{{ article.name }}</div>
                <div class="text-xs text-gray-500">Réf: {{ article.reference }}</div>
              </div>
            </div>
          </div>

          <!-- Champ de recherche fournisseur avec autocomplétion -->
          <div class="relative">
            <input 
              v-model="searchSupplierTerm"
              type="text"
              @focus="showSupplierDropdown = true"
              @blur="closeSupplierDropdown"
              @input="filterSuppliers"
              @keydown.enter.prevent="selectFirstSupplier"
              placeholder="🔍 Rechercher un fournisseur..."
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <div v-if="showSupplierDropdown && filteredSuppliers.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <div
                v-for="supplier in filteredSuppliers"
                :key="supplier.id"
                @mousedown.prevent="selectSupplier(supplier)"
                class="px-4 py-2 hover:bg-sky-50 cursor-pointer transition border-b border-gray-100 last:border-0"
              >
                <div class="font-medium text-gray-800">{{ supplier.name }}</div>
                <div v-if="supplier.email" class="text-xs text-gray-500">{{ supplier.email }}</div>
              </div>
            </div>
          </div>

          <input v-model="newPrix.purchase_price" type="number" step="0.01" placeholder="Prix d'achat (FCFA)" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
        </div>
        <button @click="ajouterPrix" :disabled="isLoading" class="mt-4 bg-sky-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sky-700 transition disabled:opacity-50 shadow-sm">
          {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>

      <!-- Barre de recherche -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
        <div class="flex gap-4">
          <div class="relative flex-1">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="🔍 Rechercher par article, fournisseur ou prix..." 
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

      <!-- Liste des prix -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">📋 Liste des prix par fournisseur</h2>
          <div class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Total: {{ supplierPrices.length }} associations
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Article</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fournisseur</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Prix achat</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(prix, index) in supplierPricesPagines" :key="prix.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-500 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span class="font-semibold text-gray-800">{{ prix.product?.name || getArticleNom(prix.product_id) }}</span>
                  <span class="text-gray-400 text-xs ml-1">({{ prix.product?.reference || getArticleRef(prix.product_id) }})</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ prix.supplier?.name || getFournisseurNom(prix.supplier_id) }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-sky-600">{{ formatPrice(prix.purchase_price) }} FCFA</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex items-center gap-2">
                    <button @click="voirDetails(prix)" class="text-sky-600 hover:text-sky-800 transition" title="Voir détails">
                      👁️
                    </button>
                    <button @click="modifierPrix(prix)" class="text-indigo-600 hover:text-indigo-800 transition" title="Modifier">
                      ✏️
                    </button>
                    <button @click="supprimerPrix(prix.id)" class="text-red-500 hover:text-red-700 transition" title="Supprimer" :disabled="isDeleting === prix.id">
                      {{ isDeleting === prix.id ? '...' : '🗑️' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="supplierPricesFiltres.length === 0 && !isLoadingList">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-5xl">💰</span>
                    <p class="font-medium">Aucune association trouvée</p>
                    <p class="text-xs text-gray-400">Ajoutez votre premier prix fournisseur ci-dessus</p>
                  </div>
                </td>
              </tr>
              <tr v-if="isLoadingList">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
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
            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ supplierPricesFiltres.length }} associations
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

    <!-- Modal Voir Plus (Détails) -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showDetailsModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 class="text-xl font-bold text-gray-900">📄 Détails du prix</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-3">
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">ID :</span>
            <span class="text-gray-800">{{ selectedPrix?.id }}</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Article :</span>
            <span class="text-gray-800 font-medium">{{ selectedPrix?.product?.name || getArticleNom(selectedPrix?.product_id) }}</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Référence :</span>
            <span class="text-gray-800">{{ selectedPrix?.product?.reference || getArticleRef(selectedPrix?.product_id) }}</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Fournisseur :</span>
            <span class="text-gray-800">{{ selectedPrix?.supplier?.name || getFournisseurNom(selectedPrix?.supplier_id) }}</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Prix achat :</span>
            <span class="text-gray-800 font-bold text-sky-600">{{ formatPrice(selectedPrix?.purchase_price) }} FCFA</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Date création :</span>
            <span class="text-gray-800">{{ formatDate(selectedPrix?.created_at) }}</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Dernière modif :</span>
            <span class="text-gray-800">{{ formatDate(selectedPrix?.updated_at) }}</span>
          </div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button @click="showDetailsModal = false" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition font-medium">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de modification -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showEditModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h3 class="text-xl font-bold text-gray-900">✏️ Modifier le prix</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Article</label>
            <div class="relative">
              <input 
                v-model="editSearchArticleTerm"
                type="text"
                @focus="showEditArticleDropdown = true"
                @blur="closeEditArticleDropdown"
                @input="filterEditArticles"
                @keydown.enter.prevent="selectFirstEditArticle"
                placeholder="🔍 Rechercher un article..."
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <div v-if="showEditArticleDropdown && filteredEditArticles.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                <div
                  v-for="article in filteredEditArticles"
                  :key="article.id"
                  @mousedown.prevent="selectEditArticle(article)"
                  class="px-4 py-2 hover:bg-sky-50 cursor-pointer transition border-b border-gray-100 last:border-0"
                >
                  <div class="font-medium text-gray-800">{{ article.name }}</div>
                  <div class="text-xs text-gray-500">Réf: {{ article.reference }}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
            <div class="relative">
              <input 
                v-model="editSearchSupplierTerm"
                type="text"
                @focus="showEditSupplierDropdown = true"
                @blur="closeEditSupplierDropdown"
                @input="filterEditSuppliers"
                @keydown.enter.prevent="selectFirstEditSupplier"
                placeholder="🔍 Rechercher un fournisseur..."
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <div v-if="showEditSupplierDropdown && filteredEditSuppliers.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                <div
                  v-for="supplier in filteredEditSuppliers"
                  :key="supplier.id"
                  @mousedown.prevent="selectEditSupplier(supplier)"
                  class="px-4 py-2 hover:bg-sky-50 cursor-pointer transition border-b border-gray-100 last:border-0"
                >
                  <div class="font-medium text-gray-800">{{ supplier.name }}</div>
                  <div v-if="supplier.email" class="text-xs text-gray-500">{{ supplier.email }}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix achat (FCFA)</label>
            <input v-model="editPrix.purchase_price" type="number" step="0.01" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button @click="closeEditModal" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
            Annuler
          </button>
          <button @click="mettreAJourPrix" :disabled="isUpdating" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50 font-medium">
            {{ isUpdating ? 'Mise à jour...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
const isDeleting = ref(null)
const isUpdating = ref(false)

// Données
const fournisseurs = ref([])
const articles = ref([])
const supplierPrices = ref([])

const newPrix = ref({
  article_id: '',
  supplier_id: '',
  purchase_price: ''
})

// Recherche globale
const searchTerm = ref('')

// États pour les champs de recherche avec autocomplétion (Formulaire)
const searchArticleTerm = ref('')
const searchSupplierTerm = ref('')
const showArticleDropdown = ref(false)
const showSupplierDropdown = ref(false)
const filteredArticles = ref([])
const filteredSuppliers = ref([])

// États pour les champs de recherche dans le modal d'édition
const editSearchArticleTerm = ref('')
const editSearchSupplierTerm = ref('')
const showEditArticleDropdown = ref(false)
const showEditSupplierDropdown = ref(false)
const filteredEditArticles = ref([])
const filteredEditSuppliers = ref([])

// Modals
const showDetailsModal = ref(false)
const showEditModal = ref(false)
const selectedPrix = ref(null)
const editPrix = ref({
  id: null,
  product_id: '',
  supplier_id: '',
  purchase_price: ''
})

// Helper functions
const formatPrice = (price) => {
  if (!price && price !== 0) return '0.00'
  return parseFloat(price).toFixed(2)
}

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})
}

const getArticleNom = (id) => {
  const article = articles.value.find(a => a.id === parseInt(id))
  return article ? article.name : 'Chargement...'
}

const getArticleRef = (id) => {
  const article = articles.value.find(a => a.id === parseInt(id))
  return article ? article.reference : ''
}

const getFournisseurNom = (id) => {
  const fournisseur = fournisseurs.value.find(f => f.id === parseInt(id))
  return fournisseur ? fournisseur.name : 'Chargement...'
}

// Filtrer les articles
const filterArticles = () => {
  if (!searchArticleTerm.value) {
    filteredArticles.value = articles.value
  } else {
    const search = searchArticleTerm.value.toLowerCase()
    filteredArticles.value = articles.value.filter(article => 
      article.name.toLowerCase().includes(search) || 
      article.reference.toLowerCase().includes(search)
    )
  }
}

// Filtrer les fournisseurs
const filterSuppliers = () => {
  if (!searchSupplierTerm.value) {
    filteredSuppliers.value = fournisseurs.value
  } else {
    const search = searchSupplierTerm.value.toLowerCase()
    filteredSuppliers.value = fournisseurs.value.filter(supplier => 
      supplier.name.toLowerCase().includes(search)
    )
  }
}

// Filtrer les articles pour l'édition
const filterEditArticles = () => {
  if (!editSearchArticleTerm.value) {
    filteredEditArticles.value = articles.value
  } else {
    const search = editSearchArticleTerm.value.toLowerCase()
    filteredEditArticles.value = articles.value.filter(article => 
      article.name.toLowerCase().includes(search) || 
      article.reference.toLowerCase().includes(search)
    )
  }
}

// Filtrer les fournisseurs pour l'édition
const filterEditSuppliers = () => {
  if (!editSearchSupplierTerm.value) {
    filteredEditSuppliers.value = fournisseurs.value
  } else {
    const search = editSearchSupplierTerm.value.toLowerCase()
    filteredEditSuppliers.value = fournisseurs.value.filter(supplier => 
      supplier.name.toLowerCase().includes(search)
    )
  }
}

// Sélectionner le premier article
const selectFirstArticle = () => {
  if (filteredArticles.value.length > 0) {
    selectArticle(filteredArticles.value[0])
  }
}

// Sélectionner le premier fournisseur
const selectFirstSupplier = () => {
  if (filteredSuppliers.value.length > 0) {
    selectSupplier(filteredSuppliers.value[0])
  }
}

// Sélectionner le premier article pour l'édition
const selectFirstEditArticle = () => {
  if (filteredEditArticles.value.length > 0) {
    selectEditArticle(filteredEditArticles.value[0])
  }
}

// Sélectionner le premier fournisseur pour l'édition
const selectFirstEditSupplier = () => {
  if (filteredEditSuppliers.value.length > 0) {
    selectEditSupplier(filteredEditSuppliers.value[0])
  }
}

// Sélectionner un article
const selectArticle = (article) => {
  newPrix.value.article_id = article.id
  searchArticleTerm.value = `${article.name} (${article.reference})`
  showArticleDropdown.value = false
}

// Sélectionner un fournisseur
const selectSupplier = (supplier) => {
  newPrix.value.supplier_id = supplier.id
  searchSupplierTerm.value = supplier.name
  showSupplierDropdown.value = false
}

// Sélectionner un article pour l'édition
const selectEditArticle = (article) => {
  editPrix.value.product_id = article.id
  editSearchArticleTerm.value = `${article.name} (${article.reference})`
  showEditArticleDropdown.value = false
}

// Sélectionner un fournisseur pour l'édition
const selectEditSupplier = (supplier) => {
  editPrix.value.supplier_id = supplier.id
  editSearchSupplierTerm.value = supplier.name
  showEditSupplierDropdown.value = false
}

// Fermer les dropdowns avec délai
const closeArticleDropdown = () => {
  setTimeout(() => {
    showArticleDropdown.value = false
  }, 200)
}

const closeSupplierDropdown = () => {
  setTimeout(() => {
    showSupplierDropdown.value = false
  }, 200)
}

const closeEditArticleDropdown = () => {
  setTimeout(() => {
    showEditArticleDropdown.value = false
  }, 200)
}

const closeEditSupplierDropdown = () => {
  setTimeout(() => {
    showEditSupplierDropdown.value = false
  }, 200)
}

// Fermer le modal d'édition
const closeEditModal = () => {
  showEditModal.value = false
  // Réinitialiser les champs de recherche d'édition
  editSearchArticleTerm.value = ''
  editSearchSupplierTerm.value = ''
  editPrix.value = {
    id: null,
    product_id: '',
    supplier_id: '',
    purchase_price: ''
  }
}

// Charger les articles depuis l'API
const chargerArticles = async () => {
  try {
    const response = await api.get('/products')
    if (response.data.success) {
      articles.value = response.data.data.data || response.data.data || []
      filteredArticles.value = articles.value
      filteredEditArticles.value = articles.value
    }
  } catch (error) {
    console.error('Erreur chargement articles:', error)
  }
}

// Charger les fournisseurs depuis l'API
const chargerFournisseurs = async () => {
  try {
    const response = await api.get('/suppliers')
    if (response.data.success) {
      fournisseurs.value = response.data.data
      filteredSuppliers.value = fournisseurs.value
      filteredEditSuppliers.value = fournisseurs.value
    }
  } catch (error) {
    console.error('Erreur chargement fournisseurs:', error)
  }
}

// Charger les prix fournisseurs depuis l'API
const chargerSupplierPrices = async () => {
  isLoadingList.value = true
  try {
    const response = await api.get('/supplier-prices')
    if (response.data.success) {
      supplierPrices.value = response.data.data.data || response.data.data || []
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors du chargement des prix: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoadingList.value = false
  }
}

// Filtre par recherche pour le tableau
const supplierPricesFiltres = computed(() => {
  let filtered = supplierPrices.value
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = supplierPrices.value.filter(prix => {
      const articleName = prix.product?.name || getArticleNom(prix.product_id)
      const supplierName = prix.supplier?.name || getFournisseurNom(prix.supplier_id)
      return articleName.toLowerCase().includes(search) ||
             supplierName.toLowerCase().includes(search) ||
             prix.purchase_price.toString().includes(search)
    })
  }
  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(supplierPricesFiltres.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, supplierPricesFiltres.value.length))

const supplierPricesPagines = computed(() => {
  return supplierPricesFiltres.value.slice(startIndex.value, endIndex.value)
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

// CRUD Operations
const ajouterPrix = async () => {
  if (!newPrix.value.article_id || !newPrix.value.supplier_id || !newPrix.value.purchase_price) {
    alert('Veuillez remplir tous les champs')
    return
  }

  if (parseFloat(newPrix.value.purchase_price) <= 0) {
    alert('Le prix doit être supérieur à 0')
    return
  }

  isLoading.value = true
  try {
    const response = await api.post('/supplier-prices', {
      article_id: newPrix.value.article_id,
      supplier_id: newPrix.value.supplier_id,
      purchase_price: parseFloat(newPrix.value.purchase_price)
    })
    
    if (response.data.success) {
      alert('✅ Prix ajouté avec succès')
      
      // Reset
      newPrix.value = { article_id: '', supplier_id: '', purchase_price: '' }
      searchArticleTerm.value = ''
      searchSupplierTerm.value = ''
      
      await chargerSupplierPrices()
      // Aller à la dernière page
      currentPage.value = totalPages.value
    }
  } catch (error) {
    console.error('Erreur:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      alert(errors.join('\n'))
    } else {
      alert('Erreur lors de l\'ajout du prix')
    }
  } finally {
    isLoading.value = false
  }
}

const supprimerPrix = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette association ?')) return
  
  isDeleting.value = id
  try {
    const response = await api.delete(`/supplier-prices/${id}`)
    
    if (response.data.success) {
      alert('✅ Prix supprimé avec succès')
      await chargerSupplierPrices()
      
      if (supplierPricesPagines.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la suppression du prix: ' + (error.response?.data?.message || error.message))
  } finally {
    isDeleting.value = null
  }
}

const voirDetails = (prix) => {
  selectedPrix.value = prix
  showDetailsModal.value = true
}

const modifierPrix = (prix) => {
  editPrix.value = {
    id: prix.id,
    product_id: prix.product_id,
    supplier_id: prix.supplier_id,
    purchase_price: prix.purchase_price
  }
  
  // Remplir les champs de recherche avec les valeurs actuelles
  const article = articles.value.find(a => a.id === parseInt(prix.product_id))
  if (article) {
    editSearchArticleTerm.value = `${article.name} (${article.reference})`
  }
  
  const supplier = fournisseurs.value.find(f => f.id === parseInt(prix.supplier_id))
  if (supplier) {
    editSearchSupplierTerm.value = supplier.name
  }
  
  showEditModal.value = true
}

const mettreAJourPrix = async () => {
  if (!editPrix.value.product_id || !editPrix.value.supplier_id || !editPrix.value.purchase_price) {
    alert('Veuillez remplir tous les champs')
    return
  }

  if (parseFloat(editPrix.value.purchase_price) <= 0) {
    alert('Le prix doit être supérieur à 0')
    return
  }
  
  isUpdating.value = true
  try {
    const response = await api.put(`/supplier-prices/${editPrix.value.id}`, {
      article_id: editPrix.value.product_id,
      supplier_id: editPrix.value.supplier_id,
      purchase_price: parseFloat(editPrix.value.purchase_price)
    })
    
    if (response.data.success) {
      alert('✅ Prix modifié avec succès')
      closeEditModal()
      await chargerSupplierPrices()
    }
  } catch (error) {
    console.error('Erreur:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('Erreur lors de la modification du prix')
    }
  } finally {
    isUpdating.value = false
  }
}

// Watcher pour mettre à jour les listes filtrées quand les données changent
watch(articles, () => {
  filteredArticles.value = articles.value
  filteredEditArticles.value = articles.value
})

watch(fournisseurs, () => {
  filteredSuppliers.value = fournisseurs.value
  filteredEditSuppliers.value = fournisseurs.value
})

// Charger toutes les données au démarrage
onMounted(async () => {
  await chargerArticles()
  await chargerFournisseurs()
  await chargerSupplierPrices()
})
</script>