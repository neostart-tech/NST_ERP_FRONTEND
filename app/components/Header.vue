<template>
  <header class="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
    <div class="flex items-center space-x-4">
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <h1 class="text-md font-semibold text-gray-900">{{ pageTitle }}</h1>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Search bar -->
      <div class="hidden md:block relative">
        <input
          type="text"
          placeholder="Rechercher..."
          class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <!-- Notifications -->
      <button class="p-2 text-gray-400 hover:text-gray-600 relative">
        <Icon name="heroicons:bell" class="w-6 h-6" />
        <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
      </button>

      <!-- User menu -->
      <div class="relative">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center space-x-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
              <span>
                {{ useAuthStore().fullName.charAt(0).toLocaleUpperCase() || 'U' }}
              </span>
            </div>
          </div>
          <div class="text-left">
            <p class="text-sm font-medium text-gray-800">{{ useAuthStore().fullName || 'Utilisateur' }}</p>
            <p class="text-xs text-gray-500">{{ useAuthStore().user?.loggedInAt }}</p>
          </div>
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
          @click.stop
        >
          <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 12a5 5 0 015 5v2h-2a3 3 0 00-3-3 3 3 0 00-3 3h-2v-2a5 5 0 015-5z"/>
            </svg>
            <span>Profil</span>
          </a>
          <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Paramètres</span>
          </a>
          <div class="border-t border-gray-100"></div>
          <button
            @click="logout"
            class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()

const showUserMenu = ref(false)

const pageTitle = computed(() => {
  console.log("route.name:", route.name);
  
  const titleMap: Record<string, string> = {
    'dashboard': 'Tableau de bord',
    'clients': 'Gestion des Clients',
    'client-detail': 'Détail Client',
    'quotes': 'Devis',
    'orders': 'Commandes',
    'invoices': 'Factures',
    'suppliers': 'Fournisseurs',
    'entreprises': 'Entreprises',
    'entreprises-detail': 'Détail Entreprise',
    'entreprises-ajouter': 'Ajouter une entreprise',
    'entreprises-modifier': 'Modifier une entreprise'
  }
  return titleMap[route.name as string] || 'ERP Neo Start Technology'
})

const logout = () => {
  authStore.logout();
  showUserMenu.value = false
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>