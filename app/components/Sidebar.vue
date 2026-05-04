<template>
  <div>
    <!-- Mobile overlay with smooth backdrop -->
    <div
      v-if="mobileSidebarOpen"
      @click="mobileSidebarOpen = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 z-40"
    />

    <!-- Hamburger button for mobile -->
    <button
      @click="mobileSidebarOpen = !mobileSidebarOpen"
      class="fixed top-4 left-4 z-50 p-2 text-gray-600 rounded-lg lg:hidden bg-white/90 backdrop-blur-sm shadow-md"
      :class="{ 'left-[17rem]': mobileSidebarOpen }"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="!mobileSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <aside 
      class="fixed inset-y-0 left-0 z-40 w-64 h-screen overflow-hidden transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="{'translate-x-0': mobileSidebarOpen, '-translate-x-full': !mobileSidebarOpen}"
    >
      <div class="flex flex-col h-full bg-gradient-to-b from-sky-800 to-sky-900 shadow-xl">
        <!-- Header fixe -->
        <div class="flex-shrink-0 px-6 py-5 border-b border-sky-700 bg-sky-800 sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <a href="#" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </a>
              <div>
                <h1 class="text-lg font-bold text-white">Neo Start Tech</h1>
                <p class="text-xs font-medium text-sky-200">Business Manager</p>
              </div>
            </div>

            <!-- Mobile close button moved to the top left -->
            <div class="w-8"></div>
          </div>
        </div>

        <!-- Navigation scrollable -->
        <nav class="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          <div class="space-y-1">
            <NuxtLink
              :to="AppUrl.DASHBOARD"
              class="nav-item"
              :class="{ 'nav-item-active': $route.path === AppUrl.DASHBOARD }"
            >
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Tableau de bord</p>
                <p class="nav-description">Vue d'ensemble</p>
              </div>
            </NuxtLink>

            <div class="nav-section">
              <button
                @click="toggleSection('clients')"
                class="w-full nav-section-header"
                :class="{ 'nav-section-header-active': expandedSections.clients }"
              >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                      </svg>
                    </div>
                    <h3 class="nav-section-label">Clients</h3>
                  </div>
                  <svg class="w-4 h-4 transition-transform duration-200 text-white" :class="{ 'rotate-180': expandedSections.clients }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>

              <transition name="slide-down">
                <div v-show="expandedSections.clients" class="mt-2 space-y-1">
                  <NuxtLink :to="AppUrl.CLIENTS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.CLIENTS }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Gestion client</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink :to="AppUrl.SALES" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SALES }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Gestion commerciaux</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink :to="AppUrl.FOLLOWUP" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.FOLLOWUP }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Gestion recouvrement</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink :to="AppUrl.USERS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.USERS }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Gestion des utilisateurs</p>
                    </div>
                  </NuxtLink>
                </div>
              </transition>
            </div>

            <div class="nav-section">
              <button
                @click="toggleSection('sales')"
                class="w-full nav-section-header"
                :class="{ 'nav-section-header-active': expandedSections.sales }"
              >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                      </svg>
                    </div>
                    <h3 class="nav-section-label">Ventes</h3>
                  </div>
                  <svg
                    class="w-4 h-4 transition-transform duration-200 text-white"
                    :class="{ 'rotate-180': expandedSections.sales }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>

              <transition name="slide-down">
                <div v-show="expandedSections.sales" class="mt-2 space-y-1">
                  <NuxtLink
                    :to="AppUrl.QUOTES"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.QUOTES }"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Devis</p>
                      <p class="nav-description">Propositions commerciales</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    :to="AppUrl.ORDERS"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.ORDERS }"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Commandes</p>
                      <p class="nav-description">Suivi des ventes</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    :to="AppUrl.INVOICES"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.INVOICES }"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Factures</p>
                      <p class="nav-description">Facturation client</p>
                    </div>
                  </NuxtLink>
                </div>
              </transition>
            </div>

            <div class="nav-section">
              <button
                @click="toggleSection('tenders')"
                class="w-full nav-section-header"
                :class="{ 'nav-section-header-active': expandedSections.tenders }"
              >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                      </svg>
                    </div>
                    <h3 class="nav-section-label">Appels d'Offres</h3>
                  </div>
                  <svg
                    class="w-4 h-4 transition-transform duration-200 text-white"
                    :class="{ 'rotate-180': expandedSections.tenders }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>

              <transition name="slide-down">
                <div v-show="expandedSections.tenders" class="mt-2 space-y-1">
                  <NuxtLink
                    :to="AppUrl.TENDERS"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.TENDERS }"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Appels d'Offres</p>
                      <p class="nav-description">Gestion & soumissions</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    :to="AppUrl.TENDERS_DOCUMENTS"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.TENDERS_DOCUMENTS }"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Documents</p>
                      <p class="nav-description">Dossiers & pièces jointes</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    :to="AppUrl.TENDERS_SUBMISSIONS"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.TENDERS_SUBMISSIONS }"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Soumissions</p>
                      <p class="nav-description">Envoi & suivi résultats</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    :to="AppUrl.TENDERS_PROJECTS"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.TENDERS_PROJECTS }"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Pilotage Projet</p>
                      <p class="nav-description">Tâches & planning</p>
                    </div>
                  </NuxtLink>
                </div>
              </transition>
            </div>

            <div class="nav-section">
              <button
                @click="toggleSection('fournisseurs')"
                class="w-full nav-section-header"
                :class="{ 'nav-section-header-active': expandedSections.fournisseurs }"
              >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21v-8a2 2 0 00-2-2h-1V8a6 6 0 00-6-6H8a6 6 0 00-6 6v3h14a2 2 0 012 2v8m-6-12v12m-3-3h6"/>
                      </svg>
                    </div>
                    <h3 class="nav-section-label">Fournisseurs</h3>
                  </div>
                  <svg class="w-4 h-4 transition-transform duration-200 text-white" :class="{ 'rotate-180': expandedSections.fournisseurs }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>

              <transition name="slide-down">
                <div v-show="expandedSections.fournisseurs" class="mt-2 space-y-1">
                  <NuxtLink :to="AppUrl.SUPPLIERS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SUPPLIERS }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Fiches Fournisseurs</p>
                      <p class="nav-description">Dossiers complets</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink :to="AppUrl.SUPPLIERS_CONTACTS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SUPPLIERS_CONTACTS }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Contacts</p>
                      <p class="nav-description">Interlocuteurs commerciaux</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink :to="AppUrl.SUPPLIERS_COMMANDS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SUPPLIERS_COMMANDS }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Commandes</p>
                      <p class="nav-description">Historique des achats</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink :to="AppUrl.SUPPLIERS_CONTRACTS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SUPPLIERS_CONTRACTS }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Contrats</p>
                      <p class="nav-description">Accords commerciaux</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink :to="AppUrl.SUPPLIERS_EVALUATIONS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SUPPLIERS_EVALUATIONS }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Évaluations</p>
                      <p class="nav-description">Performances fournisseurs</p>
                    </div>
                  </NuxtLink>
                </div>
              </transition>
            </div>

            <!-- Gestion de stock, marge et réapprovisionnement -->
            <div class="nav-section">
              <button
                @click="toggleSection('stock')"
                class="w-full nav-section-header"
                :class="{ 'nav-section-header-active': expandedSections.stock }"
              >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <h3 class="nav-section-label">Gestion Du Stock, Marge et Réapprovisionnement</h3>
                  </div>
                  <svg class="w-4 h-4 transition-transform duration-200 text-white" :class="{ 'rotate-180': expandedSections.stock }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>

              <transition name="slide-down">
                <div v-show="expandedSections.stock" class="mt-2 space-y-1">
                  <!-- Dashboard -->
                  <NuxtLink :to="AppUrl.DASHBOARD_STOCK" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.DASHBOARD_STOCK }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Dashboard</p>
                      <p class="nav-description">Gestion du stock, marges et réapprovisionnement</p>
                    </div>
                  </NuxtLink>

                  <!-- Fournisseurs -->
                  <NuxtLink :to="AppUrl.SUPPLIERS_STOCK" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SUPPLIERS_STOCK }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Gestion des fournisseurs</p>
                      <p class="nav-description">Information sur un fournisseur</p>
                    </div>
                  </NuxtLink>

                  <!-- Articles -->
                  <NuxtLink :to="AppUrl.PRODUCTS_STOCK" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.PRODUCTS_STOCK }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                        <path d="M10 9H8"/>
                        <path d="M16 13H8"/>
                        <path d="M16 17H8"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Gestion des articles</p>
                      <p class="nav-description">Les informations sur les articles</p>
                    </div>
                  </NuxtLink>

                  <!-- Prix fournisseurs -->
                  <NuxtLink :to="AppUrl.SUPPLIER_PRICES_STOCK" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SUPPLIER_PRICES_STOCK }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m7.5 4.27 9 5.15"/>
                        <path d="m7.5 19.73 9-5.15"/>
                        <path d="M3.3 8.7L12 3l8.7 5.7"/>
                        <path d="M12 22V12"/>
                        <path d="M20.7 15.3 12 21l-8.7-5.7"/>
                        <path d="M3.3 15.3l8.7 5.7 8.7-5.7"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Gestion des prix des fournisseurs</p>
                      <p class="nav-description">Un article et ses différents prix selon les fournisseurs</p>
                    </div>
                  </NuxtLink>

                  <!-- Bon de commande -->
                  <NuxtLink :to="AppUrl.PURSHASE_ORDERS_STOCK" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.PURSHASE_ORDERS_STOCK }">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Bon de commande</p>
                      <p class="nav-description"></p>
                    </div>
                  </NuxtLink>

                  <!-- Réception et lots -->
                  <NuxtLink :to="AppUrl.RECEIVING_BATCHES_STOCK" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.RECEIVING_BATCHES_STOCK }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="8" height="4" x="8" y="2"/>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        <path d="M12 11h4"/>
                        <path d="M12 16h4"/>
                        <path d="M8 11h.01"/>
                        <path d="M8 16h.01"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Réception et lots</p>
                      <p class="nav-description"></p>
                    </div>
                  </NuxtLink>

                  <!-- Vente -->
                  <NuxtLink :to="AppUrl.SALE_STOCK" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.SALE_STOCK }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="8" height="4" x="8" y="2"/>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        <path d="m9 14 2 2 4-4"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Vente</p>
                      <p class="nav-description"></p>
                    </div>
                  </NuxtLink>
                </div>
              </transition>
            </div>




            

            <!-- MAINTENANCE ET CONTRAT -->
            <div class="nav-section">
              <button
                @click="toggleSection('maintenanceEtContrat')"
                class="w-full nav-section-header"
                :class="{ 'nav-section-header-active': expandedSections.maintenanceEtContrat }"
              >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <h3 class="nav-section-label">Maintenance Et Contrat</h3>
                  </div>
                  <svg class="w-4 h-4 transition-transform duration-200 text-white" :class="{ 'rotate-180': expandedSections.maintenanceEtContrat }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </button>

              <transition name="slide-down">
                <div v-show="expandedSections.maintenanceEtContrat" class="mt-2 space-y-1">
                  <!-- Dashboard -->
                  <NuxtLink :to="AppUrl.DASHBOARD_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.DASHBOARD_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Dashboard</p>
                      <p class="nav-description">Vue d'ensemble</p>
                    </div>
                  </NuxtLink>

                  <!-- Customers -->
                  <NuxtLink :to="AppUrl.CUSTOMERS_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.CUSTOMERS_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Clients</p>
                      <p class="nav-description">Gestion des clients</p>
                    </div>
                  </NuxtLink>

                  <!-- Technicians -->
                  <NuxtLink :to="AppUrl.TECHNICIANS_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.TECHNICIANS_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Techniciens</p>
                      <p class="nav-description">Gestion des techniciens</p>
                    </div>
                  </NuxtLink>

                  <!-- Equipment -->
                  <NuxtLink :to="AppUrl.EQUIPMENT_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.EQUIPMENT_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m7.5 4.27 9 5.15"/>
                        <path d="m7.5 19.73 9-5.15"/>
                        <path d="M3.3 8.7L12 3l8.7 5.7"/>
                        <path d="M12 22V12"/>
                        <path d="M20.7 15.3 12 21l-8.7-5.7"/>
                        <path d="M3.3 15.3l8.7 5.7 8.7-5.7"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Équipements</p>
                      <p class="nav-description">Parc matériel</p>
                    </div>
                  </NuxtLink>

                  <!-- Breakdowns -->
                  <NuxtLink :to="AppUrl.BREAKDOWNS_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.BREAKDOWNS_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Pannes</p>
                      <p class="nav-description">Signalement et suivi</p>
                    </div>
                  </NuxtLink>

                  <!-- Quotes -->
                  <NuxtLink :to="AppUrl.QUOTES_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.QUOTES_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2h-2V1h-2v1H8V1H6v1H4Z"/>
                        <path d="M18 6H8"/>
                        <path d="M18 10H8"/>
                        <path d="M18 14H8"/>
                        <path d="M18 18H8"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Devis</p>
                      <p class="nav-description">Gestion des devis</p>
                    </div>
                  </NuxtLink>

                  <!-- Contracts -->
                  <NuxtLink :to="AppUrl.CONTRACTS_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.CONTRACTS_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="8" height="4" x="8" y="2"/>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        <path d="m9 14 2 2 4-4"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Contrats</p>
                      <p class="nav-description">Maintenance</p>
                    </div>
                  </NuxtLink>

                  <!-- Invoices -->
                  <NuxtLink :to="AppUrl.INVOICES_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.INVOICES_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Factures</p>
                      <p class="nav-description">Gestion des factures</p>
                    </div>
                  </NuxtLink>

                  <!-- Customer File Explorer -->
                  <NuxtLink :to="AppUrl.CUSTOMER_FILE_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path.startsWith(AppUrl.CUSTOMER_FILE_MAINTENANCE_ET_CONTRACT) }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="8" height="4" x="8" y="2"/>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        <path d="M12 11h4"/>
                        <path d="M12 16h4"/>
                        <path d="M8 11h.01"/>
                        <path d="M8 16h.01"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Explorateur Client</p>
                      <p class="nav-description">Dossiers et fichiers</p>
                    </div>
                  </NuxtLink>

                  <!-- Reporting -->
                  <NuxtLink :to="AppUrl.REPORTING_MAINTENANCE_ET_CONTRACT" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.REPORTING_MAINTENANCE_ET_CONTRACT }">
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12a9 9 0 1 0-9 9"/>
                        <path d="M12 7v5l3 3"/>
                        <path d="M21 21v-4h-4"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Reporting</p>
                      <p class="nav-description">Statistiques et rapports</p>
                    </div>
                  </NuxtLink>
                </div>
              </transition>
            </div>
          </div>
        </nav>

        <!-- Footer utilisateur -->
        <div class="flex-shrink-0 px-4 py-4 border-t border-sky-700 bg-sky-900">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 12a5 5 0 015 5v2h-2a3 3 0 00-3-3 3 3 0 00-3 3h-2v-2a5 5 0 015-5z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">{{ useAuthStore().user?.name || 'Utilisateur' }}</p>
              <p class="text-xs text-sky-200 truncate">{{ useAuthStore().user?.role || 'Rôle' }}</p>
            </div>
            <div class="flex-shrink-0">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Menu utilisateur -->
          <transition name="header-user-menu">
            <div v-if="showUserMenu" class="absolute bottom-20 left-4 right-4 z-50 py-2 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-200" @click.stop>
              <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md mx-1">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 12a5 5 0 015 5v2h-2a3 3 0 00-3-3 3 3 0 00-3 3h-2v-2a5 5 0 015-5z"/>
                </svg>
                <span>Mon Profil</span>
              </a>
              <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md mx-1">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Paramètres</span>
              </a>
              <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-md mx-1">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zM13.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
                <span>Aide & Support</span>
              </a>
              <div class="border-t border-gray-100 mt-2 pt-2">
                <button @click="logout" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-md">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../Store/authStore'

