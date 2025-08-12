<template>
  
    <main class="flex-1 p-6 bg-gray-50 min-h-screen">
      <!-- Header avec retour -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center gap-4 mb-4">
          <button @click="retour" class="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour au tableau de bord
          </button>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ facture.reference }}</h1>
            <p class="text-gray-600 mt-1">Client: {{ facture.client }}</p>
          </div>
          <div class="flex gap-3">
            <button @click="telechargerPDF" class="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Télécharger PDF
            </button>
            <button v-if="facture.statut !== 'Payé'" @click="marquerPaye" class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Marquer Payé
            </button>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="max-w-7xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex">
              <button 
                @click="activeTab = 'details'"
                :class="{'border-sky-500 text-sky-600': activeTab === 'details', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'details'}"
                class="py-4 px-6 border-b-2 font-medium text-sm focus:outline-none transition-colors"
              >
                Détails de la facture
              </button>
              <button 
                @click="activeTab = 'relances'"
                :class="{'border-sky-500 text-sky-600': activeTab === 'relances', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'relances'}"
                class="py-4 px-6 border-b-2 font-medium text-sm focus:outline-none transition-colors"
              >
                Historique des relances
                <span v-if="relances.length > 0" class="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{{ relances.length }}</span>
              </button>
            </nav>
          </div>

          <!-- Onglet Détails de la facture -->
          <div v-if="activeTab === 'details'" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <!-- Informations principales -->
              <div class="space-y-6">
                <div class="bg-gray-50 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Numéro:</span>
                      <span class="text-gray-900">{{ facture.reference }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Date d'émission:</span>
                      <span class="text-gray-900">{{ formatDate(facture.dateEmission) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Date d'échéance:</span>
                      <span class="text-gray-900">{{ formatDate(facture.dateEcheance) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Module:</span>
                      <span 
                        :class="{
                          'bg-blue-100 text-blue-800': facture.module === 'Vente',
                          'bg-purple-100 text-purple-800': facture.module === 'Appel d\'offres',
                          'bg-green-100 text-green-800': facture.module === 'Maintenance'
                        }"
                        class="px-3 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ facture.module }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Commercial:</span>
                      <span class="text-gray-900">{{ facture.commercial }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Statut:</span>
                      <span 
                        :class="{
                          'bg-green-100 text-green-800': facture.statut === 'Payé',
                          'bg-red-100 text-red-800': facture.statut.includes('En retard'),
                          'bg-yellow-100 text-yellow-800': facture.statut === 'À venir'
                        }"
                        class="px-3 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ facture.statut }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Informations client -->
                <div class="bg-gray-50 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations Client</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Nom:</span>
                      <span class="text-gray-900">{{ facture.client }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Email:</span>
                      <span class="text-gray-900">{{ facture.clientEmail }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Téléphone:</span>
                      <span class="text-gray-900">{{ facture.clientTelephone }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Adresse:</span>
                      <span class="text-gray-900 text-right">{{ facture.clientAdresse }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Détails financiers -->
              <div class="space-y-6">
                
                <!-- Prestations -->
                <div class="bg-gray-50 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Détail des Prestations</h3>
                  <div class="space-y-3">
                    <div v-for="prestation in facture.prestations" :key="prestation.id" class="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <div class="font-medium text-gray-900">{{ prestation.designation }}</div>
                        <div class="text-sm text-gray-600">Qté: {{ prestation.quantite }} x {{ formatCurrency(prestation.prixUnitaire) }}</div>
                      </div>
                      <div class="text-right">
                        <div class="font-medium text-gray-900">{{ formatCurrency(prestation.montantHT) }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Récapitulatif financier -->
                <div class="bg-sky-50 rounded-lg p-6 border-2 border-sky-200">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Récapitulatif Financier</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Montant HT:</span>
                      <span class="text-gray-900">{{ formatCurrency(facture.montantHT) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">TVA (18%):</span>
                      <span class="text-gray-900">{{ formatCurrency(facture.montantTVA) }}</span>
                    </div>
                    <div class="flex justify-between border-t border-gray-300 pt-3">
                      <span class="font-bold text-gray-900">Total TTC:</span>
                      <span class="font-bold text-xl text-sky-600">{{ formatCurrency(facture.montantTTC) }}</span>
                    </div>
                    <div v-if="facture.acompteVerse > 0" class="flex justify-between">
                      <span class="font-medium text-gray-700">Acompte versé:</span>
                      <span class="text-green-600">{{ formatCurrency(facture.acompteVerse) }}</span>
                    </div>
                    <div class="flex justify-between border-t border-gray-300 pt-3">
                      <span class="font-bold text-gray-900">Reste à payer:</span>
                      <span class="font-bold text-xl" :class="facture.resteAPayer > 0 ? 'text-red-600' : 'text-green-600'">
                        {{ formatCurrency(facture.resteAPayer) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Historique des relances -->
          <div v-if="activeTab === 'relances'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-gray-900">Historique des Relances</h3>
              <button @click="showAddRelance = true" class="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Ajouter une relance
              </button>
            </div>

            <!-- Timeline des relances -->
            <div class="space-y-6">
              <div v-if="relances.length === 0" class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Aucune relance effectuée pour cette facture
              </div>

              <div v-for="(relance, index) in relances" :key="relance.id" class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div 
                    :class="{
                      'bg-blue-500': relance.mode === 'Email',
                      'bg-green-500': relance.mode === 'Appel',
                      'bg-purple-500': relance.mode === 'Courrier'
                    }"
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                  >
                    <svg v-if="relance.mode === 'Email'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <svg v-else-if="relance.mode === 'Appel'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div v-if="index < relances.length - 1" class="w-0.5 h-16 bg-gray-300 mt-2"></div>
                </div>

                <div class="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-gray-900">{{ relance.mode }}</span>
                        <span class="text-sm text-gray-500">par {{ relance.utilisateur }}</span>
                      </div>
                      <div class="text-sm text-gray-600">{{ formatDate(relance.date) }} à {{ relance.heure }}</div>
                    </div>
                    <span 
                      :class="{
                        'bg-green-100 text-green-800': relance.statut === 'Succès',
                        'bg-yellow-100 text-yellow-800': relance.statut === 'En attente',
                        'bg-red-100 text-red-800': relance.statut === 'Échec'
                      }"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ relance.statut }}
                    </span>
                  </div>
                  
                  <div class="text-gray-700 mb-2">
                    <strong>Réponse client:</strong> {{ relance.reponseClient }}
                  </div>
                  
                  <div v-if="relance.commentaire" class="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Commentaire:</strong> {{ relance.commentaire }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Ajouter Relance -->
      <div v-if="showAddRelance" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Ajouter une Relance</h3>
            <button @click="showAddRelance = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="ajouterRelance">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Mode de relance</label>
              <select v-model="nouvelleRelance.mode" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                <option value="">Sélectionner</option>
                <option value="Email">Email</option>
                <option value="Appel">Appel téléphonique</option>
                <option value="Courrier">Courrier postal</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Date et heure</label>
              <input v-model="nouvelleRelance.dateHeure" type="datetime-local" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Réponse du client</label>
              <textarea v-model="nouvelleRelance.reponseClient" rows="3" placeholder="Ex: Paiement promis dans 8 jours" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Commentaires additionnels</label>
              <textarea v-model="nouvelleRelance.commentaire" rows="3" placeholder="Notes internes..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>

            <div class="flex justify-end gap-3">
              <button type="button" @click="showAddRelance = false" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" class="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
                Ajouter la Relance
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
 
</template>

<script setup>
import DefaultLayout from '@/layouts/default.vue'
import { ref, reactive } from 'vue'

const activeTab = ref('details')
const showAddRelance = ref(false)

// Données de la facture (normalement reçues via props ou API)
const facture = reactive({
  id: 1,
  reference: 'FACT-2024-001',
  client: 'Entreprise ABC',
  clientEmail: 'contact@entreprise-abc.com',
  clientTelephone: '+228 90 12 34 56',
  clientAdresse: '123 Avenue de la République, Lomé',
  commercial: 'Jean Dupont',
  module: 'Vente',
  dateEmission: '2024-06-15',
  dateEcheance: '2024-07-15',
  montantHT: 1016949,
  montantTVA: 183051,
  montantTTC: 1200000,
  acompteVerse: 200000,
  resteAPayer: 1000000,
  statut: 'En retard (15j)',
  prestations: [
    {
      id: 1,
      designation: 'Développement application web',
      quantite: 1,
      prixUnitaire: 800000,
      montantHT: 800000
    },
    {
      id: 2,
      designation: 'Formation utilisateurs',
      quantite: 2,
      prixUnitaire: 108475,
      montantHT: 216949
    }
  ]
})

// Historique des relances
const relances = ref([
  {
    id: 1,
    date: '2024-07-20',
    heure: '14:30',
    mode: 'Email',
    utilisateur: 'Sophie Martin',
    reponseClient: 'Accusé réception, paiement prévu fin de semaine',
    commentaire: 'Client réceptif, semble sérieux sur l\'engagement',
    statut: 'Succès'
  },
  {
    id: 2,
    date: '2024-07-10',
    heure: '10:15',
    mode: 'Appel',
    utilisateur: 'Paul Durand',
    reponseClient: 'Pas de réponse, messagerie vocale',
    commentaire: 'Laissé un message détaillé',
    statut: 'En attente'
  }
])

// Nouvelle relance
const nouvelleRelance = reactive({
  mode: '',
  dateHeure: '',
  reponseClient: '',
  commentaire: ''
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' FCFA'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const retour = () => {
  // Navigation vers le tableau de bord
  console.log('Retour au dashboard')
  window.history.back()
}

const telechargerPDF = () => {
  console.log('Téléchargement PDF de la facture')
  alert('Téléchargement en cours...')
}

const marquerPaye = () => {
  if (confirm('Marquer cette facture comme payée ?')) {
    facture.statut = 'Payé'
    facture.resteAPayer = 0
    alert('Facture marquée comme payée!')
  }
}

const ajouterRelance = () => {
  const dateTime = new Date(nouvelleRelance.dateHeure)
  const newRelance = {
    id: relances.value.length + 1,
    date: dateTime.toISOString().split('T')[0],
    heure: dateTime.toTimeString().slice(0, 5),
    mode: nouvelleRelance.mode,
    utilisateur: 'Utilisateur Actuel', // À remplacer par l'utilisateur connecté
    reponseClient: nouvelleRelance.reponseClient || 'Aucune réponse',
    commentaire: nouvelleRelance.commentaire,
    statut: 'Succès'
  }
  
  relances.value.unshift(newRelance) // Ajouter en premier
  
  // Reset form
  Object.keys(nouvelleRelance).forEach(key => {
    nouvelleRelance[key] = ''
  })
  
  showAddRelance.value = false
  alert('Relance ajoutée avec succès!')
}
</script>