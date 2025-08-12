<template>
  <main class="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header avec bouton retour -->
      <div class="relative mb-8">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl shadow-xl overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
            <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full"></div>
            <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
          </div>

          <div class="relative z-10 p-8">
            <div class="flex items-center gap-4 mb-6">
              <button 
                @click="$router.back()" 
                class="text-white hover:bg-sky-600 p-2 rounded-lg transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <h1 class="text-3xl font-bold text-white">Profil Utilisateur</h1>
            </div>

            <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
              <!-- Avatar -->
              <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold shadow-lg text-white">
                {{ getInitials(user?.first_name, user?.last_name) }}
              </div>

              <div class="flex-1">
                <h2 class="text-3xl font-bold mb-2 text-white">
                  {{ user?.first_name }} {{ user?.last_name }}
                </h2>
                <p class="text-sky-100 text-lg mb-3">{{ user?.login }}</p>
                <div class="flex flex-wrap gap-3">
                  <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                    {{ user?.role }}
                  </span>
                  <span class="px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                    Actif
                  </span>
                  <span v-if="user?.hired_year" class="px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                    Embauché en {{ user.hired_year }}
                  </span>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <button 
                  @click="$router.push(`/users/form?id=${user?.id}`)"
                  class="px-6 py-3 bg-white text-sky-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Modifier le profil
                </button>
                
                <button 
                  @click="adjustObjectives"
                  class="px-6 py-3 bg-green-500/80 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Ajuster objectifs
                </button>
                
                <button 
                  @click="resetPassword"
                  class="px-6 py-3 bg-purple-500/80 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-600 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  Réinitialiser mot de passe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p class="text-2xl font-bold text-gray-900">€{{ formatNumber(user?.turnover || 0) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Objectif</p>
              <p class="text-2xl font-bold text-gray-900">€{{ formatNumber(user?.target || 0) }}</p>
            </div>
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Commission</p>
              <p class="text-2xl font-bold text-gray-900">{{ user?.commission || 0 }}%</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Prime</p>
              <p class="text-2xl font-bold text-gray-900">€{{ formatNumber(user?.bonus || 0) }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Détails du profil -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Informations personnelles -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900">Informations Personnelles</h3>
          </div>
          <div class="p-8 space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Nom complet</span>
              <span class="font-semibold text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Login</span>
              <span class="font-semibold text-gray-900">{{ user?.login || '-' }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Email</span>
              <span class="font-semibold text-sky-600">{{ user?.email || '-' }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Téléphone</span>
              <span class="font-semibold text-gray-900">{{ user?.phone || '-' }}</span>
            </div>
            <div class="flex items-start justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Adresse</span>
              <span class="font-semibold text-gray-900 text-right">{{ user?.address || '-' }}</span>
            </div>
            <div class="flex items-center justify-between py-3">
              <span class="text-sm font-medium text-gray-600">Mot de passe modifié</span>
              <span 
                :class="user?.has_change_password ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-1 text-xs font-bold rounded-full"
              >
                {{ user?.has_change_password ? 'Oui' : 'Non' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Informations professionnelles -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900">Informations Professionnelles</h3>
          </div>
          <div class="p-8 space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Rôle</span>
              <span 
                :class="getRoleClass(user?.role)"
                class="px-3 py-1 text-sm font-bold rounded-full"
              >
                {{ user?.role }}
              </span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Année d'embauche</span>
              <span class="font-semibold text-gray-900">{{ user?.hired_year || '-' }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Commission</span>
              <span class="font-semibold text-green-600">{{ user?.commission || 0 }}%</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Prime actuelle</span>
              <span class="font-semibold text-green-600">€{{ formatNumber(user?.bonus || 0) }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600">Objectif</span>
              <span class="font-semibold text-sky-600">€{{ formatNumber(user?.target || 0) }}</span>
            </div>
            <div class="flex items-center justify-between py-3">
              <span class="text-sm font-medium text-gray-600">Chiffre d'affaires</span>
              <div class="text-right">
                <div class="font-semibold text-gray-900">€{{ formatNumber(user?.turnover || 0) }}</div>
                <div class="text-sm text-green-600" v-if="user?.target && user?.turnover">
                  {{ getProgressPercentage(user.turnover, user.target) }}% de l'objectif
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphique de progression -->
      <div v-if="user?.target && user?.turnover" class="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">Progression de l'objectif</h3>
        </div>
        <div class="p-8">
          <div class="mb-4 flex justify-between items-center">
            <span class="text-sm font-medium text-gray-600">Progression actuelle</span>
            <span class="text-sm font-bold text-sky-600">{{ getProgressPercentage(user.turnover, user.target) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              class="bg-gradient-to-r from-sky-600 to-sky-700 h-4 rounded-full shadow-inner transition-all duration-1000 ease-out"
              :style="{ width: `${Math.min(getProgressPercentage(user.turnover, user.target), 100)}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>€0</span>
            <span class="font-semibold text-sky-600">
              €{{ formatNumber(user.turnover) }} / €{{ formatNumber(user.target) }}
            </span>
            <span>€{{ formatNumber(user.target) }}</span>
          </div>
        </div>
      </div>

     
      
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

// État local
const user = ref(null)
const loading = ref(true)

// Récupérer l'ID de l'utilisateur depuis l'URL
const userId = computed(() => route.params.id || route.query.id)

// Charger les données de l'utilisateur
onMounted(async () => {
  try {
    loading.value = true
    // Si vous avez une méthode pour récupérer un utilisateur spécifique
    if (userStore.fetchUser) {
      user.value = await userStore.fetchUser(userId.value)
    } else {
      // Sinon, chercher dans la liste des utilisateurs
      await userStore.fetchUsers()
      user.value = userStore.users?.users?.find(u => u.id == userId.value)
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'utilisateur:', error)
  } finally {
    loading.value = false
  }
})

// Méthodes utilitaires
const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) return '??'
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

const formatNumber = (number) => {
  if (!number) return '0'
  return new Intl.NumberFormat('fr-FR').format(number)
}

const getProgressPercentage = (current, target) => {
  if (!current || !target) return 0
  return Math.round((current / target) * 100)
}

const getRoleClass = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800'
    case 'commercial':
      return 'bg-sky-100 text-sky-800'
    case 'user':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Méthodes d'action
const adjustObjectives = () => {
  // Logique pour ajuster les objectifs
  console.log('Ajuster les objectifs pour l\'utilisateur:', user.value?.id)
  // Vous pouvez ouvrir un modal ou naviguer vers une page spécifique
}

const resetPassword = () => {
  // Logique pour réinitialiser le mot de passe
  console.log('Réinitialiser le mot de passe pour l\'utilisateur:', user.value?.id)
  // Appel API pour réinitialiser le mot de passe
}

// Metadata de la page
useHead({
  title: computed(() => user.value ? `Profil - ${user.value.first_name} ${user.value.last_name}` : 'Profil Utilisateur'),
  meta: [
    {
      name: 'description',
      content: 'Page de profil utilisateur avec informations personnelles et professionnelles'
    }
  ]
})
</script>

<style scoped>
/* Animations personnalisées */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover .group-hover\:inline {
  animation: slideInUp 0.2s ease-out;
}
</style>