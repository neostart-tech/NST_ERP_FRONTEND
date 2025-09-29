<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" role="main">
    <!-- Affichage des erreurs avec animation -->
    <transition name="fade">
      <div v-if="error" class="mb-4 p-4 bg-red-50 border-l-4 border-red-600" role="alert" aria-live="assertive">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="heroicons:exclamation-circle" class="h-5 w-5 text-red-500" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              Une erreur est survenue: {{ error.message }}
              <button @click="refreshData" class="ml-2 text-red-600 hover:text-red-500 underline">
                Réessayer
              </button>
            </p>
          </div>
        </div>
      </div>
    </transition>

    <!-- Barre de filtres -->
    <div class="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Champ de recherche -->
        <div class="space-y-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Recherche</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Titre, référence..."
            @keyup.enter="currentPage = 1"
          >
        </div>

        <!-- Filtre par statut -->
        <div class="space-y-1">
          <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
          <select
            id="status"
            v-model="filters.status"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            @change="currentPage = 1"
          >
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="active">Actif</option>
            <option value="submitted">Soumis</option>
            <option value="evaluation">En évaluation</option>
            <option value="won">Gagné</option>
            <option value="lost">Perdu</option>
          </select>
        </div>

        <!-- Tri par -->
        <div class="space-y-1">
          <label for="sort-by" class="block text-sm font-medium text-gray-700">Trier par</label>
          <select
            id="sort-by"
            v-model="filters.sortBy"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            @change="currentPage = 1"
          >
            <option value="date">Date de publication</option>
            <option value="title">Titre</option>
            <option value="budget">Budget</option>
          </select>
        </div>

        <!-- Ordre de tri -->
        <div class="space-y-1">
          <label for="sort-order" class="block text-sm font-medium text-gray-700">Ordre</label>
          <select
            id="sort-order"
            v-model="filters.sortOrder"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            @change="currentPage = 1"
          >
            <option value="asc">Croissant</option>
            <option value="desc">Décroissant</option>
          </select>
        </div>
      </div>

      <!-- Bouton de réinitialisation -->
      <div class="mt-3 flex justify-end">
        <button
          type="button"
          @click="resetFilters"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          :disabled="!hasActiveFilters"
          :class="{ 'opacity-50 cursor-not-allowed': !hasActiveFilters }"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>

    <div class="relative">
      <!-- Overlay de chargement avec animation -->
      <transition name="fade">
        <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg" role="status" aria-live="polite" aria-busy="true">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
          <span class="sr-only">Chargement en cours...</span>
        </div>
      </transition>

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-medium text-gray-900">
          {{ title }}
          <span v-if="isLoading" class="ml-2 text-sm text-gray-600">Chargement...</span>
        </h1>
        <button
          @click="navigateToNewOffer"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          aria-label="Créer un nouvel appel d'offres"
        >
          <Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
          Nouvel appel d'offre
        </button>
      </div>


    </div>

    <!-- Metrics Grid avec animation d'entrée -->
    <transition-group name="fade-stagger" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="region" aria-label="Métriques des appels d'offres">
      <!-- Carte Total -->
      <div key="total" class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
            <Icon name="heroicons:home" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Total</p>
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.totalOffers || 0 }}</p>
            <p class="text-xs text-gray-500">Tous les appels d'offres</p>
          </div>
        </div>
      </div>

      <!-- Carte Actifs -->
      <div key="active" class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
            <Icon name="heroicons:check-circle" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Actifs</p>
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.activeOffers || 0 }}</p>
            <p class="text-xs text-gray-500">En cours de traitement</p>
          </div>
        </div>
      </div>

      <!-- Carte Soumissions -->
      <div key="submitted" class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-amber-100 text-amber-600 mr-4">
            <Icon name="heroicons:paper-airplane" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Soumis</p>
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.submittedOffers || 0 }}</p>
            <p class="text-xs text-gray-500">En attente de réponse</p>
          </div>
        </div>
      </div>

      <!-- Carte Taux de réussite -->
      <div key="success" class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
            <Icon name="heroicons:trophy" class="h-5 w-5" />
          </div>
          <div class="flex-1">
            <p class="text-gray-500 text-sm font-medium">Taux de réussite</p>
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.successRate || 0 }}%</p>
            <div class="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div class="bg-purple-600 h-1.5 rounded-full transition-all duration-500" :style="{ width: `${Math.min(metrics.successRate || 0, 100)}%` }"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Taux de gain</p>
          </div>
        </div>
      </div>
    </transition-group>

    <!-- Success Rate Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Taux de réussite</span>
        <span>{{ successRateFormatted }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
          :style="{ width: `${Math.min(metrics.successRate, 100)}%` }"
        ></div>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-gray-100 text-gray-600 mr-4">
            <Icon name="heroicons:chart-bar" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Valeur Totale</p>
            <p class="text-xl font-bold text-gray-900">{{ formatCurrency(metrics.totalValue || 0) }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-green-50 text-green-600 mr-4">
            <Icon name="heroicons:chart-square-bar" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Valeur Gagnée</p>
            <p class="text-xl font-bold text-green-600">{{ formatCurrency(metrics.wonValue || 0) }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-blue-50 text-blue-600 mr-4">
            <Icon name="heroicons:clock" class="h-5 w-5" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">En Attente</p>
            <p class="text-xl font-bold text-blue-600">{{ formatCurrency(metrics.pendingValue || 0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Offers -->
    <div v-if="showRecentOffers" class="mt-10">
      <div class="border-b border-gray-200 pb-5 mb-6">
        <div class="sm:flex sm:items-center sm:justify-between">
          <h3 class="text-lg font-semibold leading-6 text-gray-900">Appels d'offres récents</h3>

        </div>
        <p class="mt-2 text-sm text-gray-500">Derniers appels d'offres ajoutés ou modifiés</p>
      </div>

      <div v-if="recentOffers.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200">
          <li v-for="offer in paginatedOffers" :key="offer.id" class="group hover:bg-gray-50 transition-colors duration-150">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                  <div class="flex items-center min-w-0">
                    <div class="flex-shrink-0 mr-4">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon name="heroicons:document-text" class="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ offer.title }}
                      </p>
                      <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                          <Icon name="heroicons:calendar" class="h-5 w-5 mr-2 text-gray-400" />
                          <span>{{ formatDate(offer.submission_deadline) }}</span>
                        </div>
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                          <Icon name="heroicons:users" class="h-5 w-5 mr-2 text-gray-400" />
                          <span>{{ formatCurrency(offer.estimated_budget) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <!-- Boutons d'action -->
                    <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <NuxtLink
                        :to="AppUrl.parameterize(AppUrl.OFFERS_EDIT, offer.id)"
                        class="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="Modifier"
                      >
                        <Icon name="heroicons:pencil" class="h-5 w-5" />
                      </NuxtLink>
                      <button
                        @click.stop="confirmDelete(offer.id)"
                        class="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Icon name="heroicons:trash" class="h-5 w-5" />
                      </button>
                      <NuxtLink
                        :to="AppUrl.parameterize(AppUrl.OFFERS_APPROVAL, offer.id)"
                        class="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                        title="Voir les détails"
                      >
                        <Icon name="heroicons:eye" class="h-5 w-5" />
                      </NuxtLink>
                    </div>
                    <div class="ml-2 flex-shrink-0 flex flex-col items-end">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1" :class="getStatusBadgeClass(offer.status)">
                        {{ getStatusLabel(offer.status) }}
                      </span>
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="getDeadlineBadgeClass(offer.submission_deadline)">
                        <Icon name="heroicons:clock" class="h-5 w-5 mr-2 text-gray-400" />
                        {{ getDaysUntilDeadline(offer.submission_deadline) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <Icon name="heroicons:user" class="h-4 w-4 mr-1.5 text-gray-400" />
                      {{ offer.enterprise?.name || 'Non spécifié' }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                   <Icon name="heroicons-solid:clock" class="h-5 w-5 mr-1.5 text-gray-400" />
                    <span>Mis à jour {{ formatRelativeDate(offer.publication_date) }}</span>
                  </div>
                </div>
              </div>
          </li>
        </ul>

        <!-- Pagination Controls -->
        <div v-if="recentOffers.length > itemsPerPage" class="mt-4 flex items-center justify-between px-4 py-3 bg-gray-50">
          <div class="text-sm text-gray-600">
            Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, recentOffers.length) }} sur {{ recentOffers.length }} résultats
          </div>
          <div class="inline-flex rounded-md shadow-sm" role="group" aria-label="Pagination">
            <button
              type="button"
              class="px-3 py-2 text-sm border border-gray-300 rounded-l-md bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
              :disabled="currentPage === 1"
              @click="currentPage = Math.max(1, currentPage - 1)"
              aria-label="Page précédente"
            >
              Précédent
            </button>
            <button
              type="button"
              class="px-3 py-2 text-sm border-t border-b border-r border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
              :disabled="currentPage === totalPages"
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              aria-label="Page suivante"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>


      <!-- Empty State -->

			<div class="mt-6 flex justify-end">
          <button
            type="button"
            @click="navigateToNewOffer"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
            Nouvel appel d'offres
          </button>
        </div>
      <!-- Upcoming Deadlines Section -->
      <div v-if="showUpcomingDeadlines && upcomingDeadlines.length > 0" class="mt-8 bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-md font-semibold text-gray-900">Échéances à venir</h3>
          <NuxtLink
            to="/offers"
            class="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            aria-label="Voir la liste des appels d'offres"
          >
            Voir tout
          </NuxtLink>
        </div>
        <ul class="divide-y divide-gray-200">
          <li v-for="offer in upcomingDeadlines" :key="offer.id" class="py-3 flex items-center justify-between">
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ offer.title }}</p>
              <p class="text-xs text-gray-500">Échéance: {{ formatDate(offer.submission_deadline) }} • {{ getDaysUntilDeadline(offer.submission_deadline) }}</p>
            </div>
            <span :class="getStatusBadgeClass(offer.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ getStatusLabel(offer.status) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, shallowRef } from 'vue'
import { navigateTo } from '#app'
import { useOfferStore } from '@/stores/offerStore'
//import { useConfirm } from 'primevue/config'
import { useDateFormat, useNow } from '@vueuse/core'
import type { Offer } from '~/models/Offer'
import { NuxtLink } from '#components'


interface Props {
  title?: string
  showRecentOffers?: boolean
  showUpcomingDeadlines?: boolean
  autoRefresh?: boolean
  refreshInterval?: number // in minutes
}

const props = withDefaults(defineProps<Props>(), {
  title: "Appels d'Offres - Vue d'ensemble",
  showRecentOffers: true,
  showUpcomingDeadlines: true,
  autoRefresh: false,
  refreshInterval: 5,
})

const offerStore = useOfferStore()
// const confirm = useConfirm()
const isLoading = ref(false)
const isInitialLoad = ref(true)
const error = shallowRef<Error | null>(null)
let refreshTimer: NodeJS.Timeout | null = null

// État pour les filtres
const filters = shallowRef({
  status: '',
  search: '',
  sortBy: 'date',
  sortOrder: 'desc'
})

// Utilisation de VueUse pour la date actuelle réactive
const now = useNow()

// Fonction utilitaire pour filtrer et trier les offres
const filterAndSortOffers = (rawOffers: any[]): any[] => {
  try {
    // Vérifier si les offres sont valides
    if (!Array.isArray(rawOffers)) {
      console.warn('filterAndSortOffers: offers is not an array', rawOffers)
      return []
    }

    // Créer une copie profonde des offres pour éviter de modifier l'original
    const offers = JSON.parse(JSON.stringify(rawOffers))

    // Appliquer les filtres
    let result = offers.filter((offer: any) => {
      // Filtre par statut
      if (filters.value.status && offer.status !== filters.value.status) {
        return false
      }

      // Filtre par recherche
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        const title = String(offer?.title || '').toLowerCase()
        const description = String(offer?.description || '').toLowerCase()

        if (!title.includes(searchLower) && !description.includes(searchLower)) {
          return false
        }
      }

      return true
    })

    // Appliquer le tri
    result.sort((a: any, b: any) => {
      let comparison = 0

      switch (filters.value.sortBy) {
        case 'date': {
          const dateA = new Date(a.publication_date || a.submission_deadline || 0).getTime()
          const dateB = new Date(b.publication_date || b.submission_deadline || 0).getTime()
          comparison = dateA - dateB
          break
        }
        case 'title':
          comparison = String(a.title || '').localeCompare(String(b.title || ''))
          break
        case 'budget':
          comparison = (Number(a.estimated_budget) || 0) - (Number(b.estimated_budget) || 0)
          break
      }

      return filters.value.sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  } catch (error) {
    console.error('Error in filterAndSortOffers:', error)
    return []
  }
}

// Offres filtrées et triées
const filteredOffers = computed<Offer[]>(() => {
  if (!offerStore.offers) return []
  return filterAndSortOffers(offerStore.offers)
})

// Fonctions utilitaires pour les métriques
const countOffersByStatus = (status: string): number => {
  return filteredOffers.value.filter((o: any) => o.status === status).length
}

const sumBudgetByStatus = (status: string): number => {
  return filteredOffers.value
    .filter((o: any) => o.status === status)
    .reduce((sum: number, o: any) => sum + (Number(o.estimated_budget) || 0), 0)
}

// Métriques basées sur les offres filtrées
const activeOffers = computed(() => countOffersByStatus('active'))
const submittedOffers = computed(() => countOffersByStatus('submitted'))
const wonOffers = computed(() => countOffersByStatus('won'))
const lostOffers = computed(() => countOffersByStatus('lost'))
const totalOffers = computed(() => filteredOffers.value.length)
const totalBudget = computed(() =>
  filteredOffers.value.reduce((sum: number, o: any) => sum + (Number(o.estimated_budget) || 0), 0)
)
const wonBudget = computed(() => sumBudgetByStatus('won'))

// Calculate success rate based on submitted offers, not total offers
const successRate = computed(() => {
  const submitted = submittedOffers.value + wonOffers.value + lostOffers.value
  return submitted > 0 ? Math.round((wonOffers.value / submitted) * 100) : 0
})

// Vérifie s'il y a des filtres actifs
const hasActiveFilters = computed(() => {
  return filters.value.status !== '' ||
         filters.value.search !== '' ||
         filters.value.sortBy !== 'date' ||
         filters.value.sortOrder !== 'desc'
})

// Réinitialise tous les filtres
const resetFilters = () => {
  filters.value = {
    status: '',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  }
  currentPage.value = 1
}

// Reactive metrics object
const metrics = computed(() => ({
  totalOffers: totalOffers.value,
  activeOffers: activeOffers.value,
  submittedOffers: submittedOffers.value,
  wonOffers: wonOffers.value,
  lostOffers: lostOffers.value,
  successRate: successRate.value,
  totalValue: totalBudget.value,
  wonValue: wonBudget.value,
  pendingValue: offerStore.offers
    .filter((o: Offer) => ['submitted', 'evaluation'].includes(o.status))
    .reduce((sum: number, o: Offer) => sum + (o.estimated_budget || 0), 0),
}))

const successRateFormatted = computed(() =>
  metrics.value?.successRate ? metrics.value.successRate.toFixed(1) : '0.0',
)

const currentPage = ref(1)
const itemsPerPage = ref(5)

const recentOffers = computed<Offer[]>(() => {
  return [...filteredOffers.value].sort((a, b) => {
    const bTime = new Date(b.publication_date || b.submission_deadline || '').getTime()
    const aTime = new Date(a.publication_date || a.submission_deadline || '').getTime()
    return bTime - aTime
  })
})

const paginatedOffers = computed<Offer[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return recentOffers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(recentOffers.value.length / itemsPerPage.value)
})

const upcomingDeadlines = computed(() => {
  if (filteredOffers.value.length === 0) return []

  return filteredOffers.value
    .filter((offer) => {
      if (!offer.submission_deadline) return false
      try {
        const deadline = new Date(offer.submission_deadline)
        return !isNaN(deadline.getTime()) && deadline > new Date()
      } catch (e) {
        return false
      }
    })
    .sort((a, b) => {
      try {
        const dateA = a.submission_deadline ? new Date(a.submission_deadline).getTime() : 0
        const dateB = b.submission_deadline ? new Date(b.submission_deadline).getTime() : 0
        return dateA - dateB
      } catch (e) {
        return 0
      }
    })
    .slice(0, 5)
})

// Methods
const refreshData = async (): Promise<void> => {
  if (isLoading.value) return

  isLoading.value = true
  error.value = null

  try {
    await offerStore.fetchOffers()
  } catch (err) {
    console.error('Erreur lors du chargement des offres:', err)
    error.value = err instanceof Error
      ? err
      : new Error('Une erreur est survenue lors du chargement des données')
  } finally {
    isLoading.value = false
  }
}

const setupAutoRefresh = (): void => {
  clearAutoRefresh()

  if (props.autoRefresh && props.refreshInterval && props.refreshInterval > 0) {
    const intervalMs = props.refreshInterval * 60 * 1000
    refreshTimer = setInterval(() => {
      refreshData().catch(err => {
        console.error('Erreur lors du rafraîchissement automatique:', err)
      })
    }, intervalMs)

    if (offerStore.offers.length === 0) {
      refreshData().catch(console.error)
    }
  }
}

const clearAutoRefresh = (): void => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// Navigation methods
const navigateToOffer = (offerId: string): void => {
  navigateTo(`/offers/${offerId}`)
}

const navigateToNewOffer = (): void => {
  navigateTo('/offers/offer-form')
}

const navigateToOfferList = (): void => {
  navigateTo('/offers')
}

// Navigation vers l'édition d'une offre
const navigateToEdit = (offerId: string): void => {
  navigateTo(`/offers/offer-form/${offerId}`)
}

// Confirmation de suppression d'une offre
const confirmDelete = async (offer: any): Promise<void> => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'appel d'offres "${offer.title}" ?`)) {
    try {
      await offerStore.deleteOffer(offer.id)
      await refreshData()
      // Vous pourriez ajouter une notification de succès ici
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'offre :', error)
      // Vous pourriez ajouter une notification d'erreur ici
    }
  }
}

// Status and urgency helpers
const getStatusLabel = (status: string = 'draft'): string => {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    active: 'Actif',
    submitted: 'Soumis',
    evaluation: 'En évaluation',
    won: 'Gagné',
    lost: 'Perdu',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string = 'draft'): string => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    submitted: 'bg-yellow-100 text-yellow-800',
    evaluation: 'bg-purple-100 text-purple-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getDeadlineBadgeClass = (deadline: string | Date): string => {
  if (!deadline) return 'bg-gray-100 text-gray-800'

  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.value.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'bg-red-100 text-red-800'
  if (diffDays <= 3) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getDaysUntilDeadline = (deadline: string): string => {
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate.getTime() - now.value.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Demain'
  if (diffDays < 0) return 'En retard'
  return `${diffDays}j`
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' FCFA'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
  })
}

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)
  const diffDays = Math.floor((now.value.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `${diffDays}j`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`
  return `${Math.floor(diffDays / 30)}mois`
}

// Lifecycle hooks
onMounted(() => {
  refreshData()
  setupAutoRefresh()
})

onUnmounted(() => {
  clearAutoRefresh()
})

// React to prop changes for auto-refresh configuration
watch(
  () => [props.autoRefresh, props.refreshInterval],
  () => {
    setupAutoRefresh()
  },
  { immediate: true }
)
</script>

<style scoped>
/* Animations de base */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Animation pour les éléments en escalier */
.fade-stagger-move,
.fade-stagger-enter-active,
.fade-stagger-leave-active {
  transition: all 0.4s ease;
}

.fade-stagger-enter-from,
.fade-stagger-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-stagger-leave-active {
  position: absolute;
  width: calc(100% - 2rem);
}

/* Animation du squelette */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Transition pour les cartes */
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Amélioration de l'accessibilité */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus visible pour l'accessibilité */
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
</style>
