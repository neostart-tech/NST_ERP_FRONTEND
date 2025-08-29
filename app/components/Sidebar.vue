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
      <!-- Lien pour ajouter le logo de l'entreprise -->
      <a href="#" class="flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm">
        <!-- Remplacez cette balise img par votre logo -->
        <img src="C:\Users\Ambroise ADENYO\Desktop\stage_projet\images\ez426phx.png" alt="Logo de l'entreprise" class="w-13 h-13 object-contain">
        <!-- Ou utilisez ce SVG par défaut si le logo n'est pas encore disponible -->
        <!--
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        -->
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
                    :to="AppUrl.INFOPROPO"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.INFOPROPO  || $route.path===AppUrl.PROPO}"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Proforma</p>
                      <p class="nav-description">Propositions</p>
                    </div>
                  </NuxtLink>

                   <NuxtLink
                    :to="AppUrl.ORDERINFO"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.ORDERINFO  || $route.path===AppUrl.ORDER}"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        ></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Commandes</p>
                      <p class="nav-description">Suivi des commandes</p>
                    </div>
                  </NuxtLink>

                   <NuxtLink
                    :to="AppUrl.INVOICEINFO"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.INVOICEINFO  || $route.path===AppUrl.INVOICE}"
                  >
                    <div class="nav-icon">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                          ></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Factures</p>
                      <p class="nav-description">Recap facture</p>
                    </div>
                  </NuxtLink>

                   <NuxtLink
                    :to="AppUrl.DELIVERYINFO"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.DELIVERYINFO }"
                  >
                    <div class="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0zm-4-2V6a1 1 0 00-1-1H3a1 1 0 00-1 1v9a1 1 0 001 1h1a4 4 0 008 0h4a4 4 0 008 0h1a1 1 0 001-1v-4a1 1 0 00-1-1h-3z"/>
                        </svg>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Livraison</p>
                      <p class="nav-description">Bordereau de livraison</p>
                    </div>
                  </NuxtLink>

                   <NuxtLink
                    :to="AppUrl.SCHEDULEINFO"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.SCHEDULEINFO  || $route.path===AppUrl.SCHEDULE}"
                  >
                    <div class="nav-icon">
                      <i class="fas fa-calendar-alt w-6 text-center"></i>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Echéanciers</p>
                      <p class="nav-description">Suivre les paiements</p>
                    </div>
                  </NuxtLink>

                  
                   <!-- <NuxtLink
                    :to="AppUrl.BALANCE"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.BALANCE }"
                  >
                    <div class="nav-icon">
                      <i class="fas fa-file-invoice-dollar text-center w-6"></i>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Bilan</p>
                      <p class="nav-description">$$</p>
                    </div>
                  </NuxtLink> -->

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

      <div class="nav-section">
        <button
          @click="toggleSection('maintenance')"
          class="w-full nav-section-header"
          :class="{ 'nav-section-header-active': expandedSections.maintenance }"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-3">
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 class="nav-section-label">Maintenance</h3>
            </div>
            <svg class="w-4 h-4 transition-transform duration-200 text-white" :class="{ 'rotate-180': expandedSections.maintenance }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>

        <transition name="slide-down">
          <div v-show="expandedSections.maintenance" class="mt-2 space-y-1">
            <NuxtLink :to="AppUrl.MAINTENANCE_TICKETS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.MAINTENANCE_TICKETS }">
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Tickets</p>
                <p class="nav-description">Gestion des incidents</p>
              </div>
            </NuxtLink>

            <NuxtLink :to="AppUrl.MAINTENANCE_PLANNING" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.MAINTENANCE_PLANNING }">
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Planning</p>
                <p class="nav-description">Interventions programmées</p>
              </div>
            </NuxtLink>

            <NuxtLink :to="AppUrl.MAINTENANCE_EQUIPMENTS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.MAINTENANCE_EQUIPMENTS }">
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Équipements</p>
                <p class="nav-description">Parc matériel</p>
              </div>
            </NuxtLink>

            <NuxtLink :to="AppUrl.MAINTENANCE_CONTRACTS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.MAINTENANCE_CONTRACTS }">
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Contrats</p>
                <p class="nav-description">Maintenance préventive</p>
              </div>
            </NuxtLink>

            <NuxtLink :to="AppUrl.MAINTENANCE_REPORTS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.MAINTENANCE_REPORTS }">
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Rapports</p>
                <p class="nav-description">Bilans et statistiques</p>
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
        <span class="text-white font-bold text-lg">{{ useAuthStore().fullName?.charAt(0)?.toUpperCase() || 'U' }}</span>
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-white truncate">{{ useAuthStore().fullName || 'Utilisateur' }}</p>
      <p class="text-xs text-sky-200 truncate">
        {{ 
          (() => {
            const role = useAuthStore().user?.role || '';
            return role.charAt(0).toUpperCase() + role.slice(1);
          })()
        }}
      </p>
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

    <!-- Main content area avec padding pour le sidebar -->
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const showUserMenu = ref(false)
const showHeaderUserMenu = ref(false)
const mobileSidebarOpen = ref(false)

// Sections dépliables
const expandedSections = ref({
  sales: false,
  tenders: false,
  clients: false,
  fournisseurs: false,
  maintenance: false
})

// Fonction pour basculer les sections
const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section]
  // Sauvegarde l'état dans localStorage si nécessaire
  localStorage.setItem('sidebar-expanded-sections', JSON.stringify(expandedSections.value))
}

// Charge l'état sauvegardé
const loadSavedState = () => {
  const savedState = localStorage.getItem('sidebar-expanded-sections')
  if (savedState) {
    try {
      expandedSections.value = JSON.parse(savedState)
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
  if (path.startsWith('/maintenance')) expandedSections.value.maintenance = true
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
    showHeaderUserMenu.value = false
  }
}

// Logique de déconnexion
const logout = () => {
  authStore.logout();
  showUserMenu.value = false
  showHeaderUserMenu.value = false
}

const pageTitle = computed(() => {
  const titleMap: Record<string, string> = {
    '/login': 'Connexion',
    '/': 'Tableau de bord',
    '/dashboard': 'Tableau de bord',
    '/customer': 'Gestion des Clients',
    '/recouvrement': 'Gestion des recouvrements',
    '/users': 'Gestion des utilisateurs',
    '/sales': 'Gestion des commerciaux',
   
  }
  return titleMap[route.path] || 'Neo Start Tech'
})
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

.nav-section-title {
  @apply text-sm font-bold text-white/90 uppercase tracking-wider;
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
}

.nav-item:hover {
  transform: translateX(2px);
}

.nav-item-active:hover {
  transform: translateX(0);
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
.nav-item {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200;
  @apply text-white/90 hover:bg-white/10 hover:text-white;
}

.nav-item-active {
  @apply bg-white/15 border-l-4 border-white/50 text-white;
  @apply shadow-lg backdrop-blur-sm;
}

.nav-item-nested {
  @apply ml-4 relative;
}
</style>