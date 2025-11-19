<template>
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
	<!-- Statistiques -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
		<!-- Carte Nombre total d'utilisateurs -->
		<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
			<div class="flex items-center">
				<div class="p-3 rounded-full bg-blue-50">
					<Icon name="heroicons:users" class="h-6 w-6 text-blue-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Total Utilisateurs</p>
					<h3 class="text-2xl font-semibold text-gray-900">{{ users.length }}</h3>
				</div>
			</div>
		</div>

		<!-- Carte Utilisateurs actifs -->
		<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
			<div class="flex items-center">
				<div class="p-3 rounded-full bg-green-50">
					<Icon name="heroicons:check-circle" class="h-6 w-6 text-green-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Utilisateurs actifs</p>
					<h3 class="text-2xl font-semibold text-gray-900">
						{{ users.filter(u => u.hasConfirmedPassword).length }}
						<span class="text-sm font-normal text-gray-500">
							({{ users.length ? Math.round((users.filter(u => u.hasConfirmedPassword).length / users.length) * 100) : 0 }}%)
						</span>
					</h3>
				</div>
			</div>
		</div>

		<!-- Carte Rôles -->
		<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
			<div class="flex items-center">
				<div class="p-3 rounded-full bg-purple-50">
					<Icon name="heroicons:user-group" class="h-6 w-6 text-purple-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Rôles uniques</p>
					<h3 class="text-2xl font-semibold text-gray-900">
						{{ new Set(users.map(u => u.role).filter(Boolean)).size }}
					</h3>
				</div>
			</div>
		</div>

		<!-- Carte Nouveaux (7 derniers jours) -->
		<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
			<div class="flex items-center">
				<div class="p-3 rounded-full bg-amber-50">
					<Icon name="heroicons:clock" class="h-6 w-6 text-amber-600" />
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Nouveaux (7j)</p>
					<h3 class="text-2xl font-semibold text-gray-900">
						{{ users.filter(u => {
							const userDate = new Date(u.createdAt);
							const weekAgo = new Date();
							weekAgo.setDate(weekAgo.getDate() - 7);
							return userDate >= weekAgo;
						}).length }}
					</h3>
				</div>
			</div>
		</div>
	</div>

	<div class="mb-6">
		<!-- Conteneur principal -->
		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
			<!-- Titre à gauche -->
			<h1 class="text-2xl font-bold text-gray-900 flex-shrink-0">Utilisateurs</h1>

			<!-- Conteneur droite (recherche + bouton) -->
			<div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
				<!-- Champ de recherche -->
				<div class="relative flex-grow">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input type="text" v-model="searchQuery" placeholder="Rechercher un utilisateur..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
				</div>

				<!-- Bouton Ajouter -->
				<NuxtLink :to="AppUrl.USERS_ADD"
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
					Ajouter un utilisateur
				</NuxtLink>
			</div>
		</div>
	</div>

	<Loader v-if="isLoading" message="Chargement des utilisateurs..." />
	<EmptyState v-else-if="filteredUsers.length === 0" title="Aucun utilisateur trouvé" :description="noDataDescription"
		icon="heroicons:user-group" iconColor="text-indigo-400" @reload="fetchUsers" :isLoading="isLoading"
		:searchQuery="searchQuery" />

	<template v-else>
		<!-- Version mobile/tablette (card) -->
		<div class="lg:hidden grid gap-4">
			<div v-for="user in paginatedUsers" :key="user.id" class="user-card bg-white rounded-lg shadow p-4">
				<div class="flex justify-between items-start">
					<div>
						<h3 class="font-semibold text-lg">{{ user.firstName }} {{ user.lastName }}</h3>
						<p class="text-gray-600">{{ user.email }}</p>
					</div>
					<span :class="['status-badge', user.hasConfirmedPassword ? 'active' : 'inactive']">
						{{ user.hasConfirmedPassword ? 'Confirmé' : 'Non conf.' }}
					</span>
				</div>

				<div class="mt-3 text-sm">
					<p v-if="user.role" class="text-gray-700">
						<span class="font-medium">Rôle:</span> {{ user.role }}
					</p>
					<p class="text-gray-700">
						<span class="font-medium">Inscrit le:</span>
						{{ new Date(user.createdAt).toLocaleDateString() }}
					</p>
				</div>

				<div class="mt-4 flex justify-end space-x-2">
					<button class="action-btn view">
						<Icon name="heroicons:eye" class="h-5 w-5" />
					</button>
					<button class="action-btn edit">
						<Icon name="heroicons:pencil" class="h-5 w-5" />
					</button>
					<button v-if="user.id !== currentUser!.id" class="action-btn delete">
						<Icon name="heroicons:trash" class="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>

		<!-- Version desktop (table) -->
		<div class="hidden lg:block overflow-x-auto">
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
							Rôle
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Statut
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Inscription
						</th>
						<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="user in paginatedUsers" :key="user.id">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								<div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
									<span class="text-indigo-600 font-medium uppercase">
										{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
									</span>
								</div>
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900">
										{{ user.firstName }} {{ user.lastName }}
									</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ user.email }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ user.role || '-' }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span :class="['status-badge', user.hasConfirmedPassword ? 'active' : 'inactive']">
								{{ user.hasConfirmedPassword ? 'Actif' : 'Inactif' }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ new Date(user.createdAt).toLocaleDateString() }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<div class="flex justify-end space-x-2">
								<button class="action-btn view">
									<Icon name="heroicons:eye" class="h-5 w-5" />
									<span class="sr-only">Voir</span>
								</button>
								<button class="action-btn edit">
									<Icon name="heroicons:pencil" class="h-5 w-5" />
									<span class="sr-only">Modifier</span>
								</button>
								<button class="action-btn delete">
									<Icon name="heroicons:trash" class="h-5 w-5" />
									<span class="sr-only">Supprimer</span>
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<Paginator :totalItems="filteredUsers.length" @range-changed="onRangeChanged" />
	</template>
</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from "~/app/stores/UserStore";
import EmptyState from "~/app/components/EmptyState.vue";
import { AppUrl } from "~/app/composables/appUrl";
import Paginator from "~/app/components/Paginator.vue";
import Loader from '~/app/components/Loader.vue';
import { useAuthStore } from '~/app/stores/AuthStore';

const { users, isLoading } = storeToRefs(useUserStore());
const { user: currentUser } = storeToRefs(useAuthStore());
const userStore = useUserStore();
const fetchUsers = userStore.fetchUsers;
const searchQuery = ref<string>("");
const noDataDescription = ref<string>("Il n'y a actuellement aucun utilisateur à afficher.");

const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

onMounted(() => {
	fetchUsers();
});

// Filtrage côté client
const filteredUsers = computed(() => {
	if (!searchQuery.value) {
		return users.value
	}

	noDataDescription.value = ""
	return users.value.filter(user =>
		user.firstName.toLowerCase().includes(searchQuery.value) ||
		user.lastName.toLowerCase().includes(searchQuery.value) ||
		user.email.toLowerCase().includes(searchQuery.value) ||
		(user.role && user.role.toLowerCase().includes(searchQuery.value))
	)
});

const paginatedUsers = computed(() => {
	return filteredUsers.value.slice(range.start - 1, range.end)
});

</script>
