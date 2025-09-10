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

              <!-- Menu avec sous-menus -->
              <div v-else class="nav-section">
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
              </div>
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