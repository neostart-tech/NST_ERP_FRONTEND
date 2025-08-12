<template>
  
    <main class="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <div class="relative mb-8">
          <div
            class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden"
          >
            <div class="absolute inset-0 opacity-10">
              <div class="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
              <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full"></div>
              <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
            </div>

            <div class="relative z-10">
              <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 class="text-3xl font-bold mb-2">Gestion des Utilisateurs</h1>
                  <p class="text-sky-100 text-lg">Gérez les comptes utilisateurs et leurs rôles</p>
                  <div class="flex items-center gap-6 mt-4 text-sm">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span class="text-sky-100"> Actifs</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span class="text-sky-100"> Inactifs</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                  <NuxtLink
                    to="/users/form"
                    class="group px-6 py-3 bg-white text-sky-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
                  >
                    <div
                      class="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center group-hover:bg-sky-200 transition-colors"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    Nouvel Utilisateur
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <div
            class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                <p v-if="userStore.users">Nombre d'utilisateurs </p>

              </div>
              <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Administrateurs</p>
                <p class="text-3xl font-bold text-gray-900"></p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.92 12c0 3.072 1.547 5.726 3.999 7.356A11.942 11.942 0 0012 21c3.064 0 5.618-1.547 7.08-3.999.314-.497.589-1.01.82-1.542.42-1.002.66-2.072.72-3.176.06-.576.06-1.16.06-1.751 0-4.635-3.53-8.406-8.24-8.912z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Liste des utilisateurs</h2>
            
              </div>

              <div class="relative">
                <input
                
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  class="w-full sm:w-80 pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 text-gray-700 bg-white"
                />
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Téléphone</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
             <tbody class="bg-white divide-y divide-gray-100">
   

    <tr 
      v-for="user in userStore.users.users" 
      :key="user.id"
      class="hover:bg-gray-50 transition-colors"
    >
      <!-- Avatar avec initiales -->
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          
          <div class="ml-4">
            <div class="font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
            <div class="text-gray-500 text-sm">{{ user.login }}</div>
          </div>
        </div>
      </td>

      <!-- Email -->
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">
        {{ user.email }}
      </td>

      <!-- Téléphone -->
      <td class="px-6 py-4 whitespace-nowrap text-gray-500">
        {{ user.phone || '-' }}
      </td>

     
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 py-1 rounded-full text-xs font-bold" >
          {{ user.role }}
        </span>
      </td>

      
      

      <!-- Actions -->
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <button
  @click="$router.push(`/users/${user.id}`)"
  class="text-sky-600 hover:text-sky-900 mr-3"
>
  Voir
</button>
  <button
    @click="$router.push(`/users/form?id=${user.id}`)"
    class="text-sky-600 hover:text-sky-900 mr-3"
  >
    Modifier
  </button> 
  <button
    @click="deleteUser(user.id)"
    class="text-red-600 hover:text-red-900"
  >
    Supprimer
  </button>
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
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// Liste des utilisateurs


// Charger les utilisateurs une fois le composant monté
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
</style>