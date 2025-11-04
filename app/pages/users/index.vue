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
    <span class="text-sky-100">{{ kpis.activeUsers }} Actifs</span>
  </div>
  <div class="flex items-center gap-2">
    <div class="w-2 h-2 bg-red-400 rounded-full"></div>
    <span class="text-sky-100">0 Inactifs</span>
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
  <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">Total Utilisateurs</p>
        <p class="text-3xl font-bold text-gray-900">{{ kpis.totalUsers }}</p>
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
        <p class="text-sm font-medium text-gray-600">Administrateurs</p>
        <p class="text-3xl font-bold text-gray-900">{{ kpis.adminCount }}</p>
      </div>
      <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.92 12c0 3.072 1.547 5.726 3.999 7.356A11.942 11.942 0 0012 21c3.064 0 5.618-1.547 7.08-3.999.314-.497.589-1.01.82-1.542.42-1.002.66-2.072.72-3.176.06-.576.06-1.16.06-1.751 0-4.635-3.53-8.406-8.24-8.912z"/>
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
                <p class="text-gray-600 text-sm mt-1">{{ userStore.users.length }} utilisateur(s)</p>
              </div>

              <div class="relative">
                <input
                  v-model="searchTerm"
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
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
             <tbody class="bg-white divide-y divide-gray-100">
    <tr 
      v-for="user in filteredUsers" 
      :key="user.id"
      class="hover:bg-gray-50 transition-colors"
    >
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="ml-4">
            <div class="font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
            <div class="text-gray-500 text-sm">{{ user.login }}</div>
          </div>
        </div>
      </td>

      <td class="px-6 py-4 whitespace-nowrap text-gray-500">
        {{ user.email }}
      </td>

      <td class="px-6 py-4 whitespace-nowrap text-gray-500">
        {{ user.phone || '-' }}
      </td>

      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 py-1 rounded-full text-xs font-bold" :class="roleClass(user.role)">
          {{ user.role }}
        </span>
      </td>

      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
          Actif
        </span>
      </td>

      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex items-center gap-2">
          <button
            @click="viewUser(user.id)"
            class="text-sky-600 hover:text-sky-900 p-1 rounded"
            title="Voir détails"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>

          <button
            @click="editUser(user.id)"
            class="text-indigo-600 hover:text-indigo-900 p-1 rounded"
            title="Modifier"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.232z"/>
            </svg>
          </button>

          <button
            @click="deleteUser(user.id)"
            class="text-red-600 hover:text-red-900 p-1 rounded"
            title="Supprimer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>

    <tr v-if="userStore.users.length === 0 && !userStore.loading">
      <td colspan="6" class="px-6 py-12 text-center">
        <div class="flex flex-col items-center justify-center">
          <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
          </svg>
          <p class="text-gray-500 text-lg font-medium">Aucun utilisateur trouvé</p>
          <p class="text-gray-400 text-sm mt-1">Commencez par créer votre premier utilisateur</p>
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
import { onMounted, computed, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')

// KPIs réactifs
const kpis = reactive({
  totalUsers: computed(() => userStore.users?.length || 0),
  adminCount: computed(() => {
    if (!userStore.users) return 0
    return userStore.users.filter(user => 
      user.role?.toLowerCase().includes('admin')
    ).length
  }),
  activeUsers: computed(() => {
    if (!userStore.users) return 0
    return userStore.users.length
  })
})
 
// Filtrage des utilisateurs
const filteredUsers = computed(() => {
  if (!userStore.users) return []
  if (!searchTerm.value) return userStore.users
  
  const term = searchTerm.value.toLowerCase()
  return userStore.users.filter(user => 
    user.first_name?.toLowerCase().includes(term) ||
    user.last_name?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term) ||
    user.login?.toLowerCase().includes(term) ||
    user.role?.toLowerCase().includes(term)
  )
})

// Classes pour les rôles
const roleClass = (role) => {
  switch (role) {
    case 'Admin': return 'bg-purple-100 text-purple-800'
    case 'Commercial': return 'bg-blue-100 text-blue-800'
    case 'Responsable Recouvrement': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Charger les utilisateurs avec gestion d'erreur
const loadUsers = async () => {
  loading.value = true
  error.value = null
  try {
    await userStore.fetchUsers()
  } catch (err) {
    error.value = 'Erreur lors du chargement des utilisateurs'
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

// Fonction pour voir un utilisateur
const viewUser = (userId) => {
  router.push(`/users/${userId}`)
}

// Fonction pour éditer un utilisateur
const editUser = (userId) => {
  router.push(`/users/edit/${userId}`)
}

// Fonction pour supprimer un utilisateur
const deleteUser = async (userId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
    try {
      await userStore.deleteUser(userId)
      alert('Utilisateur supprimé avec succès')
    } catch (error) {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }
}

// Charger les données au montage
onMounted(() => {
  loadUsers()
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