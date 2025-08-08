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
          @click="navigateToNewoffer"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          <i class="w-4 h-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </i>
        </button>
        <NuxtLink
          to="/offers/submission-form"
          aria-label="Voir tous les appels d'offres"
          class="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="w-4 h-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </i>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
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
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.totaloffers || 0 }}</p>
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
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.activeoffers || 0 }}</p>
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
            <p class="text-2xl font-semibold text-gray-800">{{ metrics.submittedoffers || 0 }}</p>
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
              <div class="bg-purple-600 h-1.5 rounded-full" :style="{ width: Math.min(metrics.successRate || 0, 100) + '%' }"></div>
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
            <i class="h-5 w-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Valeur Totale</p>
            <p class="text-xl font-bold text-gray-900">{{ formatCurrency(metrics.totalValue) }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-green-50 text-green-600 mr-4">
            <i class="h-5 w-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Valeur Gagnée</p>
            <p class="text-xl font-bold text-green-600">{{ formatCurrency(metrics.wonValue) }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-blue-50 text-blue-600 mr-4">
            <i class="h-5 w-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">En Attente</p>
            <p class="text-xl font-bold text-blue-600">{{ formatCurrency(metrics.pendingValue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent offers -->
    <div v-if="showRecentoffers" class="mt-10">
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
              >
                <i class="h-4 w-4 mr-1.5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </i>
                Actualiser
              </button>
              <button
                @click="navigateToNewoffer"
                type="button"
                class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <i class="-ml-0.5 mr-1.5 h-4 w-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </i>
                Nouvel appel d'offres
              </button>
            </div>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-500">Derniers appels d'offres ajoutés ou modifiés</p>
      </div>
      
      <div v-if="recentoffers.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200">
          <li v-for="offer in paginatedoffers" :key="offer.id" class="group hover:bg-gray-50 transition-colors duration-150">
            <a href="#" @click.prevent="navigateTooffer(offer.id)" class="block">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center min-w-0">
                    <div class="flex-shrink-0 mr-4">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <i class="h-5 w-5 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </i>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ offer.title }}
                      </p>
                      <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                          <i class="h-4 w-4 mr-1.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </i>
                          <span>{{ formatDate(offer.deadline) }}</span>
                        </div>
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                          <i class="h-4 w-4 mr-1.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </i>
                          <span>{{ formatCurrency(offer.estimatedValue) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4 flex-shrink-0 flex flex-col items-end">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1" :class="getStatusBadgeClass(offer.status)">
                      {{ getStatusLabel(offer.status) }}
                    </span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="getDeadlineBadgeClass(offer.deadline)">
                      <i class="h-3 w-3 mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </i>
                      {{ getDaysUntilDeadline(offer.deadline) }}
                    </span>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <i class="h-4 w-4 mr-1.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </i>
                      {{ offer.client || 'Aucun client' }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <i class="h-4 w-4 mr-1.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </i>
                    <span>Mis à jour {{ formatRelativeDate(offer.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
      
      <!-- Liste alternative des appels d'offres (version simplifiée) -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
        <p class="sr-only">Liste des appels d'offres récents</p>
        <ul class="divide-y divide-gray-200">
          <li 
            v-for="offer in paginatedoffers"
            :key="offer.id"
            class="group hover:bg-gray-50 transition-colors duration-150"
          >
            <a href="#" @click.prevent="navigateTooffer(offer.id)" class="block">
              <div class="px-4 py-3 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center min-w-0">
                    <div class="flex-shrink-0 mr-3">
                      <div class="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <i class="h-4 w-4 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </i>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ offer.title }}
                      </p>
                      <div class="mt-1 flex items-center text-xs text-gray-500">
                        <span class="truncate">{{ offer.reference }}</span>
                        <span class="mx-1">•</span>
                        <span>{{ formatRelativeDate(offer.updatedAt) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4 flex-shrink-0 flex items-center">
                    <span class="text-sm font-medium text-gray-900 mr-3">
                      {{ formatCurrency(offer.estimatedValue) }}
                    </span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadgeClass(offer.status)">
                      {{ getStatusLabel(offer.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Échéances Proches -->
    <section v-if="showUpcomingDeadlines && upcomingDeadlines.length > 0" class="mt-10" aria-labelledby="upcoming-deadlines-heading">
      <div class="border-b border-gray-200 pb-5 mb-6">
        <h2 id="upcoming-deadlines-heading" class="text-lg font-semibold leading-6 text-gray-900">Échéances Proches</h2>
        <p class="mt-1 text-sm text-gray-500">Appels d'offres dont la date limite approche</p>
      </div>
      
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200">
          <li 
            v-for="offer in upcomingDeadlines.slice(0, 5)"
            :key="offer.id"
            class="group hover:bg-gray-50 transition-colors duration-150"
          >
            <a href="#" @click.prevent="navigateTooffer(offer.id)" class="block">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center min-w-0">
                    <div class="flex-shrink-0 mr-4">
                      <div class="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                        <i class="h-5 w-5 text-red-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </i>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ offer.title }}
                      </p>
                      <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                          <i class="h-4 w-4 mr-1.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </i>
                          <span :class="getDeadlineColor(offer.deadline)">
                            {{ formatDate(offer.deadline) }} ({{ getDaysUntilDeadline(offer.deadline) }})
                          </span>
                        </div>
                        <div v-if="offer.reference" class="mt-2 flex items-center text-sm text-gray-500">
                          <i class="h-4 w-4 mr-1.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </i>
                          <span class="truncate">{{ offer.reference }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadgeClass(offer.status)">
                      {{ getStatusLabel(offer.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
        
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="button"
            @click="navigateToofferList()"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            aria-label="Voir toutes les échéances d'appels d'offres"
          >
            Voir toutes les échéances
            <svg class="ml-1 -mr-0.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div v-if="metrics.totaloffers === 0" class="text-center py-8" role="alert" aria-live="polite">
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
          @click="navigateToNewoffer"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useoffersStore } from '../../stores/offers'
import type { offer, offerMetrics } from '../../../models/offers'

type offerStatus = 'draft' | 'active' | 'submitted' | 'evaluation' | 'won' | 'lost' | 'cancelled'


interface Props {
  title?: string
  showRecentoffers?: boolean
  showUpcomingDeadlines?: boolean
  autoRefresh?: boolean
  refreshInterval?: number // in minutes
}

const props = withDefaults(defineProps<Props>(), {
  title: "Appels d'Offres - Vue d'ensemble",
  showRecentoffers: true,
  showUpcomingDeadlines: true,
  autoRefresh: false,
  refreshInterval: 5,
})

const offersStore = useoffersStore()
const router = useRouter()
const isLoading = ref(false)
const error = ref<Error | null>(null)
let refreshTimer: ReturnType<typeof setInterval> | null = null

// Computed values
const metrics = computed((): offerMetrics => offersStore.metrics)

const successRateFormatted = computed(() =>
  metrics.value.successRate ? metrics.value.successRate.toFixed(1) : '0.0',
)

const currentPage = ref(1)
const itemsPerPage = ref(5)

const recentoffers = computed<offer[]>(() => {
  // @ts-ignore - Le store sera typé correctement plus tard
  return useoffersStore().recentoffers || []
})

const paginatedoffers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return recentoffers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(recentoffers.value.length / itemsPerPage.value)
})

const showPagination = computed(() => {
  return recentoffers.value.length > itemsPerPage.value
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

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const upcomingDeadlines = computed((): offer[] => {
  try {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const offers = offersStore.getoffers() || []

    return offers
      .filter((offer: offer) => {
        try {
          if (!offer?.deadline) return false
          const deadline = new Date(offer.deadline)
          return !isNaN(deadline.getTime()) && 
                 deadline > now && 
                 deadline <= thirtyDaysFromNow && 
                 offer.status === 'active'
        } catch (e) {
          console.error('Error processing offer:', offer?.id, e)
          return false
        }
      })
      .sort((a: offer, b: offer) => {
        try {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        } catch (e) {
          console.error('Error sorting offers:', e)
          return 0
        }
      })
      .slice(0, 5)
  } catch (error) {
    console.error('Error in upcomingDeadlines computed property:', error)
    return []
  }
})

// Methods
const refreshData = async (): Promise<void> => {
  if (isLoading.value) return
  
  isLoading.value = true
  error.value = null
  
  try {
    // Exécution séquentielle pour un meilleur suivi des erreurs
    await offersStore.fetchoffers()
    await offersStore.fetchMetrics()
    
    // Vérification des données après chargement
    const offers = offersStore.getoffers()
    if (!Array.isArray(offers)) {
      throw new Error('Format de données invalide reçu du serveur')
    }
  } catch (err) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'Une erreur inattendue est survenue lors du chargement des données'
    
    console.error('Erreur lors du rafraîchissement des données:', err)
    error.value = new Error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const setupAutoRefresh = (): void => {
  clearAutoRefresh() // Nettoyer tout minuteur existant
  
  if (props.autoRefresh && props.refreshInterval && props.refreshInterval > 0) {
    const intervalMs = props.refreshInterval * 60 * 1000
    refreshTimer = setInterval(() => {
      refreshData().catch(err => {
        console.error('Erreur lors du rafraîchissement automatique:', err)
      })
    }, intervalMs)
    
    // Rafraîchir immédiatement si nécessaire
    if (offersStore.getoffers().length === 0) {
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
const navigateTooffer = (offerId: string): void => {
  router.push(`/offers/${offerId}`)
}

const navigateToNewoffer = (): void => {
  router.push(AppUrl.OFFERS_NEW)
}

const navigateToofferList = (): void => {
  router.push(AppUrl.OFFERS)
}

// Status and urgency helpers
const getofferStatusDot = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-400',
    active: 'bg-blue-500',
    submitted: 'bg-yellow-500',
    evaluation: 'bg-purple-500',
    won: 'bg-green-500',
    lost: 'bg-red-500',
    cancelled: 'bg-gray-300',
  }
  return colors[status] || 'bg-gray-400'
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    active: 'Actif',
    submitted: 'Soumis',
    evaluation: 'En évaluation',
    won: 'Gagné',
    lost: 'Perdu',
    cancelled: 'Annulé',
  }
  return labels[status] || status
}

const getUrgencyDot = (deadline: string): string => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 3) return 'bg-red-500'
  if (diffDays <= 7) return 'bg-orange-500'
  if (diffDays <= 14) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getStatusBadgeClass = (status: string): string => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    submitted: 'bg-yellow-100 text-yellow-800',
    evaluation: 'bg-purple-100 text-purple-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getDeadlineBadgeClass = (deadline: string): string => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'bg-red-100 text-red-800'
  if (diffDays <= 3) return 'bg-red-100 text-red-800'
  if (diffDays <= 7) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

const getDeadlineColor = (deadline: string): string => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'text-red-500'
  if (diffDays <= 7) return 'text-yellow-500'
  return 'text-green-500'
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
</script>
