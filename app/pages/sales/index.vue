<template>
  <main class="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden">
    <div class="max-w-7xl mx-auto w-full overflow-hidden">
      <!-- Header avec gradient et actions -->
      <div class="relative mb-8">
        <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden">
          <!-- Motif de fond décoratif -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
            <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full"></div>
            <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
          </div>
          
          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 class="text-3xl font-bold mb-2">Gestion des Commerciaux</h1>
                <p class="text-sky-100 text-lg">Gérez votre équipe commerciale et suivez leurs performances</p>
                <div class="flex items-center gap-6 mt-4 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span class="text-sky-100">{{ commercials.length }} Commerciaux</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-sky-300 rounded-full"></div>
                    <span class="text-sky-100">Total: {{ userStore.users?.users?.length || 0 }} Utilisateurs</span>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3">
                <NuxtLink 
                  to="/users/form" 
                  class="group px-6 py-3 bg-white text-sky-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
                >
                  <div class="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  Nouveau Commercial
                </NuxtLink>
                
                <NuxtLink 
                  to="/sales/commissions" 
                  class="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                  Commissions
                </NuxtLink>
                
                <NuxtLink 
                  to="/sales/bonuses" 
                  class="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Primes
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Commerciaux</p>
              <p class="text-3xl font-bold text-gray-900">{{ commercials.length }}</p>
            </div>
            <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Commerciaux Actifs</p>
              <p class="text-3xl font-bold text-gray-900">{{ commercials.length }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
              <p class="text-3xl font-bold text-gray-900">{{ newThisMonth }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Taux de Performance</p>
              <p class="text-3xl font-bold text-gray-900">95%</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des commerciaux -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Header du tableau -->
        <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Équipe Commerciale</h2>
              <p class="text-gray-600 text-sm mt-1">{{ filteredCommercials.length }} commercial(aux) affiché(s)</p>
            </div>
            
            <div class="relative">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Rechercher un commercial..."
                class="w-full sm:w-80 pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-gray-700 bg-white"
              />
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tableau -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 max-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Commercial</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Téléphone</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Login</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Statut</th>
                <th class="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr 
                v-for="commercial in filteredCommercials" 
                :key="commercial.id" 
                class="hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 transition-all duration-300"
              >
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 relative">
                      <!-- Avatar avec initiales -->
                      <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold shadow border-2 border-white">
                        {{ getInitials(commercial.first_name, commercial.last_name) }}
                      </div>
                      <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                        {{ commercial.first_name }} {{ commercial.last_name }}
                      </div>
                      <div class="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[150px]">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        {{ commercial.role }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-xs sm:text-sm text-gray-900">{{ commercial.email }}</div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-xs sm:text-sm text-gray-900">{{ commercial.phone || '-' }}</div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-xs sm:text-sm font-medium text-gray-600">{{ commercial.login }}</div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xxs leading-4 font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                    Actif
                  </span>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-xs font-medium">
                  <div class="flex items-center gap-1">
                    <button 
                     @click="$router.push(`/users/${user.id}`)"
                      class="p-1.5 text-sky-600 hover:text-white hover:bg-sky-600 rounded-md transition-all duration-200"
                      title="Voir"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    <button 
                      @click="$router.push(`/users/form?id=${commercial.id}`)"
                      class="p-1.5 text-sky-600 hover:text-white hover:bg-sky-600 rounded-md transition-all duration-200"
                      title="Modifier"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.232z"/>
                      </svg>
                    </button>
                    <button 
                      @click="confirmDelete(commercial.id)" 
                      class="p-1.5 text-red-600 hover:text-white hover:bg-red-600 rounded-md transition-all duration-200"
                      title="Supprimer"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCommercials.length === 0">
                <td colspan="6" class="px-4 py-8 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <svg class="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <p class="text-gray-500 text-sm font-medium">Aucun commercial trouvé</p>
                    <p class="text-gray-400 text-xs mt-1">Essayez de modifier vos critères de recherche</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const searchTerm = ref('')

// Computed pour filtrer uniquement les commerciaux
const commercials = computed(() => {
  if (!userStore.users?.users) return []
  return userStore.users.users.filter(user => 
    user.role.toLowerCase() === 'commercial'
  )
})

// Filtrage avec recherche
const filteredCommercials = computed(() => {
  if (!searchTerm.value) return commercials.value
  
  const term = searchTerm.value.toLowerCase()
  return commercials.value.filter(commercial => 
    commercial.first_name.toLowerCase().includes(term) || 
    commercial.last_name.toLowerCase().includes(term) ||
    commercial.email.toLowerCase().includes(term) ||
    commercial.login.toLowerCase().includes(term) ||
    (commercial.phone && commercial.phone.toLowerCase().includes(term))
  )
})

// Statistique des nouveaux commerciaux ce mois
const newThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return commercials.value.filter(commercial => {
    const createdDate = new Date(commercial.created_at)
    return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear
  }).length
})

// Fonction pour obtenir les initiales
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}

// Confirmation de suppression
const confirmDelete = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce commercial ? Cette action est irréversible.')) {
    // Ici vous pouvez appeler la méthode de suppression du store
    userStore.deleteUser(id)
    alert(`Commercial supprimé`)
  }
}

// Charger les utilisateurs au montage du composant
onMounted(() => {
  userStore.fetchUsers()
})
</script>

<style scoped>
/* Animation pour les cartes de statistiques */
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

/* Effet de survol pour les lignes du tableau */
.group:hover {
  box-shadow: 0 4px 15px -4px rgba(59, 130, 246, 0.15);
}

/* Style pour les boutons d'action */
.group:hover .group-hover\:bg-sky-600,
.group:hover .group-hover\:bg-red-600,
.group:hover .group-hover\:bg-gray-600 {
  transform: scale(1.05);
}

@media (max-width: 640px) {
  table {
    display: block;
    width: 100%;
  }
  thead, tbody, tr, th, td {
    display: block;
  }
  tr {
    margin-bottom: 1rem;
  }
}
</style>