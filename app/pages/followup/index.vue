<template>
  <main class="flex-1 p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 w-full">
        <!-- Header avec gradient -->
        <div class="relative mb-6">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-xl shadow-lg p-6 text-white overflow-hidden">
            <!-- Motif de fond décoratif -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
              <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full"></div>
              <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
            </div>
            
            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">Gestion des Recouvrements</h1>
                  <p class="text-red-100 text-lg">Suivez et gérez les paiements en retard</p>
                  <div class="flex items-center gap-6 mt-4 text-sm">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span class="text-red-100">{{ kpis.facturesEnRetard }} Factures en retard</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span class="text-red-100">{{ kpis.retardGrave }} > 60 jours</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-white rounded-full"></div>
                      <span class="text-red-100">{{ formatCurrency(kpis.montantImpaye) }} à recouvrer</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3">
                  <button 
                    @click="exportToExcel" 
                    class="group px-6 py-3 bg-white text-red-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
                  >
                    <div class="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    Exporter les données
                  </button>
                  
                  <button 
                    class="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Historique des relances
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques rapides -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Factures en retard</p>
                <p class="text-3xl font-bold text-red-600">{{ kpis.facturesEnRetard }}</p>
                <p class="text-xs text-gray-500 mt-1">Dont {{ kpis.retardGrave }} > 60j</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Montant impayé</p>
                <p class="text-3xl font-bold text-yellow-600">{{ formatCurrency(kpis.montantImpaye) }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ kpis.nbClientsEnRetard }} clients concernés</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">À recouvrer (30j)</p>
                <p class="text-3xl font-bold text-blue-600">{{ formatCurrency(kpis.aRecouvrer30j) }}</p>
                <p class="text-xs text-gray-500 mt-1">Échéance proche</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Taux recouvrement</p>
                <p class="text-3xl font-bold text-green-600">{{ kpis.tauxRecouvrement }}%</p>
                <p class="text-xs text-gray-500 mt-1">30 derniers jours</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau des factures -->
        <div class="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
          <!-- Header du tableau -->
           <div class="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Factures en attente</h2>
                <p class="text-gray-600 text-sm mt-1">{{ filteredFactures.length }} facture(s) affichée(s)</p>
              </div>
              
              <div class="flex flex-wrap gap-3">
                <!-- Filtres compacts -->
                <select v-model="filters.commercial" class="text-xs px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 w-full sm:w-auto">
                  <option value="">Tous commerciaux</option>
                  <option v-for="com in commerciaux" :value="com.id">{{ com.nom }}</option>
                </select>
                
                <select v-model="filters.statut" class="text-xs px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 w-full sm:w-auto">
                  <option value="">Tous statuts</option>
                  <option value="paye">Payé</option>
                  <option value="attente">En attente</option>
                  <option value="retard">En retard</option>
                </select>
                
                <select v-model="filters.module" class="text-xs px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 w-full sm:w-auto">
                  <option value="">Tous modules</option>
                  <option value="vente">Vente</option>
                  <option value="ao">Appel d'offres</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

         <!-- Tableau -->
<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200 max-w-full">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Référence</th>
        <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Client</th>
        <!-- <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Commercial</th> -->
        <!-- <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Module</th> -->
        <!-- <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Échéance</th> -->
        <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Montant</th>
        <!-- <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Statut</th> -->
        <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-100">
      <tr 
        v-for="facture in invoiceStore.facture" 
        :key="facture.id" 
        class="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300"
      >
        <td class="px-4 py-4 whitespace-nowrap font-medium text-gray-900 text-sm">
          {{ facture.reference }}
        </td>
        <td class="px-3 py-4 whitespace-nowrap text-gray-700 text-sm truncate max-w-[120px]">
          {{ facture.order.client.name}}
        </td>
       
        <td class="px-3 py-4 whitespace-nowrap font-semibold text-gray-700 text-sm">
          {{ formatCurrency(facture.total) }}
        </td>
      
        <td class="px-3 py-4 whitespace-nowrap text-sm">
          <div class="flex items-center gap-1">
            <button 
              @click="$router.push(`/followup/details`)"
              class="p-1.5 text-sky-600 hover:text-white hover:bg-sky-600 rounded-md transition-all duration-200"
              title="Détails"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
            <button 
              @click="relancer(facture)" 
              class="p-1.5 text-orange-600 hover:text-white hover:bg-orange-600 rounded-md transition-all duration-200"
              title="Relancer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </button>
            <button 
              v-if="facture.statut !== 'paye'" 
              @click="enregistrerPaiement(facture)" 
              class="p-1.5 text-green-600 hover:text-white hover:bg-green-600 rounded-md transition-all duration-200"
              title="Payer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
      <tr v-if="filteredFactures.length === 0">
        <td colspan="8" class="px-4 py-8 text-center">
          <div class="flex flex-col items-center justify-center">
            <svg class="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p class="text-gray-500 text-base font-medium">Aucune facture trouvée</p>
            <p class="text-gray-400 text-xs mt-1">Essayez de modifier vos critères de recherche</p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
        </div>
      </div>
    </main>
  
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useInvoiceStore } from '#imports'
import { onMounted } from 'vue'

