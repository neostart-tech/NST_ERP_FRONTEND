<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<!-- Carte Total Utilisateurs -->
			<div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Utilisateurs</p>
						<p class="text-3xl font-bold text-gray-900">{{ kpis.totalUsers }}</p>
					</div>
					<div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:user-group" class="w-6 h-6 text-sky-600" />
					</div>
				</div>
			</div>

			<!-- Carte Administrateurs -->
			<div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Administrateurs</p>
						<p class="text-3xl font-bold text-purple-600">{{ kpis.adminCount }}</p>
					</div>
					<div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:shield-check" class="w-6 h-6 text-purple-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- En-tête avec recherche et actions -->
		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-2xl font-bold text-gray-900">Liste des utilisateurs</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input v-model="searchTerm" type="text" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400" />
				</div>

				<!-- Bouton Nouveau -->
				<NuxtLink to="/users/form"
					class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
					<Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
					Nouvel utilisateur
				</NuxtLink>
			</div>
		</div>

		<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
		<div class="hidden lg:block bg-white border p-4 rounded-lg shadow mt-6">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Nom
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Téléphone
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Rôle
							</th>
							<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="user in paginatedUsers" :key="user.id + '-table'"
							class="hover:bg-gray-50 transition-colors duration-150">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
								<div class="text-sm text-gray-500">{{ user.login }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ user.email }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ user.phone || '-' }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
									:class="roleClass(user.role)">
									{{ user.role }}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button @click="viewUser(user.id)" class="text-gray-600 hover:text-gray-900 mr-3" title="Voir les détails">
									<Icon name="heroicons:eye" class="w-5 h-5" />
								</button>
								<button @click="editUser(user.id)" class="text-blue-600 hover:text-blue-900 mr-3" title="Modifier">
									<Icon name="heroicons:pencil-square" class="w-5 h-5" />
								</button>
								<button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900" title="Supprimer">
									<Icon name="heroicons:trash" class="w-5 h-5" />
								</button>
							</td>
						</tr>
						<tr v-if="filteredUsers.length === 0">
							<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
								<EmptyState title="Aucun utilisateur trouvé" :description="noDataDescription"
									icon="heroicons:user-group" iconColor="text-indigo-400" @reload="loadUsers"
									:isLoading="loading" :searchQuery="searchTerm" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
		<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<template v-if="filteredUsers.length > 0">
				<div v-for="user in paginatedUsers" :key="user.id + '-card'"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
					<div class="p-4">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">
									{{ user.first_name }} {{ user.last_name }}
								</h3>
								<p class="text-sm text-gray-500 mb-2">{{ user.login }}</p>
								<div class="mt-2 space-y-2">
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:envelope" class="w-4 h-4 mr-2 text-gray-400" />
										<span>{{ user.email || 'Non renseigné' }}</span>
									</div>
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:phone" class="w-4 h-4 mr-2 text-gray-400" />
										<span>{{ user.phone || 'Non renseigné' }}</span>
									</div>
									<div class="flex items-center">
										<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
											:class="roleClass(user.role)">
											{{ user.role }}
										</span>
									</div>
								</div>
							</div>
						</div>
						<div class="flex justify-end mt-4 space-x-2">
							<button @click.stop="viewUser(user.id)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
								title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5" />
							</button>
							<button @click.stop="editUser(user.id)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
								title="Modifier">
								<Icon name="heroicons:pencil-square" class="w-5 h-5" />
							</button>
							<button @click.stop="deleteUser(user.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
								title="Supprimer">
								<Icon name="heroicons:trash" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="col-span-full">
					<EmptyState title="Aucun utilisateur trouvé" :description="noDataDescription"
						icon="heroicons:user-group" iconColor="text-indigo-400" @reload="loadUsers" :isLoading="loading"
						:searchQuery="searchTerm" />
				</div>
			</template>
		</div>

		<Paginator :totalItems="filteredUsers.length" @range-changed="onRangeChanged" />
	</div>
</template>

<script setup>
import { onMounted, computed, reactive, ref } from 'vue'
import { useUserStore } from '~/app/stores/_user'
import { useRouter } from 'vue-router'
import Paginator from '~/app/components/Paginator.vue'
import EmptyState from '~/app/components/EmptyState.vue'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')
const noDataDescription = ref("Il n'y a actuellement aucun utilisateur à afficher.")

const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }) => {
  range.start = start
  range.end = end
}

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
  if (!searchTerm.value) {
    noDataDescription.value = "Il n'y a actuellement aucun utilisateur à afficher."
    return userStore.users
  }

  noDataDescription.value = ""
  const term = searchTerm.value.toLowerCase()
  return userStore.users.filter(user =>
    user.first_name?.toLowerCase().includes(term) ||
    user.last_name?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term) ||
    user.login?.toLowerCase().includes(term) ||
    user.role?.toLowerCase().includes(term)
  )
})

// Utilisateurs paginés
const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(range.start - 1, range.end)
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
  Swal.fire({
    title: 'Supprimer l\'utilisateur ?',
    text: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
    icon: 'question',
    showCancelButton: true,
    cancelButtonText: 'Annuler',
    cancelButtonColor: '#3085d6',
    confirmButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer !'
  }).then(async result => {
    if (result.isConfirmed) {
      try {
        await userStore.deleteUser(userId)
        Swal.fire({ icon: 'success', title: 'Succès', text: 'Utilisateur supprimé avec succès', timer: 2000, showConfirmButton: false })
        await userStore.fetchUsers()
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer l\'utilisateur' })
      }
    }
  })
}

// Charger les données au montage
onMounted(() => {
  loadUsers()
})
</script>