<template>
  <div>
    <!-- Mobile overlay avec backdrop smooth -->
    <div v-if="mobileSidebarOpen" @click="mobileSidebarOpen = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 z-40" />

    <!-- Bouton hamburger pour mobile -->
    <button @click="mobileSidebarOpen = !mobileSidebarOpen"
      class="fixed top-4 left-4 z-50 p-2 text-gray-600 rounded-lg lg:hidden bg-white/90 backdrop-blur-sm shadow-md"
      :class="{ 'left-[17rem]': mobileSidebarOpen }">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="!mobileSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"></path>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 h-screen overflow-hidden transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="{ 'translate-x-0': mobileSidebarOpen, '-translate-x-full': !mobileSidebarOpen }">
      <div class="flex flex-col h-full bg-gradient-to-b from-sky-800 to-sky-900 shadow-xl">
        <!-- Header fixe -->
        <div class="flex-shrink-0 px-6 py-5 border-b border-sky-700 bg-sky-800 sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <a href="#" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </a>
              <div>
                <h1 class="text-lg font-bold text-white">Neo Start Tech</h1>
                <p class="text-xs font-medium text-sky-200">Business Manager</p>
              </div>
            </div>

            <!-- Bouton de fermeture mobile déplacé en haut à gauche -->
            <div class="w-8"></div>
          </div>
        </div>

        <!-- Navigation scrollable -->
        <nav class="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          <div class="space-y-1">
            <!-- Itération sur les menus -->
            <template v-for="menu in sidebarMenu" :key="menu.id">
              <!-- Menu simple (sans sous-menus) -->
              <NuxtLink v-if="menu.isSingle" :to="menu.url" class="nav-item"
                :class="{ 'nav-item-active': $route.path === menu.url }">
                <div class="nav-icon">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="menu.icon" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="nav-label">{{ menu.name }}</p>
                  <p v-if="menu.description" class="nav-description">{{ menu.description }}</p>
									</div>
              </NuxtLink>

              <!-- <transition name="slide-down">
                <div v-show="expandedSections.sales" class="mt-2 space-y-1">

                  <NuxtLink :to="AppUrl.CLIENTS" class="nav-item nav-item-nested" :class="{ 'nav-item-active': $route.path === AppUrl.CLIENTS || $route.path===AppUrl.CLIENTS }">
              <div class="nav-icon">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="nav-label">Gestion client</p>

              </div>
            </NuxtLink>


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


                   <NuxtLink
                    :to="AppUrl.BALANCE"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.BALANCE }"
                  >
                    <div class="nav-icon">
                      <i class="fas fa-file-invoice-dollar text-center w-6"></i>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Bilans</p>
                      <p class="nav-description">$$</p>
                    </div>
                  </NuxtLink>

                  <NuxtLink
                    :to="AppUrl.STATS"
                    class="nav-item nav-item-nested"
                    :class="{ 'nav-item-active': $route.path === AppUrl.STATS }"
                  >
                    <div class="nav-icon">
                      <i class="fas fa-file-invoice-dollar text-center w-6"></i>
                    </div>
                    <div class="flex-1">
                      <p class="nav-label">Statistiqes</p>
                      <p class="nav-description"></p>
                    </div>
                  </NuxtLink>

                </div>
              </NuxtLink> -->

              <!-- Menu avec sous-menus -->
              <!-- <div v-else class="nav-section">
                <button @click="toggleSection(menu.id)" class="w-full nav-section-header"
                  :class="{ 'nav-section-header-active': expandedSections[menu.id] }">
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-3">
                      <div class="nav-icon">
                        <svg v-if="!menu.icon.includes(':')" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="menu.icon" />
                        </svg>
                        <Icon v-else :name="menu.icon" class="w-5 h-5" />
                      </div>
                      <h3 class="nav-section-label">{{ menu.name }}</h3>
                    </div>
                    <svg class="w-4 h-4 transition-transform duration-200 text-white"
                      :class="{ 'rotate-180': expandedSections[menu.id] }" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <transition name="slide-down">
                  <div v-show="expandedSections[menu.id]" class="mt-2 space-y-1">
                    <NuxtLink v-for="submenu in menu.submenus" :key="submenu.name" :to="submenu.url" class="nav-item nav-item-nested"
                      :class="{ 'nav-item-active': $route.path === submenu.url }">
                      <div class="nav-icon">
                        <svg v-if="!submenu.icon.includes(':')" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="submenu.icon" />
                        </svg>
                        <Icon v-else :name="submenu.icon" class="w-5 h-5" />
                      </div>
                      <div class="flex-1">
                        <p class="nav-label">{{ submenu.name }}</p>
                        <p v-if="submenu.description" class="nav-description">{{ submenu.description }}</p>
                      </div>
                    </NuxtLink>
                  </div>
                </transition>
              </div> -->
            </template>
          </div>
        </nav>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { sidebarMenu } from '@/utils/sidebarConfig'

const route = useRoute()

// State
const mobileSidebarOpen = ref(false)

// Sections dépliables
const expandedSections = ref({})

// Initialiser expandedSections avec tous les IDs de menu
onMounted(() => {
  const sections = {}
  sidebarMenu.forEach(menu => {
    if (!menu.isSingle) {
      sections[menu.id] = false
    }
  })
  expandedSections.value = sections

  // Auto-expand basé sur la route actuelle
  autoExpandBasedOnRoute()
})

// Fonction pour basculer les sections
const toggleSection = (sectionId) => {
  expandedSections.value[sectionId] = !expandedSections.value[sectionId]
  // Sauvegarde l'état dans localStorage
  localStorage.setItem('sidebar-expanded-sections', JSON.stringify(expandedSections.value))
}

// Auto-expand basé sur la route actuelle
const autoExpandBasedOnRoute = () => {
  const path = route.path
  sidebarMenu.forEach(menu => {
    if (!menu.isSingle) {
      // Vérifier si la route actuelle correspond à un sous-menu
      const hasActiveSubmenu = menu.submenus?.some(submenu =>
        path.startsWith(submenu.url) || path === submenu.url
      )
      if (hasActiveSubmenu) {
        expandedSections.value[menu.id] = true
      }
    }
  })
}
</script>
