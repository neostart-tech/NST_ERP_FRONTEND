<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- Header dégradé sky -->
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div>
              <h1 class="text-3xl font-bold mb-2">📦 Gestion des articles</h1>
              <p class="text-sky-100 text-lg">Gérez votre catalogue de produits</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire d'ajout -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">➕ Ajouter un article</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input v-model="newProduct.name" type="text" placeholder="Nom de l'article" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          <input v-model="newProduct.reference" type="text" placeholder="Référence" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          <input v-model="newProduct.alert_threshold" type="number" placeholder="Seuil alerte" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          <input v-model="newProduct.selling_price" type="number" step="0.01" placeholder="Prix vente (FCFA)" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input v-model="newProduct.current_stock" type="number" min="0" placeholder="Stock actuel" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          <div></div>
        </div>
        <div class="mb-4">
          <textarea v-model="newProduct.description" rows="3" placeholder="Description de l'article..." class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"></textarea>
        </div>
        <button @click="ajouterArticle" :disabled="isLoading" class="bg-sky-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sky-700 transition disabled:opacity-50 shadow-sm">
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
              placeholder="🔍 Rechercher un article (nom, référence ou prix)..." 
              class="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

      <!-- Liste des articles -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">📋 Catalogue des articles</h2>
          <div class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Total: {{ products.length }} articles
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Référence</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Seuil</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Stock actuel</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Prix vente</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(product, index) in productsFiltres" :key="product.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-700">{{ product.reference }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ product.name }}</td>
                <td class="px-6 py-4 text-sm">
                  <span :class="product.current_stock < product.alert_threshold ? 'text-red-600 font-bold' : ''">
                    {{ product.alert_threshold }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span :class="product.current_stock < product.alert_threshold ? 'bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold' : 'bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold'">
                    {{ product.current_stock }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-sky-600">{{ product.selling_price }} FCFA</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button @click="voirDetails(product)" class="text-sky-600 hover:text-sky-800 transition" title="Voir détails">👁️</button>
                    <button @click="modifierArticle(product)" class="text-indigo-600 hover:text-indigo-800 transition" title="Modifier">✏️</button>
                    <button @click="supprimerArticle(product.id)" class="text-red-500 hover:text-red-700 transition" title="Supprimer" :disabled="isDeleting === product.id">
                      {{ isDeleting === product.id ? '...' : '🗑️' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="productsFiltres.length === 0 && !isLoadingList">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-5xl">📦</span>
                    <p class="font-medium">Aucun article trouvé</p>
                    <p class="text-xs text-gray-400">Ajoutez votre premier article ci-dessus</p>
                  </div>
                </td>
              </tr>
              <tr v-if="isLoadingList">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex justify-center items-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ productsFiltres.length }} articles
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
          <h3 class="text-xl font-bold text-gray-900">📄 Détails de l'article</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-3">
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-32 text-gray-600">ID :</span><span class="text-gray-800">{{ selectedProduct?.id }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-32 text-gray-600">Référence :</span><span class="text-gray-800 font-mono">{{ selectedProduct?.reference }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-32 text-gray-600">Nom :</span><span class="text-gray-800 font-semibold">{{ selectedProduct?.name }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-32 text-gray-600">Seuil alerte :</span><span class="text-gray-800">{{ selectedProduct?.alert_threshold }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-32 text-gray-600">Stock actuel :</span><span class="text-gray-800" :class="selectedProduct?.current_stock < selectedProduct?.alert_threshold ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'">{{ selectedProduct?.current_stock }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-32 text-gray-600">Prix vente :</span><span class="text-gray-800 font-semibold text-sky-600">{{ selectedProduct?.selling_price }} FCFA</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-32 text-gray-600">Description :</span><span class="text-gray-800">{{ selectedProduct?.description || 'Aucune description' }}</span></div>
          <div class="flex border-b border-gray-100 pb-3"><span class="font-semibold w-32 text-gray-600">Statut stock :</span><span class="text-gray-800" :class="selectedProduct?.current_stock < selectedProduct?.alert_threshold ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'">{{ selectedProduct?.current_stock < selectedProduct?.alert_threshold ? '⚠️ Stock bas' : '✓ Stock suffisant' }}</span></div>
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
          <h3 class="text-xl font-bold text-gray-900">✏️ Modifier l'article</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Référence</label>
            <input v-model="editProduct.reference" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input v-model="editProduct.name" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Seuil alerte</label>
            <input v-model="editProduct.alert_threshold" type="number" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix vente (FCFA)</label>
            <input v-model="editProduct.selling_price" type="number" step="0.01" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock actuel</label>
            <input v-model="editProduct.current_stock" type="number" min="0" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="editProduct.description" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"></textarea>
          </div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button @click="showEditModal = false" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
            Annuler
          </button>
          <button @click="mettreAJourArticle" :disabled="isUpdating" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50 font-medium">
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
const products = ref([])
const isLoading = ref(false)
const isLoadingList = ref(false)
const isDeleting = ref(null)
const isUpdating = ref(false)

// Nouvel article
const newProduct = ref({
  name: '',
  reference: '',
  alert_threshold: 5,
  selling_price: 0,
  current_stock: 0,
  description: ''
})

// Recherche
const searchTerm = ref('')

// Modal Voir Plus
const showDetailsModal = ref(false)
const selectedProduct = ref(null)

// Modal Modification
const showEditModal = ref(false)
const editProduct = ref({
  id: null,
  reference: '',
  name: '',
  alert_threshold: 0,
  selling_price: 0,
  current_stock: 0,
  description: ''
})

// Produits filtrés par recherche
const productsFiltres = computed(() => {
  let filtered = products.value
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = products.value.filter(product => 
      product.name?.toLowerCase().includes(search) ||
      product.reference?.toLowerCase().includes(search) ||
      product.selling_price?.toString().includes(search)
    )
  }
  return filtered
})

// Pagination computed
const totalPages = computed(() => Math.ceil(productsFiltres.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, productsFiltres.value.length))

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

// Charger la liste des articles
const chargerArticles = async () => {
  isLoadingList.value = true
  try {
    const response = await api.get('/products')
    
    if (response.data.success) {
      if (response.data.data && Array.isArray(response.data.data)) {
        products.value = response.data.data
      } else if (response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        products.value = response.data.data.data
      } else {
        products.value = []
      }
      currentPage.value = 1
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors du chargement des articles: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoadingList.value = false
  }
}

// Ajouter un article
const ajouterArticle = async () => {
  if (!newProduct.value.name || !newProduct.value.reference) {
    alert('Le nom et la référence sont requis')
    return
  }

  isLoading.value = true
  try {
    const response = await api.post('/products', {
      name: newProduct.value.name,
      reference: newProduct.value.reference,
      alert_threshold: parseInt(newProduct.value.alert_threshold) || 5,
      selling_price: parseFloat(newProduct.value.selling_price) || 0,
      current_stock: parseInt(newProduct.value.current_stock) || 0,
      description: newProduct.value.description || ''
    })
    
    if (response.data.success) {
      alert('Article ajouté avec succès')
      newProduct.value = { 
        name: '', 
        reference: '', 
        alert_threshold: 5, 
        selling_price: 0, 
        current_stock: 0, 
        description: '' 
      }
      await chargerArticles()
    } else {
      alert('Erreur: ' + (response.data.message || 'Erreur lors de l\'ajout'))
    }
  } catch (error) {
    console.error('Erreur:', error)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      alert(Object.values(errors).flat().join('\n'))
    } else {
      alert('Erreur lors de l\'ajout de l\'article: ' + (error.response?.data?.message || error.message))
    }
  } finally {
    isLoading.value = false
  }
}

// Supprimer un article
const supprimerArticle = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    return
  }

  isDeleting.value = id
  try {
    const response = await api.delete(`/products/${id}`)
    
    if (response.data.success) {
      alert('Article supprimé avec succès')
      await chargerArticles()
    }
  } catch (error) {
    console.error('Erreur:', error)
    const message = error.response?.data?.message || 'Erreur lors de la suppression de l\'article'
    alert(message)
  } finally {
    isDeleting.value = null
  }
}

// Voir détails
const voirDetails = (product) => {
  selectedProduct.value = product
  showDetailsModal.value = true
}

// Modifier article (ouvrir modal)
const modifierArticle = (product) => {
  editProduct.value = { 
    id: product.id,
    reference: product.reference,
    name: product.name,
    alert_threshold: product.alert_threshold,
    selling_price: product.selling_price,
    current_stock: product.current_stock || 0,
    description: product.description || ''
  }
  showEditModal.value = true
}

// Mettre à jour article (envoie TOUS les champs y compris current_stock)
const mettreAJourArticle = async () => {
  // Vérifications
  if (!editProduct.value.reference || editProduct.value.reference.trim() === '') {
    alert('La référence est requise')
    return
  }
  if (!editProduct.value.name || editProduct.value.name.trim() === '') {
    alert('Le nom est requis')
    return
  }
  if (editProduct.value.alert_threshold < 0) {
    alert('Le seuil d\'alerte doit être un nombre positif')
    return
  }
  if (editProduct.value.selling_price < 0) {
    alert('Le prix de vente doit être un nombre positif')
    return
  }
  if (editProduct.value.current_stock < 0) {
    alert('Le stock actuel doit être un nombre positif')
    return
  }

  isUpdating.value = true
  try {
    // Envoyer TOUS les champs, y compris current_stock
    const response = await api.put(`/products/${editProduct.value.id}`, {
      reference: editProduct.value.reference,
      name: editProduct.value.name,
      alert_threshold: parseInt(editProduct.value.alert_threshold) || 0,
      selling_price: parseFloat(editProduct.value.selling_price) || 0,
      current_stock: parseInt(editProduct.value.current_stock) || 0,
      description: editProduct.value.description || ''
    })
    
    if (response.data.success) {
      alert('Article modifié avec succès')
      showEditModal.value = false
      await chargerArticles()
    } else {
      alert('Erreur: ' + (response.data.message || 'Erreur lors de la modification'))
    }
  } catch (error) {
    console.error('Erreur:', error)
    const errorMsg = error.response?.data?.message || error.message
    alert('Erreur lors de la modification de l\'article: ' + errorMsg)
  } finally {
    isUpdating.value = false
  }
}

// Charger les articles au démarrage
onMounted(() => {
  chargerArticles()
})
</script>