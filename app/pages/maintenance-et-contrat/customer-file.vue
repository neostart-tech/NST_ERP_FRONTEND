<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- Header dégradé sky -->
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 class="text-3xl font-bold mb-2">📁 Explorateur de fichiers</h1>
                <p class="text-sky-100 text-lg">Gérez les documents de vos clients</p>
              </div>
              <div class="flex gap-3">
                <button @click="refresh" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition font-medium">
                  🔄 Actualiser
                </button>
                <button @click="exportAll" class="bg-white text-sky-700 px-4 py-2 rounded-xl hover:bg-sky-50 transition font-medium shadow-md">
                  📦 Exporter tout (ZIP)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sélecteur client -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-3">
            <span class="text-gray-600 font-medium">👥 Client :</span>
            <select v-model="selectedCustomerId" @change="loadCustomerFiles" class="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white min-w-[200px]">
              <option value="">Sélectionner un client</option>
              <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div v-if="selectedCustomerId && currentCustomer" class="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            Client actuel : <span class="font-semibold text-sky-700">{{ currentCustomer.name }}</span>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div v-if="selectedCustomerId && currentCustomer">
        <!-- Barre de recherche -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher un fichier ou dossier..." 
              @input="filterItems"
              class="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button v-if="searchQuery" @click="searchQuery = ''; filterItems()" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>
          <p v-if="searchQuery" class="text-xs text-gray-500 mt-2">{{ filteredItems.length }} résultat(s) trouvé(s)</p>
        </div>

        <!-- Chemin actuel -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-1 flex-wrap">
              <span class="text-gray-500 text-lg">📁</span>
              <button @click="navigateToPath('')" class="text-sky-600 hover:text-sky-800 font-medium">{{ currentCustomer.name }}</button>
              <template v-for="(part, index) in currentPathParts" :key="index">
                <span class="text-gray-400">/</span>
                <button @click="navigateToPath(part.fullPath)" class="text-sky-600 hover:text-sky-800 font-medium">{{ part.name }}</button>
              </template>
            </div>
            <button @click="createFolder" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition font-medium text-sm shadow-sm">
              + Nouveau dossier
            </button>
          </div>
        </div>

        <!-- Zone principale : Arborescence + Contenu -->
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Arborescence latérale -->
          <div class="lg:w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <div class="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🌳</span> Arborescence
            </div>
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div class="border-t pt-2 mt-1">
                <div class="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5" @click="toggleSection('standard')">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">📂</span>
                    <span class="font-medium text-gray-700">Dossiers</span>
                  </div>
                  <svg class="w-4 h-4 transition-transform text-gray-500" :class="{ 'rotate-90': expandedSections.standard }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
                <div v-show="expandedSections.standard" class="ml-7 mt-2 space-y-1">
                  <div v-for="folder in standardFolders" :key="folder.path" 
                       class="cursor-pointer hover:text-sky-600 flex items-center gap-2 text-sm py-1 px-2 rounded-lg transition"
                       :class="{ 'bg-sky-50 text-sky-700 font-semibold': currentPath === folder.path }" 
                       @click="navigateToPath(folder.path)">
                    <span>📁</span> {{ folder.name }}
                  </div>
                  <div v-if="standardFolders.length === 0" class="text-gray-400 text-xs italic px-2">Aucun dossier</div>
                </div>
              </div>
            </div>
            <button @click="createFolder" class="mt-5 w-full px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-medium hover:bg-sky-700 transition shadow-sm">
              + Nouveau dossier
            </button>
          </div>

          <!-- Zone de contenu -->
          <div class="flex-1">
            <div v-if="loading" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
              <p class="mt-3 text-gray-500">Chargement...</p>
            </div>
            <div v-else-if="filteredItems.length === 0 && !searchQuery" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center border-dashed">
              <div class="text-5xl mb-3">📂</div>
              <p class="text-gray-500">Aucun fichier ou dossier</p>
              <div class="mt-3 flex gap-3 justify-center">
                <button @click="createFolder" class="text-sky-600 font-medium hover:underline">Créer un dossier</button>
                <span class="text-gray-300">|</span>
                <button @click="triggerFileUpload" class="text-sky-600 font-medium hover:underline">Uploader un fichier</button>
              </div>
            </div>
            <div v-else-if="filteredItems.length === 0 && searchQuery" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
              <p class="text-gray-500">🔍 Aucun résultat pour "{{ searchQuery }}"</p>
            </div>
            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <!-- Dossiers -->
              <div v-for="folder in filteredFolders" :key="folder.path" 
                   class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center cursor-pointer hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5" 
                   @click="openFolder(folder)">
                <div class="text-5xl mb-2">📁</div>
                <div class="font-semibold text-gray-800 truncate">{{ folder.name }}</div>
                <div class="text-xs text-gray-400 mt-0.5">Dossier</div>
                <div class="flex justify-center gap-3 mt-3 pt-2 border-t border-gray-100">
                  <button @click.stop="renameItem(folder, 'folder')" class="text-xs text-emerald-600 hover:text-emerald-800 font-medium">Renommer</button>
                  <button @click.stop="deleteItem(folder, 'folder')" class="text-xs text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                </div>
              </div>

              <!-- Fichiers -->
              <div v-for="file in filteredFiles" :key="file.path" 
                   class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center cursor-pointer hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5" 
                   @click="openPreview(file)">
                <div class="text-5xl mb-2">{{ fileIcon(file) }}</div>
                <div class="font-semibold text-gray-800 text-sm truncate">{{ file.name }}</div>
                <div class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</div>
                <div class="flex justify-center gap-3 mt-3 pt-2 border-t border-gray-100">
                  <button @click.stop="downloadFile(file)" class="text-xs text-sky-600 hover:text-sky-800 font-medium">Télécharger</button>
                  <button @click.stop="renameItem(file, 'file')" class="text-xs text-emerald-600 hover:text-emerald-800 font-medium">Renommer</button>
                  <button @click.stop="deleteItem(file, 'file')" class="text-xs text-red-500 hover:text-red-700 font-medium">Supprimer</button>
                </div>
              </div>
            </div>

            <!-- Zone d'upload -->
            <div class="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition bg-white" @click="triggerFileUpload">
              <div class="text-3xl mb-2">📤</div>
              <div class="text-sm text-gray-500">Cliquez ou glissez-déposez pour uploader un fichier</div>
              <input type="file" ref="fileInput" class="hidden" @change="uploadFile" multiple>
            </div>
          </div>
        </div>
      </div>

      <!-- État : client sélectionné mais pas chargé -->
      <div v-else-if="selectedCustomerId && !currentCustomer" class="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <p class="mt-3 text-gray-500">Chargement...</p>
      </div>

      <!-- État : aucun client sélectionné -->
      <div v-else class="bg-white rounded-xl shadow-lg border border-gray-100 border-dashed p-10 text-center">
        <div class="text-5xl mb-3">👈</div>
        <p class="text-gray-500">Sélectionnez un client pour accéder à ses fichiers</p>
      </div>

      <!-- Modal Renommer -->
      <div v-if="showRenameModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showRenameModal = false">
        <div class="bg-white rounded-2xl p-6 w-96 shadow-2xl">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Renommer</h3>
          <input v-model="newName" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" autofocus>
          <div class="flex justify-end gap-3 mt-6">
            <button @click="showRenameModal = false" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">Annuler</button>
            <button @click="confirmRename" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">Valider</button>
          </div>
        </div>
      </div>

      <!-- Modal Aperçu -->
      <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click.self="showPreviewModal = false">
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          <div class="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-800">Aperçu - {{ previewFileData?.name }}</h3>
            <button @click="showPreviewModal = false" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <iframe v-if="isPdf" :src="previewFileData?.url" class="w-full h-[70vh] border-0 rounded-lg"></iframe>
            <img v-else-if="isImage" :src="previewFileData?.url" class="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-md">
            <div v-else class="text-center py-12">
              <div class="text-7xl mb-4">{{ fileIcon(previewFileData) }}</div>
              <p class="text-gray-500 mb-4">Aperçu non disponible pour ce type de fichier</p>
              <button @click="downloadFile(previewFileData)" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition">Télécharger</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
})

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// File icon based on extension
const fileIcon = (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return '📄'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️'
  if (['doc', 'docx'].includes(ext)) return '📝'
  if (['xls', 'xlsx'].includes(ext)) return '📊'
  if (['zip', 'rar', '7z'].includes(ext)) return '🗜️'
  if (['txt', 'md'].includes(ext)) return '📃'
  return '📎'
}

