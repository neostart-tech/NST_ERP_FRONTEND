<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
      
      <!-- Header dégradé sky -->
      <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
          <div class="relative z-10">
            <div>
              <h1 class="text-3xl font-bold mb-2">📄 Bon de commande fournisseur</h1>
              <p class="text-sky-100 text-lg">Gérez vos commandes et trouvez les meilleurs prix</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Étape 1 : Choix de l'article -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">1️⃣ Choisir un article</h2>
        <select v-model="selectedArticle" @change="afficherComparaison" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white">
          <option value="">-- Sélectionner un article --</option>
          <option v-for="article in articles" :key="article.id" :value="article.id">
            {{ article.nom }} ({{ article.reference }})
          </option>
        </select>
      </div>

      <!-- Étape 2 : Comparaison des prix -->
      <div v-if="comparaison.length > 0" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">2️⃣ Comparaison des prix</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fournisseur</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Prix unitaire</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in comparaison" :key="item.fournisseur_id" :class="item.estMeilleur ? 'bg-emerald-50' : ''" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm font-medium" :class="item.estMeilleur ? 'text-emerald-800' : 'text-gray-700'">{{ item.fournisseur_nom }}</td>
                <td class="px-6 py-4 text-sm" :class="item.estMeilleur ? 'font-bold text-emerald-700' : 'text-gray-600'">{{ formatPrice(item.prix) }} €</td>
                <td class="px-6 py-4 text-sm">
                  <button @click="selectionnerFournisseur(item)" class="bg-sky-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-sky-700 transition shadow-sm">
                    Choisir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500 mt-3 flex items-center gap-1">⭐ Le moins cher est surligné en vert</p>
      </div>

      <!-- Étape 3 : Création du BC -->
      <div v-if="fournisseurChoisi" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">3️⃣ Créer le bon de commande</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
            <input type="text" :value="fournisseurChoisi.nom" disabled class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-gray-700">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Article</label>
            <input type="text" :value="getArticleNom(selectedArticle)" disabled class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-gray-700">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
            <input type="text" :value="formatPrice(prixChoisi) + ' €'" disabled class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full text-gray-700">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
            <input v-model="quantite" type="number" min="1" class="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
          </div>
        </div>
        <button @click="genererBC" :disabled="isGenerating" class="mt-4 bg-sky-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-sky-700 transition disabled:opacity-50 shadow-sm">
          {{ isGenerating ? 'Génération...' : '📝 Générer le bon de commande' }}
        </button>
      </div>

      <!-- Barre de recherche -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
        <div class="flex gap-4">
          <div class="relative flex-1">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="🔍 Rechercher par numéro BC, fournisseur ou article..." 
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

      <!-- Historique des BC -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">📋 Historique des bons de commande</h2>
          <div class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Total: {{ bonsCommandeFiltres.length }} BC
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">N° BC</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fournisseur</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Article</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Qté</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(bc, index) in bonsCommandePagines" :key="bc.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-6 py-4 text-sm font-mono font-semibold text-gray-800">{{ bc.numero }}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ bc.fournisseur_nom }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ bc.article_nom }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ bc.quantite }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-sky-600">{{ formatPrice(bc.total) }} €</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(bc.statut)" class="px-2 py-1 rounded-full text-xs font-semibold">
                    {{ getStatusLabel(bc.statut) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button @click="genererPDF(bc)" class="text-red-500 hover:text-red-700 transition" title="Télécharger PDF">📄</button>
                    <button @click="modifierBC(bc)" class="text-indigo-600 hover:text-indigo-800 transition" title="Modifier">✏️</button>
                    <button v-if="bc.statut !== 'received'" @click="marquerRecu(bc)" class="bg-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-medium hover:bg-emerald-700 transition">✅ Reçu</button>
                    <button @click="supprimerBC(bc.id)" class="text-red-500 hover:text-red-700 transition" title="Supprimer" :disabled="isDeleting === bc.id">
                      {{ isDeleting === bc.id ? '...' : '🗑️' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="bonsCommandeFiltres.length === 0 && !isLoadingList">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-5xl">📄</span>
                    <p class="font-medium">Aucun bon de commande trouvé</p>
                    <p class="text-xs text-gray-400">Créez votre premier bon de commande ci-dessus</p>
                  </div>
                </td>
              </tr>
              <tr v-if="isLoadingList">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
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
            Affichage de {{ startIndex + 1 }} à {{ endIndex }} sur {{ bonsCommandeFiltres.length }} BC
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

    <!-- Modal de modification -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showEditModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <h3 class="text-xl font-bold text-gray-900">✏️ Modifier le bon de commande</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
            <input v-model="editBC.quantite" type="number" min="1" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select v-model="editBC.statut" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white">
              <option value="sent">📧 Envoyé</option>
              <option value="received">✅ Reçu</option>
              <option value="cancelled">❌ Annulé</option>
            </select>
          </div>
        </div>
        <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button @click="showEditModal = false" class="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
            Annuler
          </button>
          <button @click="mettreAJourBC" :disabled="isUpdating" class="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition disabled:opacity-50 font-medium">
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
import jsPDF from 'jspdf'

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
const isLoadingList = ref(false)
const isGenerating = ref(false)
const isDeleting = ref(null)
const isUpdating = ref(false)
const showEditModal = ref(false)
const searchTerm = ref('')

// Données API
const articles = ref([])
const bonsCommande = ref([])

// Formulaire de création
const selectedArticle = ref('')
const comparaison = ref([])
const fournisseurChoisi = ref(null)
const prixChoisi = ref(null)
const quantite = ref(10)

// Édition
const editBC = ref({
  id: null,
  quantite: 0,
  statut: ''
})

// Helper functions
const formatPrice = (price) => {
  if (!price && price !== 0) return '0.00'
  return parseFloat(price).toFixed(2)
}

const getStatusLabel = (status) => {
  const labels = {
    'sent': '📧 Envoyé',
    'received': '✅ Reçu',
    'cancelled': '❌ Annulé',
    'draft': '📝 Brouillon'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'sent': 'bg-amber-100 text-amber-800',
    'received': 'bg-emerald-100 text-emerald-800',
    'cancelled': 'bg-red-100 text-red-800',
    'draft': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getArticleNom = (id) => {
  const article = articles.value.find(a => a.id === parseInt(id))
  return article ? article.nom : ''
}

// Charger les articles depuis l'API
const chargerArticles = async () => {
  try {
    const response = await api.get('/purchase-orders/products')
    if (response.data.success) {
      articles.value = response.data.data || []
    }
  } catch (error) {
    console.error('Erreur chargement articles:', error)
    alert('Erreur lors du chargement des articles')
  }
}

// Charger les bons de commande
const chargerBonsCommande = async () => {
  isLoadingList.value = true
  try {
    const response = await api.get('/purchase-orders')
    if (response.data.success) {
      bonsCommande.value = response.data.data || []
      currentPage.value = 1
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors du chargement des bons de commande: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoadingList.value = false
  }
}

// Afficher la comparaison des prix
const afficherComparaison = async () => {
  if (!selectedArticle.value) {
    comparaison.value = []
    return
  }
  
  try {
    const response = await api.get(`/purchase-orders/supplier-prices/${selectedArticle.value}`)
    if (response.data.success) {
      comparaison.value = response.data.data || []
    }
  } catch (error) {
    console.error('Erreur chargement prix:', error)
    alert('Erreur lors du chargement des prix fournisseurs')
    comparaison.value = []
  }
}

// Sélectionner un fournisseur
const selectionnerFournisseur = (item) => {
  fournisseurChoisi.value = {
    id: item.fournisseur_id,
    nom: item.fournisseur_nom
  }
  prixChoisi.value = item.prix
}

// Générer un bon de commande
const genererBC = async () => {
  if (!fournisseurChoisi.value || !selectedArticle.value) {
    alert('Veuillez sélectionner un article et un fournisseur')
    return
  }
  
  if (!quantite.value || quantite.value <= 0) {
    alert('Veuillez saisir une quantité valide')
    return
  }
  
  isGenerating.value = true
  try {
    const response = await api.post('/purchase-orders', {
      fournisseur_id: fournisseurChoisi.value.id,
      article_id: parseInt(selectedArticle.value),
      quantite: parseInt(quantite.value),
      prix_unitaire: parseFloat(prixChoisi.value)
    })
    
    if (response.data.success) {
      alert(`✅ Bon de commande ${response.data.data.numero} généré avec succès !`)
      
      fournisseurChoisi.value = null
      prixChoisi.value = null
      quantite.value = 10
      selectedArticle.value = ''
      comparaison.value = []
      
      await chargerBonsCommande()
      currentPage.value = totalPages.value
    }
  } catch (error) {
    console.error('Erreur création BC:', error)
    let errorMessage = 'Erreur lors de la création du bon de commande'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      errorMessage = errors.join('\n')
    }
    alert(`❌ ${errorMessage}`)
  } finally {
    isGenerating.value = false
  }
}

// Marquer un BC comme reçu
const marquerRecu = async (bc) => {
  if (!confirm(`Marquer ${bc.numero} comme reçu ? Cela permettra de créer des lots dans la réception.`)) return
  
  try {
    const response = await api.put(`/purchase-orders/${bc.id}`, {
      quantite: bc.quantite,
      statut: 'received'
    })
    
    if (response.data.success) {
      alert(`✅ ${bc.numero} marqué comme reçu ! Vous pouvez maintenant créer un lot dans l'interface Réception.`)
      await chargerBonsCommande()
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur: ' + (error.response?.data?.message || error.message))
  }
}

// Supprimer un BC
const supprimerBC = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce bon de commande ?')) return
  
  isDeleting.value = id
  try {
    const response = await api.delete(`/purchase-orders/${id}`)
    
    if (response.data.success) {
      alert('✅ Bon de commande supprimé avec succès')
      await chargerBonsCommande()
      
      if (bonsCommandePagines.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
      }
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la suppression: ' + (error.response?.data?.message || error.message))
  } finally {
    isDeleting.value = null
  }
}

// Modifier un BC
const modifierBC = (bc) => {
  editBC.value = {
    id: bc.id,
    quantite: bc.quantite,
    statut: bc.statut
  }
  showEditModal.value = true
}

// Mettre à jour un BC
const mettreAJourBC = async () => {
  if (!editBC.value.quantite || editBC.value.quantite <= 0) {
    alert('Veuillez saisir une quantité valide')
    return
  }
  
  isUpdating.value = true
  try {
    const response = await api.put(`/purchase-orders/${editBC.value.id}`, {
      quantite: parseInt(editBC.value.quantite),
      statut: editBC.value.statut
    })
    
    if (response.data.success) {
      alert('✅ Bon de commande modifié avec succès')
      showEditModal.value = false
      await chargerBonsCommande()
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la modification: ' + (error.response?.data?.message || error.message))
  } finally {
    isUpdating.value = false
  }
}

// Générer PDF avec jsPDF
const genererPDF = (bc) => {
  const doc = new jsPDF()
  
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text('BON DE COMMANDE', 105, 20, { align: 'center' })
  
  doc.setLineWidth(0.5)
  doc.line(20, 30, 190, 30)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Date d'édition : ${new Date().toLocaleDateString()}`, 20, 45)
  doc.text(`N° Document : ${bc.numero}`, 150, 45)
  
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('FOURNISSEUR', 20, 70)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`Nom : ${bc.fournisseur_nom}`, 20, 85)
  doc.text(`ID Fournisseur : ${bc.fournisseur_id}`, 20, 100)
  
  doc.setFont('helvetica', 'bold')
  doc.text('DÉTAILS COMMANDE', 20, 130)
  doc.setFont('helvetica', 'normal')
  
  doc.setFillColor(240, 240, 240)
  doc.rect(20, 140, 170, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('Désignation', 25, 148)
  doc.text('Quantité', 100, 148)
  doc.text('Prix unitaire', 130, 148)
  doc.text('Total HT', 165, 148)
  
  doc.setFont('helvetica', 'normal')
  const prixUnitaire = (bc.total / bc.quantite).toFixed(2)
  doc.text(bc.article_nom, 25, 165)
  doc.text(bc.quantite.toString(), 100, 165)
  doc.text(`${prixUnitaire} €`, 130, 165)
  doc.text(`${bc.total} €`, 165, 165)
  
  doc.setLineWidth(0.3)
  doc.line(20, 175, 190, 175)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL TTC :', 140, 190)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 100, 0)
  doc.text(`${formatPrice(bc.total)} €`, 165, 190)
  
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  const statutLabel = bc.statut === 'sent' ? '📧 ENVOYÉ' : bc.statut === 'received' ? '✅ REÇU' : bc.statut.toUpperCase()
  doc.text(`Statut : ${statutLabel}`, 20, 220)
  
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Neo Start Tech - Business Manager', 105, 280, { align: 'center' })
  doc.text(`Généré le ${new Date().toLocaleString()}`, 105, 288, { align: 'center' })
  
  doc.save(`${bc.numero}.pdf`)
  alert(`📄 PDF ${bc.numero} généré avec succès !`)
}

// Filtre par recherche
const bonsCommandeFiltres = computed(() => {
  let filtered = bonsCommande.value
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = bonsCommande.value.filter(bc => 
      bc.numero?.toLowerCase().includes(search) ||
      bc.fournisseur_nom?.toLowerCase().includes(search) ||
      bc.article_nom?.toLowerCase().includes(search)
    )
  }
  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(bonsCommandeFiltres.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, bonsCommandeFiltres.value.length))

const bonsCommandePagines = computed(() => {
  return bonsCommandeFiltres.value.slice(startIndex.value, endIndex.value)
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
  await chargerArticles()
  await chargerBonsCommande()
})
</script>