// KPIs
const kpis = reactive({
  facturesEnRetard: 24,
  retardGrave: 8,
  montantImpaye: 1850000,
  nbClientsEnRetard: 15,
  aRecouvrer30j: 620000,
  tauxRecouvrement: 72
})

// Filtres
const filters = reactive({
  commercial: '',
  statut: '',
  module: ''
})

// Données factures
const factures = ref([
])

//Affichage des factures
const invoiceStore=useInvoiceStore()
onMounted(()=>{
  invoiceStore.fetchInvoice()
})
// Commerciaux
const commerciaux = ref([])

// Sélections et modals
const selectedFacture = ref(null)
const showRelanceModal = ref(false)
const showPaiementModal = ref(false)
const factureAPayer = ref(null)

// Nouvelle relance
const nouvelleRelance = reactive({
  type: 'email',
  commentaire: ''
})

// Paiement
const paiement = reactive({
  date: new Date().toISOString().split('T')[0],
  mode: 'virement',
  reference: ''
})

// Fonctions de formatage
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'decimal', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(amount) + ' FCFA'
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatStatut = (statut) => {
  const statuts = {
    'paye': 'Payé',
    'attente': 'En attente',
    'retard': 'En retard'
  }
  return statuts[statut] || statut
}

const formatModule = (module) => {
  const modules = {
    'vente': 'Vente',
    'ao': 'Appel d\'offres',
    'maintenance': 'Maintenance'
  }
  return modules[module] || module
}

const formatRelanceType = (type) => {
  const types = {
    'email': 'Email',
    'appel': 'Appel téléphonique',
    'courrier': 'Courrier',
    'sms': 'SMS'
  }
  return types[type] || type
}

const daysLate = (echeance) => {
  const echeanceDate = new Date(echeance)
  const today = new Date()
  const diffTime = today - echeanceDate
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
}

// Filtrage des factures
const filteredFactures = computed(() => {
  return factures.value.filter(facture => {
    const matchesCommercial = !filters.commercial || facture.commercial === commerciaux.value.find(c => c.id == filters.commercial)?.nom
    const matchesStatut = !filters.statut || facture.statut === filters.statut
    const matchesModule = !filters.module || facture.module === filters.module
    return matchesCommercial && matchesStatut && matchesModule
  })
})

// Actions
const viewFacture = (facture) => {
  selectedFacture.value = facture
}

const relancer = (facture) => {
  selectedFacture.value = facture
  showRelanceModal.value = true
}

const ajouterRelance = () => {
  if (!selectedFacture.value) return
  
  const newRelance = {
    id: selectedFacture.value.relances.length + 1,
    type: nouvelleRelance.type,
    date: new Date().toISOString(),
    auteur: 'Vous',
    commentaire: nouvelleRelance.commentaire
  }
  
  selectedFacture.value.relances.unshift(newRelance)
  nouvelleRelance.type = 'email'
  nouvelleRelance.commentaire = ''
  showRelanceModal.value = false
}

const enregistrerPaiement = (facture) => {
  factureAPayer.value = facture
  showPaiementModal.value = true
}

const validerPaiement = () => {
  const facture = factures.value.find(f => f.id === factureAPayer.value.id)
  if (facture) {
    facture.statut = 'paye'
    facture.datePaiement = paiement.date
    facture.relances.push({
      id: facture.relances.length + 1,
      type: 'paiement',
      date: new Date().toISOString(),
      auteur: 'Vous',
      commentaire: `Paiement enregistré (${paiement.mode}, réf: ${paiement.reference})`
    })
  }
  
  // Réinitialiser
  paiement.mode = 'virement'
  paiement.reference = ''
  showPaiementModal.value = false
  factureAPayer.value = null
}

const exportToExcel = () => {
  alert('Export Excel en cours de développement')
}
</script>

<style scoped>
/* Animation pour les cartes de statistiques */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover .group-hover\:inline {
  animation: slideInUp 0.2s ease-out;
}

/* Effet de survol pour les lignes du tableau */
.group:hover {
  box-shadow: 0 4px 15px -4px rgba(239, 68, 68, 0.15);
}

/* Style pour les boutons d'action */
.group:hover .group-hover\:bg-sky-600,
.group:hover .group-hover\:bg-orange-600,
.group:hover .group-hover\:bg-green-600 {
  transform: scale(1.05);
}
</style>