// États
const expandedSections = ref({ standard: true })
const customers = ref([])
const selectedCustomerId = ref("")
const currentCustomer = ref(null)
const currentPath = ref("")
const searchQuery = ref("")
const folderContent = ref([])
const loading = ref(false)

const showRenameModal = ref(false)
const renameTarget = ref(null)
const renameType = ref('folder')
const newName = ref("")

const previewFileData = ref(null)
const showPreviewModal = ref(false)

const fileInput = ref(null)

// Computed
const currentPathParts = computed(() => {
  if (!currentPath.value) return []
  const parts = currentPath.value.split('/').filter(p => p)
  let fullPath = ""
  return parts.map(part => {
    fullPath = fullPath ? `${fullPath}/${part}` : part
    return { name: part, fullPath }
  })
})

const currentItems = computed(() => {
  if (!currentPath.value) {
    return folderContent.value.filter(item => item.folder_path === '/')
  }
  return folderContent.value.filter(item => item.folder_path === currentPath.value)
})

const allItems = computed(() => [...currentItems.value])

const filteredItems = computed(() => {
  if (!searchQuery.value) return allItems.value
  const q = searchQuery.value.toLowerCase()
  return allItems.value.filter(item => item.name.toLowerCase().includes(q))
})

const filteredFolders = computed(() => filteredItems.value.filter(item => item.type === "folder"))
const filteredFiles = computed(() => filteredItems.value.filter(item => item.type === "file"))