const route = useRoute()
const authStore = useAuthStore()

// State
const showUserMenu = ref(false)
const mobileSidebarOpen = ref(false)

// Sections dépliables
const expandedSections = ref({
  sales: false,
  tenders: false,
  clients: false,
  fournisseurs: false,
  stock: false,
  maintenance: false,
  maintenanceEtContrat: false
})

// Fonction pour basculer les sections
const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section]
  localStorage.setItem('sidebar-expanded-sections', JSON.stringify(expandedSections.value))
}

// Charge l'état sauvegardé
const loadSavedState = () => {
  const savedState = localStorage.getItem('sidebar-expanded-sections')
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState)
      expandedSections.value = { ...expandedSections.value, ...parsed }
    } catch (e) {
      console.error("Erreur de parsing de l'état du sidebar", e)
    }
  }
}

// Auto-expand basé sur la route actuelle
const autoExpandBasedOnRoute = () => {
  const path = route.path
  if (path.startsWith('/clients')) expandedSections.value.clients = true
  if (path.startsWith('/fournisseurs')) expandedSections.value.fournisseurs = true
  if (path.startsWith('/stock')) expandedSections.value.stock = true
  if (path.startsWith('/maintenance-et-contrat')) expandedSections.value.maintenanceEtContrat = true
  if (path.startsWith('/ventes')) expandedSections.value.sales = true
  if (path.startsWith('/tenders')) expandedSections.value.tenders = true
}

