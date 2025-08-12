<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" role="main">
    <!-- Affichage des erreurs -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border-l-4 border-red-600" role="alert" aria-live="assertive">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="h-5 w-5 text-red-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </i>
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

    <div class="relative">
      <!-- Overlay de chargement -->
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg" role="status" aria-live="polite" aria-busy="true">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
        <span class="sr-only">Chargement en cours...</span>
      </div>
      
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-lg font-medium text-gray-900">
          {{ title }}
          <span v-if="isLoading" class="ml-2 text-sm text-gray-600">Chargement...</span>
        </h1>
        <button
          @click="navigateToNewOffer"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Créer un nouvel appel d'offres"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nouvel appel d'offre
        </button>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="refreshData"
          :disabled="isLoading"
          :aria-label="isLoading ? 'Actualisation en cours' : 'Actualiser les données'"
          class="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :class="{ 'animate-spin': isLoading, 'opacity-50 cursor-not-allowed': isLoading }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <NuxtLink
          to="/offers/submission-form"
          aria-label="Voir tous les appels d'offres"
          class="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="region" aria-label="Métriques des appels d'offres">
      <!-- Carte Total -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Total</p>
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.totalOffers || 0 }}</p>
            <p class="text-xs text-gray-500">Tous les appels d'offres</p>
          </div>
        </div>
      </div>

      <!-- Carte Actifs -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Actifs</p>
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.activeOffers || 0 }}</p>
            <p class="text-xs text-gray-500">En cours de traitement</p>
          </div>
        </div>
      </div>

      <!-- Carte Soumissions -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-amber-100 text-amber-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Soumis</p>
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.submittedOffers || 0 }}</p>
            <p class="text-xs text-gray-500">En attente de réponse</p>
          </div>
        </div>
      </div>

      <!-- Carte Taux de réussite -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-gray-500 text-sm font-medium">Taux de réussite</p>
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.successRate || 0 }}%</p>
            <div class="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div class="bg-purple-600 h-1.5 rounded-full" :style="{ width: `${Math.min(metrics.successRate || 0, 100)}%` }"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Taux de gain</p>
          </div>
        </div>
      </div>
    </div>

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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
          <div class="mt-3 sm:ml-4 sm:mt-0">
            <div class="flex space-x-3">
              <button
                @click="refreshData"
                type="button"
                class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                :disabled="isLoading"
                :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
                title="Rafraîchir"
                aria-label="Actualiser la liste"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
              <button
                @click="navigateToNewOffer"
                type="button"
                class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                aria-label="Créer un nouvel appel d'offres"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nouvel appel d'offres
              </button>
            </div>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-500">Derniers appels d'offres ajoutés ou modifiés</p>
      </div>
      
      <div v-if="recentOffers.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200">
          <li v-for="offer in paginatedOffers" :key="offer.id" class="group hover:bg-gray-50 transition-colors duration-150">
            <a href="#" @click.prevent="navigateToOffer(offer.id)" class="block" :aria-label="`Voir les détails de l'appel d'offres ${offer.title}`">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center min-w-0">
                    <div class="flex-shrink-0 mr-4">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ offer.title }}
                      </p>
                      <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{{ formatDate(offer.submission_deadline) }}</span>
                        </div>
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{{ formatCurrency(offer.estimated_budget) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4 flex-shrink-0 flex flex-col items-end">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1" :class="getStatusBadgeClass(offer.status)">
                      {{ getStatusLabel(offer.status) }}
                    </span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="getDeadlineBadgeClass(offer.submission_deadline)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ getDaysUntilDeadline(offer.submission_deadline) }}
                    </span>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {{ offer.entreprise || 'Non spécifié' }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Mis à jour {{ formatRelativeDate(offer.publication_date) }}</span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
        
        <!-- Pagination Controls -->
        <div v-if="recentOffers.length > itemsPerPage" class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Page {{ currentPage }} / {{ totalPages }}
          </div>
          <div class="inline-flex rounded-md shadow-sm" role="group" aria-label="Pagination">
            <button
              type="button"
              class="px-3 py-1 text-sm border border-gray-300 rounded-l-md bg-white hover:bg-gray-50 disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              Précédent
            </button>
            <button
              type="button"
              class="px-3 py-1 text-sm border-t border-b border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              :disabled="currentPage === totalPages"
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-8" role="alert" aria-live="polite">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun appel d'offres</h3>
        <p class="mt-1 text-sm text-gray-500">
          Commencez par ajouter votre premier appel d'offres.
        </p>
        <div class="mt-6">
          <button
            type="button"
            @click="navigateToNewOffer"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Nouvel appel d'offres
          </button>
        </div>
      </div>
      
      <!-- Upcoming Deadlines Section -->
      <div v-if="showUpcomingDeadlines && upcomingDeadlines.length > 0" class="mt-8 bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-md font-semibold text-gray-900">Échéances à venir</h3>
          <NuxtLink
            to="/offers"
            class="text-sm text-blue-600 hover:text-blue-800"
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { navigateTo } from '#app'
import { useOfferStore } from '@/stores/offerStore'
// import type { Offer, OfferStatus } from '@/types/offers'

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
const isLoading = ref(false)
const error = ref<Error | null>(null)
let refreshTimer: NodeJS.Timeout | null = null

// Computed properties for metrics
const activeOffers = computed(() => offerStore.offers.filter((o: any) => o.status === 'active').length)
const submittedOffers = computed(() => offerStore.offers.filter((o: any) => o.status === 'submitted').length)
const wonOffers = computed(() => offerStore.offers.filter((o: any) => o.status === 'won').length)
const lostOffers = computed(() => offerStore.offers.filter((o: any) => o.status === 'lost').length)
const totalOffers = computed(() => offerStore.offers.length)
const totalBudget = computed(() => offerStore.offers.reduce((sum: number, o: any) => sum + (o.estimated_budget || 0), 0))
const wonBudget = computed(() => 
  offerStore.offers
    .filter((o: any) => o.status === 'won')
    .reduce((sum: number, o: any) => sum + (o.estimated_budget || 0), 0)
)

// Calculate success rate based on submitted offers, not total offers
const successRate = computed(() => {
  const submitted = submittedOffers.value + wonOffers.value + lostOffers.value
  return submitted > 0 ? Math.round((wonOffers.value / submitted) * 100) : 0
})

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
    .filter((o: any) => ['submitted', 'evaluation'].includes(o.status))
    .reduce((sum: number, o: any) => sum + (o.estimated_budget || 0), 0),
}))