const standardFolders = computed(() => {
  return folderContent.value
    .filter(item => item.type === "folder" && item.folder_path === '/')
    .map(item => ({ name: item.name, path: '/' + item.name }))
})

const isPdf = computed(() => previewFileData.value?.name?.toLowerCase().endsWith('.pdf'))
const isImage = computed(() => {
  const ext = previewFileData.value?.name?.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
})

// API Functions
const fetchCustomers = async () => {
  try {
    const response = await api.get('/customer-files/customers/list')
    customers.value = response.data.data || []
  } catch (error) {
    console.error("Erreur chargement clients:", error)
    alert("Erreur lors du chargement des clients")
  }
}

const fetchFolderContent = async () => {
  if (!selectedCustomerId.value) return
  
  loading.value = true
  try {
    const response = await api.get(`/customer-files/${selectedCustomerId.value}/content`, {
      params: { path: currentPath.value || '/' }
    })
    folderContent.value = response.data.data || []
  } catch (error) {
    console.error("Erreur chargement fichiers:", error)
    alert("Erreur lors du chargement des fichiers")
  } finally {
    loading.value = false
  }
}

const loadCustomerFiles = () => {
  if (!selectedCustomerId.value) {
    currentCustomer.value = null
    folderContent.value = []
    return
  }
  const customer = customers.value.find(c => c.id === parseInt(selectedCustomerId.value))
  currentCustomer.value = customer
  currentPath.value = ""
  searchQuery.value = ""
  fetchFolderContent()
}

const refresh = () => { fetchFolderContent() }

// Navigation
const navigateToPath = (path) => {
  currentPath.value = path
  searchQuery.value = ""
  fetchFolderContent()
}

const openFolder = (folder) => { navigateToPath(folder.path) }
const filterItems = () => {}

// File operations
const triggerFileUpload = () => { fileInput.value.click() }

const uploadFile = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  const formData = new FormData()
  files.forEach(file => { formData.append('files[]', file) })
  formData.append('folder_path', currentPath.value || '/')

  try {
    const response = await api.post(`/customer-files/${selectedCustomerId.value}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (response.data.success) {
      alert(response.data.message)
      await fetchFolderContent()
    }
  } catch (error) {
    console.error("Erreur upload:", error)
    alert("Erreur lors de l'upload")
  }
  
  fileInput.value.value = ""
}

const downloadFile = async (file) => {
  try {
    const response = await api.get(`/customer-files/${selectedCustomerId.value}/${file.id}/download`, {
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.name)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Erreur téléchargement:", error)
    alert("Erreur lors du téléchargement")
  }
}

const createFolder = async () => {
  const folderName = prompt("Nom du dossier :")
  if (!folderName) return

  try {
    const response = await api.post(`/customer-files/${selectedCustomerId.value}/folder`, {
      folder_name: folderName,
      parent_path: currentPath.value || '/'
    })
    
    if (response.data.success) {
      alert(response.data.message)
      await fetchFolderContent()
    } else {
      alert(response.data.message)
    }
  } catch (error) {
    console.error("Erreur création dossier:", error)
    alert("Erreur lors de la création du dossier")
  }
}

const renameItem = (item, type) => {
  renameTarget.value = item
  renameType.value = type
  newName.value = item.name
  showRenameModal.value = true
}

const confirmRename = async () => {
  if (!newName.value) return

  try {
    const response = await api.put(`/customer-files/${selectedCustomerId.value}/${renameTarget.value.id}/rename`, {
      new_name: newName.value
    })
    
    if (response.data.success) {
      alert(response.data.message)
      await fetchFolderContent()
    }
  } catch (error) {
    console.error("Erreur renommage:", error)
    alert("Erreur lors du renommage")
  }
  
  showRenameModal.value = false
  renameTarget.value = null
}

const deleteItem = async (item, type) => {
  if (!confirm(`Supprimer ${item.name} ?`)) return

  try {
    const response = await api.delete(`/customer-files/${selectedCustomerId.value}/${item.id}`)
    
    if (response.data.success) {
      alert(response.data.message)
      await fetchFolderContent()
    }
  } catch (error) {
    console.error("Erreur suppression:", error)
    alert("Erreur lors de la suppression")
  }
}

const openPreview = (file) => {
  previewFileData.value = file
  showPreviewModal.value = true
}

const exportAll = async () => {
  try {
    window.open(`${API_BASE_URL}/customer-files/${selectedCustomerId.value}/export-all`, '_blank')
  } catch (error) {
    console.error("Erreur export:", error)
    alert("Erreur lors de l'export")
  }
}

const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

watch(selectedCustomerId, () => { loadCustomerFiles() })

onMounted(() => { fetchCustomers() })
</script>