// Initialisation
onMounted(() => {
  loadSavedState()
  autoExpandBasedOnRoute()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative') && !target.closest('[data-user-menu]')) {
    showUserMenu.value = false
  }
}

// Logique de déconnexion
const logout = () => {
  authStore.logout();
  showUserMenu.value = false
}
</script>

<style scoped>
.nav-item-nested::before {
  content: '';
  @apply absolute left-0 top-0 bottom-0 w-0.5 bg-white/30;
}

.nav-item-nested.nav-item-active::before {
  @apply bg-white/60;
}

.nav-icon {
  @apply p-2 rounded-lg transition-all duration-200;
  @apply bg-white/10 text-white/80;
}

.nav-item-active .nav-icon {
  @apply bg-white/20 text-white;
}

.nav-item:hover .nav-icon {
  @apply bg-white/20 text-white;
}

.nav-item-active:hover .nav-icon {
  @apply bg-white/25 text-white;
}

.nav-label {
  @apply font-semibold text-sm text-white;
}

.nav-description {
  @apply text-xs opacity-80 font-medium text-white/70;
}

.nav-section {
  @apply mt-6;
}

.nav-section-header {
  @apply w-full px-4 py-3 text-left rounded-lg transition-all duration-200;
  @apply text-white/80 hover:bg-white/10 hover:text-white;
  @apply focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-opacity-50;
}

.nav-section-header-active {
  @apply bg-white/10 text-white;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-white/20 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-white/30;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.slide-down-enter-from {
  opacity: 0;
  transform: scaleY(0.8) translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: scaleY(0.8) translateY(-10px);
}

.nav-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  @apply flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200;
  @apply text-white/90 hover:bg-white/10 hover:text-white;
}

.nav-item:hover {
  transform: translateX(2px);
}

.nav-item-active {
  @apply bg-white/15 border-l-4 border-white/50 text-white;
  @apply shadow-lg backdrop-blur-sm;
}

.nav-item-active:hover {
  transform: translateX(0);
}

.nav-item-nested {
  @apply ml-4 relative;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Animations des menus utilisateur */
.user-menu-enter-active,
.user-menu-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-menu-enter-from,
.user-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.header-user-menu-enter-active,
.header-user-menu-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-user-menu-enter-from,
.header-user-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>