const successRateFormatted = computed(() =>
  metrics.value?.successRate ? metrics.value.successRate.toFixed(1) : '0.0',
)

const currentPage = ref(1)
const itemsPerPage = ref(5)

const recentOffers = computed<any[]>(() => {
  return [...offerStore.offers].sort((a, b) => {
    const bTime = new Date(b.publication_date || b.submission_deadline || '').getTime()
    const aTime = new Date(a.publication_date || a.submission_deadline || '').getTime()
    return bTime - aTime
  })
})

const paginatedOffers = computed<any[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return recentOffers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(recentOffers.value.length / itemsPerPage.value)
})

const upcomingDeadlines = computed(() => {
  if (!offerStore.offers || offerStore.offers.length === 0) return []
  
  return [...offerStore.offers]
    .filter((offer: any) => {
      if (!offer.submission_deadline) return false
      try {
        const deadline = new Date(offer.submission_deadline)
        return !isNaN(deadline.getTime()) && deadline > new Date()
      } catch (e) {
        return false
      }
    })
    .sort((a: any, b: any) => {
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
  
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'bg-red-100 text-red-800'
  if (diffDays <= 3) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getDaysUntilDeadline = (deadline: string): string => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Demain'
  if (diffDays < 0) return 'Échue'
  return `${diffDays}j`
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
  })
}

const formatRelativeDate = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

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
)
</script>