<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- ==================== LISTE DES CLIENTS ==================== -->
      <div v-if="!selectedCustomer">
        <!-- Header -->
        <div class="relative mb-6">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">Gestion des clients</h1>
                  <p class="text-sky-100 text-lg">Suivez et gérez tous vos clients</p>
                </div>
                <button @click="openForm" class="bg-white text-sky-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition shadow-md">
                  + Nouveau client
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Barre de recherche -->
        <div class="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div class="relative w-96">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher un client..." 
              @input="handleSearch"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
            />
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <div class="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
            Total: {{ pagination.total }} clients
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12 bg-white rounded-xl shadow">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p class="mt-3 text-gray-500">Chargement des clients...</p>
        </div>

        <!-- Tableau clients -->
        <div v-else class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Photo</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Téléphone</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contrat actif</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(customer, index) in customers" :key="customer.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 text-sm text-gray-500">{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
                  <td class="px-6 py-4">
                    <img 
                      :src="getPhotoUrl(customer.photo)" 
                      :alt="customer.name"
                      class="w-10 h-10 rounded-full object-cover shadow-sm" 
                      @error="handleImageError"
                    >
                  </td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ customer.name }}</td>
                  <td class="px-6 py-4">
                    <span :class="customer.type === 'company' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ customer.type === 'individual' ? 'Particulier' : customer.type === 'company' ? 'Entreprise' : 'Association' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ customer.phone }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ customer.email }}</td>
                  <td class="px-6 py-4">
                    <span :class="customer.active_contract ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-xs font-semibold">
                      {{ customer.active_contract ? 'Oui' : 'Non' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 space-x-3">
                    <button @click="viewCustomer(customer.id)" class="text-sky-600 hover:text-sky-800 font-medium">Voir</button>
                    <button @click="editCustomer(customer)" class="text-indigo-600 hover:text-indigo-800 font-medium">Modifier</button>
                    <button @click="deleteCustomer(customer.id)" class="text-red-600 hover:text-red-800 font-medium">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              Affichage de {{ customers.length }} sur {{ pagination.total }} clients
            </div>
            <div class="flex gap-2">
              <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Précédent
              </button>
              <span class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                Page {{ pagination.current_page }} / {{ pagination.last_page }}
              </span>
              <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Suivant
              </button>
            </div>
          </div>
        </div>

        <!-- Modal formulaire client -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeForm">
          <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-sky-700">{{ editingCustomer ? 'Modifier le client' : 'Nouveau client' }}</h2>
              <button @click="closeForm" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6">
              <form @submit.prevent="saveCustomer">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label><input v-model="form.name" type="text" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Type *</label><select v-model="form.type" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"><option value="individual">Particulier</option><option value="company">Entreprise</option><option value="association">Association</option></select></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Email *</label><input v-model="form.email" type="email" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label><input v-model="form.phone" type="tel" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                    <input type="file" @change="handlePhotoUpload" accept="image/*" class="w-full border border-gray-300 rounded-xl px-3 py-2">
                    <div v-if="form.photoPreview" class="mt-2">
                      <img :src="form.photoPreview" class="w-16 h-16 rounded-full object-cover shadow">
                    </div>
                    <div v-else-if="form.existingPhoto" class="mt-2">
                      <img :src="getPhotoUrl(form.existingPhoto)" class="w-16 h-16 rounded-full object-cover shadow">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">CNI / RCCM</label>
                    <input type="file" @change="handleCniUpload" accept="image/*,application/pdf" class="w-full border border-gray-300 rounded-xl px-3 py-2">
                    <div v-if="form.cni_rccm && typeof form.cni_rccm === 'string'" class="mt-1 text-sm text-sky-600">Fichier: {{ form.cni_rccm.split('/').pop() }}</div>
                  </div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Pays *</label><input v-model="form.country" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Ville *</label><input v-model="form.city" required class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></div>
                  <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Adresse *</label><textarea v-model="form.address" required rows="2" class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></textarea></div>
                  <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Note</label><textarea v-model="form.note" rows="2" class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-sky-500 focus:border-sky-500"></textarea></div>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                  <button type="button" @click="closeForm" class="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">Annuler</button>
                  <button type="submit" :disabled="saving" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== FICHE CLIENT DÉTAILLÉE ==================== -->
      <div v-else-if="selectedCustomer" class="space-y-6">
        <!-- Loading détail -->
        <div v-if="loadingDetail" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-4 shadow-lg"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>
        </div>

        <!-- En-tête client -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 px-6 py-4">
            <div class="flex justify-between items-start">
              <button @click="goBackToList" class="text-white hover:text-sky-200 text-2xl">←</button>
              <div class="flex gap-2">
                <button @click="exportCustomerPdf" class="px-3 py-1.5 bg-white text-sky-700 rounded-lg font-medium hover:bg-sky-50 transition text-sm">📄 Export PDF</button>
                <button @click="openEditForm" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition text-sm">Modifier</button>
                <button @click="deleteCustomerFromDetail" class="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm">Supprimer</button>
                <button v-if="selectedCustomer.cni_rccm" @click="openCniModal(selectedCustomer.cni_rccm)" class="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition text-sm">📄 Voir CNI</button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="flex gap-5">
              <img 
                :src="getPhotoUrl(selectedCustomer.photo)" 
                :alt="selectedCustomer.name"
                class="w-20 h-20 rounded-full object-cover shadow-md border-2 border-sky-200" 
                @error="handleImageError"
              >
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ selectedCustomer.name }}</h1>
                <p class="text-gray-500 mt-1">{{ selectedCustomer.type === 'individual' ? 'Particulier' : selectedCustomer.type === 'company' ? 'Entreprise' : 'Association' }} • {{ selectedCustomer.email }} • {{ selectedCustomer.phone }}</p>
                <p class="text-gray-400 text-sm mt-1">{{ selectedCustomer.address }}, {{ selectedCustomer.city }}, {{ selectedCustomer.country }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Grille des sections (simplifiée pour la lisibilité) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">📦 Équipements</h2>
            </div>
            <div class="p-6">
              <p class="text-gray-500">Nombre d'équipements: {{ selectedCustomer.equipments?.length || 0 }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-900">⚠️ Pannes</h2>
            </div>
            <div class="p-6">
              <p class="text-gray-500">Nombre de pannes: {{ selectedCustomer.breakdowns?.length || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal CNI -->
      <div v-if="showCniModal" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" @click.self="showCniModal = false">
        <div class="relative">
          <img :src="selectedCniImage" class="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl" @error="handleImageError">
          <button @click="showCniModal = false" class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">&times;</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// CORRECTION: L'URL de base de l'API
const API_BASE_URL = 'http://localhost:8000'
const API_URL = `${API_BASE_URL}/api`

// CORRECTION: Configuration axios correcte
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

const router = useRouter()

const formatPrice = (value) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(value || 0))
}

// CORRECTION: Fonction CORRECTE pour obtenir l'URL complète des photos
const getPhotoUrl = (photo) => {
  if (!photo) return `${API_BASE_URL}/default-avatar.png`
  // Si l'URL est déjà complète (commence par http)
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo
  }
  // Si le chemin commence par /storage/
  if (photo.startsWith('/storage/')) {
    return `${API_BASE_URL}${photo}`
  }
  // Si le chemin commence par storage/ (sans slash)
  if (photo.startsWith('storage/')) {
    return `${API_BASE_URL}/${photo}`
  }
  // Sinon, on suppose que c'est un chemin relatif
  return `${API_BASE_URL}/${photo}`
}

// Gestionnaire d'erreur d'image
const handleImageError = (event) => {
  console.error('Erreur chargement image:', event.target.src)
  event.target.src = `${API_BASE_URL}/default-avatar.png`
}

// États
const searchQuery = ref("")
const selectedCustomer = ref(null)
const customers = ref([])
const loading = ref(false)
const loadingDetail = ref(false)
const saving = ref(false)

const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15
})

const showModal = ref(false)
const editingCustomer = ref(null)
const form = ref({ 
  name: "", type: "individual", email: "", phone: "", 
  photo: null, photoPreview: null, existingPhoto: null,
  cni_rccm: null, 
  country: "", city: "", address: "", note: "" 
})

const showEquipmentModal = ref(false)
const showBreakdownModal = ref(false)
const showContractModal = ref(false)
const showInvoiceModal = ref(false)
const showCniModal = ref(false)
const selectedCniImage = ref("")

let searchTimeout = null

// API Functions
const fetchCustomers = async () => {
  loading.value = true
  try {
    const response = await api.get('/customers', {
      params: { search: searchQuery.value, per_page: pagination.value.per_page, page: pagination.value.current_page }
    })
    customers.value = response.data.data
    pagination.value = response.data.meta
    console.log('Clients chargés avec succès:', customers.value.length)
    // Afficher les URLs des photos dans la console pour déboguer
    customers.value.forEach(c => {
      if (c.photo) console.log(`Photo de ${c.name}: ${getPhotoUrl(c.photo)}`)
    })
  } catch (error) {
    console.error('Erreur chargement clients:', error)
    alert("Erreur lors du chargement des clients")
  } finally {
    loading.value = false
  }
}

const fetchCustomerDetail = async (id) => {
  loadingDetail.value = true
  try {
    const response = await api.get(`/customers/${id}`)
    selectedCustomer.value = response.data.data
    console.log('Détails client chargés:', selectedCustomer.value)
  } catch (error) {
    console.error('Erreur chargement détails:', error)
    alert("Erreur lors du chargement des détails")
  } finally {
    loadingDetail.value = false
  }
}

const saveCustomer = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    const textFields = ['name', 'type', 'email', 'phone', 'country', 'city', 'address', 'note']
    textFields.forEach(key => { 
      if (form.value[key]) formData.append(key, form.value[key]) 
    })
    
    if (form.value.photo instanceof File) formData.append('photo', form.value.photo)
    if (form.value.cni_rccm instanceof File) formData.append('cni_rccm', form.value.cni_rccm)

    let response
    if (editingCustomer.value) {
      formData.append('_method', 'PUT')
      response = await axios.post(`${API_URL}/customers/${editingCustomer.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      response = await axios.post(`${API_URL}/customers`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    if (response.data.success) {
      alert(response.data.message || 'Client enregistré')
      await fetchCustomers()
      closeForm()
      if (selectedCustomer.value && editingCustomer.value) await fetchCustomerDetail(selectedCustomer.value.id)
    }
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
    if (error.response?.data?.errors) alert(Object.values(error.response.data.errors).flat().join('\n'))
    else alert("Erreur lors de l'enregistrement")
  } finally {
    saving.value = false
  }
}

const deleteCustomer = async (id) => {
  if (!confirm("Supprimer ce client ?")) return
  loading.value = true
  try {
    await api.delete(`/customers/${id}`)
    alert("Client supprimé")
    await fetchCustomers()
    if (selectedCustomer.value?.id === id) selectedCustomer.value = null
  } catch (error) {
    console.error('Erreur suppression:', error)
    alert("Erreur lors de la suppression")
  } finally {
    loading.value = false
  }
}

// UI Functions
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { pagination.value.current_page = 1; fetchCustomers() }, 500)
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  pagination.value.current_page = page
  fetchCustomers()
}

const openForm = () => {
  editingCustomer.value = null
  form.value = { 
    name: "", type: "individual", email: "", phone: "", 
    photo: null, photoPreview: null, existingPhoto: null,
    cni_rccm: null, 
    country: "", city: "", address: "", note: "" 
  }
  showModal.value = true
}

const editCustomer = (customer) => {
  editingCustomer.value = customer
  form.value = {
    name: customer.name, 
    type: customer.type, 
    email: customer.email, 
    phone: customer.phone,
    photo: null, 
    photoPreview: null, 
    existingPhoto: customer.photo,
    cni_rccm: customer.cni_rccm,
    country: customer.country, 
    city: customer.city, 
    address: customer.address, 
    note: customer.note || ""
  }
  showModal.value = true
}

const closeForm = () => { 
  showModal.value = false
  editingCustomer.value = null
  form.value.photoPreview = null
}

const viewCustomer = async (id) => { 
  await fetchCustomerDetail(id) 
}

const goBackToList = () => { 
  selectedCustomer.value = null
  fetchCustomers() 
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.photo = file
    const reader = new FileReader()
    reader.onload = (e) => { 
      form.value.photoPreview = e.target.result 
    }
    reader.readAsDataURL(file)
  }
}

const handleCniUpload = (event) => { 
  form.value.cni_rccm = event.target.files[0] 
}

const deleteCustomerFromDetail = () => { 
  if (selectedCustomer.value) deleteCustomer(selectedCustomer.value.id) 
}

const openEditForm = () => { 
  editCustomer(selectedCustomer.value)
  showModal.value = true 
}

const viewEquipment = (id) => { 
  router.push(`/equipments/${id}`) 
}

const openEquipmentModal = () => { showEquipmentModal.value = true }
const openBreakdownModal = () => { showBreakdownModal.value = true }
const openContractModal = () => { showContractModal.value = true }
const openInvoiceModal = () => { showInvoiceModal.value = true }

const openCniModal = (cniUrl) => {
  selectedCniImage.value = getPhotoUrl(cniUrl)
  showCniModal.value = true
}

const exportCustomerPdf = () => {
  if (!selectedCustomer.value) return
  
  const printWindow = window.open('', '_blank')
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><title>Fiche Client - ${selectedCustomer.value.name}</title><meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
      .header h1 { color: #0284c7; margin: 0; }
      .section { margin-bottom: 25px; }
      .section-title { color: #0284c7; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 15px; font-size: 18px; font-weight: bold; }
      .info-row { padding: 8px 0; border-bottom: 1px solid #eee; }
      .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
    </style>
    </head>
    <body>
      <div class="header">
        <h1>NEO START TECH</h1>
        <p>Service Maintenance</p>
      </div>
      <div class="section">
        <div class="section-title">Informations client</div>
        <div class="info-row"><strong>Nom:</strong> ${selectedCustomer.value.name}</div>
        <div class="info-row"><strong>Email:</strong> ${selectedCustomer.value.email}</div>
        <div class="info-row"><strong>Téléphone:</strong> ${selectedCustomer.value.phone}</div>
        <div class="info-row"><strong>Adresse:</strong> ${selectedCustomer.value.address}, ${selectedCustomer.value.city}, ${selectedCustomer.value.country}</div>
      </div>
      <div class="footer">
        <p>Document généré le ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}

const exportEquipmentsPdf = () => {}
const exportBreakdownsPdf = () => {}
const exportContractsPdf = () => {}
const exportInvoicesPdf = () => {}

onMounted(() => { 
  fetchCustomers() 
})
</script>