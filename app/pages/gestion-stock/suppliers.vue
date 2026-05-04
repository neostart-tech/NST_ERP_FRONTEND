<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- Header dégradé sky -->
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div>
              <h1 class="text-3xl font-bold mb-2">🏭 Gestion des fournisseurs</h1>
              <p class="text-sky-100 text-lg">Gérez votre catalogue de fournisseurs</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire d'ajout -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">➕ Ajouter un fournisseur</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            v-model="newSupplier.name" 
            type="text" 
            placeholder="Nom du fournisseur" 
            class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <input 
            v-model="newSupplier.phone" 
            type="text" 
            placeholder="Téléphone" 
            class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <input 
            v-model="newSupplier.email" 
            type="email" 
            placeholder="Email" 
            class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <button 
          @click="ajouterFournisseur" 
          :disabled="isLoading"
          class="mt-4 bg-sky-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sky-700 transition disabled:opacity-50 shadow-sm"
        >
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
              placeholder="🔍 Rechercher un fournisseur (nom, téléphone ou email)..." 
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

      <!-- Liste des fournisseurs -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">📋 Liste des fournisseurs</h2>
          <div class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Total: {{ suppliers.length }} fournisseurs
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Téléphone</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(supplier, index) in suppliersFiltres.slice(startIndex, endIndex)" :key="supplier.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-500 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ supplier.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ supplier.phone || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ supplier.email || '-' }}</td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex items-center gap-2">
                    <button @click="voirDetails(supplier)" class="text-sky-600 hover:text-sky-800 transition" title="Voir détails">
                      👁️
                    </button>
                    <button @click="modifierFournisseur(supplier)" class="text-indigo-600 hover:text-indigo-800 transition" title="Modifier">
                      ✏️
                    </button>
                    <button @click="supprimerFournisseur(supplier.id)" class="text-red-500 hover:text-red-700 transition" title="Supprimer" :disabled="isDeleting === supplier.id">
                      {{ isDeleting === supplier.id ? '...' : '🗑️' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="suppliersFiltres.length === 0 && !isLoadingList">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-4xl">📭</span>
                    <p>Aucun fournisseur trouvé</p>
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
            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ suppliersFiltres.length }} fournisseurs
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
          <h3 class="text-xl font-bold text-gray-900">📄 Détails du fournisseur</h3>
          <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-3">
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">ID :</span>
            <span class="text-gray-800">{{ selectedSupplier?.id }}</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Nom :</span>
            <span class="text-gray-800 font-medium">{{ selectedSupplier?.name }}</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Téléphone :</span>
            <span class="text-gray-800">{{ selectedSupplier?.phone || '-' }}</span>
          </div>
          <div class="flex border-b border-gray-100 pb-3">
            <span class="font-semibold w-32 text-gray-600">Email :</span>
            <span class="text-gray-800">{{ selectedSupplier?.email || '-' }}</span>
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
          <h3 class="text-xl font-bold text-gray-900">✏️ Modifier le fournisseur</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input v-model="editSupplier.name" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input v-model="editSupplier.phone" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="editSupplier.email" type="email" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button @click="showEditModal = false" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
            Annuler
          </button>
          <button @click="mettreAJourFournisseur" :disabled="isUpdating" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50 font-medium">
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
const suppliers = ref([])
const isLoading = ref(false)
const isLoadingList = ref(false)
const isDeleting = ref(null)
const isUpdating = ref(false)

// Nouveau fournisseur
const newSupplier = ref({
  name: '',
  phone: '',
  email: ''
})

// Recherche
const searchTerm = ref('')

// Modal Voir Plus
const showDetailsModal = ref(false)
const selectedSupplier = ref(null)

// Modal Modification
const showEditModal = ref(false)
const editSupplier = ref({
  id: null,
  name: '',
  phone: '',
  email: ''
})

// Fournisseurs filtrés par recherche
const suppliersFiltres = computed(() => {
  let filtered = suppliers.value
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = suppliers.value.filter(s => 
      s.name?.toLowerCase().includes(search) ||
      s.phone?.toLowerCase().includes(search) ||
      s.email?.toLowerCase().includes(search)
    )
  }
  return filtered
})

// Pagination computed
const totalPages = computed(() => Math.ceil(suppliersFiltres.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, suppliersFiltres.value.length))

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

// Charger la liste des fournisseurs
const chargerFournisseurs = async () => {
  isLoadingList.value = true
  try {
    const response = await api.get('/suppliers')
    if (response.data.success) {
      suppliers.value = response.data.data
      currentPage.value = 1
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors du chargement des fournisseurs')
  } finally {
    isLoadingList.value = false
  }
}

// Ajouter un fournisseur
const ajouterFournisseur = async () => {
  if (!newSupplier.value.name) {
    alert('Le nom du fournisseur est requis')
    return
  }

  isLoading.value = true
  try {
    const response = await api.post('/suppliers', newSupplier.value)
    
    if (response.data.success) {
      alert('Fournisseur ajouté avec succès')
      newSupplier.value = { name: '', phone: '', email: '' }
      await chargerFournisseurs()
    }
  } catch (error) {
    console.error('Erreur:', error)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      alert(Object.values(errors).flat().join('\n'))
    } else if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('Erreur lors de l\'ajout du fournisseur')
    }
  } finally {
    isLoading.value = false
  }
}

// Supprimer un fournisseur
const supprimerFournisseur = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
    return
  }

  isDeleting.value = id
  try {
    const response = await api.delete(`/suppliers/${id}`)
    
    if (response.data.success) {
      alert('Fournisseur supprimé avec succès')
      await chargerFournisseurs()
    }
  } catch (error) {
    console.error('Erreur:', error)
    const message = error.response?.data?.message || 'Erreur lors de la suppression du fournisseur'
    alert(message)
  } finally {
    isDeleting.value = null
  }
}

// Voir détails
const voirDetails = (supplier) => {
  selectedSupplier.value = supplier
  showDetailsModal.value = true
}

// Modifier fournisseur
const modifierFournisseur = (supplier) => {
  editSupplier.value = { ...supplier }
  showEditModal.value = true
}

// Mettre à jour fournisseur
const mettreAJourFournisseur = async () => {
  isUpdating.value = true
  try {
    const response = await api.put(`/suppliers/${editSupplier.value.id}`, {
      name: editSupplier.value.name,
      phone: editSupplier.value.phone,
      email: editSupplier.value.email
    })
    
    if (response.data.success) {
      alert('Fournisseur modifié avec succès')
      showEditModal.value = false
      await chargerFournisseurs()
    }
  } catch (error) {
    console.error('Erreur:', error)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      alert(Object.values(errors).flat().join('\n'))
    } else {
      alert('Erreur lors de la modification du fournisseur')
    }
  } finally {
    isUpdating.value = false
  }
}

// Charger les fournisseurs au démarrage
onMounted(() => {
  chargerFournisseurs()
})
</script>