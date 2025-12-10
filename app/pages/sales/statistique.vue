<template>
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
    <!-- En-tête avec titre -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Icon name="heroicons:chart-bar" class="w-6 h-6 text-blue-600" />
        Tableau de bord des statistiques
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Visualisez et analysez les données de votre activité
      </p>
    </div>

    <!-- Navigation par onglets -->
    <div class="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
      <button
        v-for="part in parts"
        :key="part.value"
        @click="selectedPart = part.value"
        :class="[
          'px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
          selectedPart === part.value
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        ]"
      >
        <div class="flex items-center gap-2">
          <Icon :name="getPartIcon(part.value)" class="w-4 h-4" />
          <span>{{ part.label }}</span>
        </div>
      </button>
    </div>

    <!-- Filtres de date -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div class="relative w-full sm:w-auto">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="heroicons:calendar" class="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="date"
            v-model="startDate"
            class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto text-sm"
          />
        </div>

        <span class="text-gray-400 hidden sm:block">au</span>

        <div class="relative w-full sm:w-auto">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="heroicons:calendar" class="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="date"
            v-model="endDate"
            class="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto text-sm"
          />
        </div>

        <button
          @click="filterData"
          class="w-full sm:w-auto mt-2 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Icon name="heroicons:funnel" class="w-4 h-4" />
          <span>Appliquer le filtre</span>
        </button>
      </div>
    </div>

    <!-- Conteneur du composant dynamique avec animation de transition -->
    <div class="mt-6">
      <transition name="fade" mode="out-in">
        <div
          :key="selectedPart"
          class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition-all duration-300"
        >
          <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon :name="getPartIcon(selectedPart)" class="w-5 h-5 text-blue-600" />
            {{ parts.find(p => p.value === selectedPart)?.label || 'Statistiques' }}
          </h2>
          <div class="min-h-[400px] flex items-center justify-center">
            <component
              :is="currentComponent"
              :start-date="startDate"
              :end-date="endDate"
              class="w-full"
            />
          </div>
        </div>
      </transition>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

// Icônes pour chaque onglet
const getPartIcon = (part) => {
  const icons = {
    proforma: 'heroicons:document-text',
    commande: 'heroicons:shopping-cart',
    facture: 'heroicons:document-text',
    livraison: 'heroicons:truck',
    echeancier: 'heroicons:calendar'
  }
  return icons[part] || 'heroicons:chart-bar'
}

// Définition des onglets
const parts = [
  { label: 'Proformas', value: 'proforma' },
  { label: 'Commandes', value: 'commande' },
  { label: 'Factures', value: 'facture' },
  { label: 'Livraisons', value: 'livraison' },
  { label: 'Échéanciers', value: 'echeancier' }
]

const selectedPart = ref('proforma')

// Définir les dates par défaut (du 1er du mois en cours à aujourd'hui)
const today = new Date()
const firstDayOfMonth = startOfMonth(today)

// Formater les dates pour les champs input[type="date"]
const formatForInput = (date) => format(date, 'yyyy-MM-dd')

// Dates avec valeurs par défaut
const startDate = ref(formatForInput(firstDayOfMonth))
const endDate = ref(formatForInput(today))

// Corrected dynamic component logic
const currentComponent = computed(() => {
  switch(selectedPart.value) {
    case 'proforma':
      return defineAsyncComponent(() => import('./parts/ProformaStats.vue'))
    case 'commande':
      return defineAsyncComponent(() => import('./parts/CommandeStats.vue'))
    case 'facture':
      return defineAsyncComponent(() => import('./parts/FactureStats.vue'))
    case 'livraison':
      return defineAsyncComponent(() => import('./parts/LivraisonStats.vue'))
    case 'echeancier':
      return defineAsyncComponent(() => import('./parts/EcheancierStats.vue'))
    default:
      return null // Return null if no part is selected
  }
})

// Filtrer les données
const filterData = () => {
  console.log('Filtrage des données :', {
    section: selectedPart.value,
    dateDebut: startDate.value,
    dateFin: endDate.value
  })

  // Ici, vous pourriez ajouter une logique pour recharger les données
  // du composant enfant actif avec les nouvelles dates
  // Par exemple :
  // if (currentComponent.value?.reloadData) {
  //   currentComponent.value.reloadData({
  //     startDate: startDate.value,
  //     endDate: endDate.value
  //   })
  // }
}
</script>

<style scoped>
/* Animation de transition pour les onglets */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Style personnalisé pour les champs de date */
input[type="date"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

/* Style pour les navigateurs WebKit (Chrome, Safari) */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Style pour Firefox */
input[type="date"]::-moz-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
