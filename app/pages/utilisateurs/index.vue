<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" role="main">
		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Carte Nombre total d'utilisateurs -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Utilisateurs</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ users.length }}</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:users" class="w-6 h-6 text-white"/>
					</div>
				</div>
			</div>

			<!-- Carte Utilisateurs actifs -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-green-900">Utilisateurs actifs</p>
						<p class="text-3xl font-bold text-green-900 mt-2">
							{{ users.filter((u) => u.hasConfirmedPassword).length }}
							<span class="text-sm font-normal">
								({{
									users.length ? Math.round((users.filter((u) => u.hasConfirmedPassword).length / users.length) * 100)
										: 0
								}}%)
							</span>
						</p>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<Icon name="heroicons:check-circle" class="w-6 h-6 text-white"/>
					</div>
				</div>
			</div>

			<!-- Carte Rôles -->
			<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-purple-900">Rôles uniques</p>
						<p class="text-3xl font-bold text-purple-900 mt-2">
							{{ new Set(users.map((u) => u.role).filter(Boolean)).size }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-purple-500">
						<Icon name="heroicons:user-group" class="w-6 h-6 text-white"/>
					</div>
				</div>
			</div>

			<!-- Carte Nouveaux (7 derniers jours) -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-amber-900">Nouveaux (7j)</p>
						<p class="text-3xl font-bold text-amber-900 mt-2">
							{{
								users.filter(u => {
									const userDate = new Date(u.createdAt);
									const weekAgo = new Date();
									weekAgo.setDate(weekAgo.getDate() - 7);
									return userDate >= weekAgo;
								}).length
							}}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:clock" class="w-6 h-6 text-white"/>
					</div>
				</div>
			</div>
		</div>

		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-xl font-bold text-gray-900">Liste des utilisateurs</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400"/>
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher..."
								 class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"/>
				</div>

				<!-- Bouton d'action -->
				<NuxtLink :to="AppUrl.USERS_ADD"
									class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2"/>
					Nouvel utilisateur
				</NuxtLink>
			</div>
		</div>

		<Loader v-if="isLoading" message="Chargement des utilisateurs..."/>
		<EmptyState v-else-if="filteredUsers.length === 0" title="Aucun utilisateur trouvé" :description="noDataDescription"
								icon="heroicons:user-group" iconColor="text-indigo-400" @reload="fetchUsers" :isLoading="isLoading"
								:searchQuery="searchQuery"/>

		<template v-else>
			<!-- Version mobile/tablette (card) -->
			<div class="lg:hidden grid gap-4">
				<div v-for="user in paginatedUsers" :key="user.id" class="user-card bg-white rounded-lg shadow p-4">
					<div class="flex justify-between items-start">
						<div>
							<h3 class="font-semibold text-lg">
								{{ user.firstName }} {{ user.lastName }}
							</h3>
							<p class="text-gray-600">{{ user.email }}</p>
						</div>
						<span :class="[
							'status-badge',
							user.hasConfirmedPassword ? 'active' : 'inactive',
						]">
							{{ user.hasConfirmedPassword ? "Confirmé" : "Non conf." }}
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
						<NuxtLink class="action-btn view">
							<Icon name="heroicons:eye" class="h-5 w-5"/>
						</NuxtLink>
						<NuxtLink class="action-btn edit" :to="AppUrl.parameterize(AppUrl.USERS_EDIT, user.id)">
							<Icon name="heroicons:pencil" class="h-5 w-5"/>
						</NuxtLink>
						<button @click="deleteUser(user)" class="action-btn delete">
							<Icon name="heroicons:trash" class="h-5 w-5"/>
						</button>
					</div>
				</div>
			</div>

			<!-- Version desktop (table) -->
			<div class="hidden lg:block overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gradient-to-r from-blue-50 to-blue-100">
					<tr>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Nom
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Email
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Rôle
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Statut
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
							Inscription
						</th>
						<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
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
											{{
												user.firstName.charAt(0)
											}}{{ user.lastName.charAt(0) }}
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
							{{ user.role || "-" }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
								<span :class="[
									'status-badge',
									user.hasConfirmedPassword ? 'active' : 'inactive',
								]">
									{{ user.hasConfirmedPassword ? "Actif" : "Inactif" }}
								</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ new Date(user.createdAt).toLocaleDateString() }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<div class="flex justify-end space-x-2">
								<button class="action-btn view">
									<Icon name="heroicons:eye" class="h-5 w-5"/>
									<span class="sr-only">Voir</span>
								</button>
								<NuxtLink class="action-btn edit" :to="AppUrl.parameterize(AppUrl.USERS_EDIT, user.id)" title="Modifier">
									<Icon name="heroicons:pencil" class="h-5 w-5"/>
									<span class="sr-only">Modifier</span>
								</NuxtLink>
								<button class="action-btn delete" @click="deleteUser(user)">
									<Icon name="heroicons:trash" class="h-5 w-5"/>
									<span class="sr-only">Supprimer</span>
								</button>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<Paginator :totalItems="filteredUsers.length" @range-changed="onRangeChanged"/>
		</template>
	</div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useUserStore} from "@/stores/UserStore";
import EmptyState from "@/components/EmptyState.vue";
import {AppUrl} from "@/composables/appUrl";
import Paginator from "@/components/Paginator.vue";
import Loader from "~/app/components/Loader.vue";
import Swal from "sweetalert2";
import type {User} from "~/models/User";

const userStore = useUserStore();
const {users, isLoading} = storeToRefs(userStore);
const {user: currentUser} = storeToRefs(useAuthStore());
const fetchUsers = userStore.fetchAll;
const searchQuery = ref<string>("");
const noDataDescription = ref<string>(
	"Il n'y a actuellement aucun utilisateur à afficher."
);

const range = reactive({start: 0, end: 0});

const onRangeChanged = ({start, end}: { start: number; end: number }) => {
	range.start = start;
	range.end = end;
};

onMounted(() => {
	fetchUsers();
});

// Filtrage côté client
const filteredUsers = computed(() => {
	if (!searchQuery.value) {
		return users.value;
	}

	noDataDescription.value = "";
	return users.value.filter(
		(user) =>
			user.firstName.toLowerCase().includes(searchQuery.value) ||
			user.lastName.toLowerCase().includes(searchQuery.value) ||
			user.email.toLowerCase().includes(searchQuery.value) ||
			(user.role && user.role.toLowerCase().includes(searchQuery.value))
	);
});

const paginatedUsers = computed(() => {
	return filteredUsers.value.slice(range.start - 1, range.end);
});

const deleteUser = async (user: User) => {
	if (user.id === currentUser!.value?.id) {
		useAlert().showAlert("Vous ne pouvez pas supprimer votre propre compte", "error");
		return;
	}
	Swal.fire({
		title: "Supprimer l'utilisateur",
		html: `Êtes-vous sûr de vouloir supprimer l'utilisateur <b>${user.firstName} ${user.lastName}</b> ?`,
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Oui, supprimer",
		cancelButtonText: "Annuler",
	}).then(async (result) => {
		if (result.isConfirmed) {
			try {
				await userStore.delete(user.id);
				Swal.fire({
					title: "Utilisateur supprimé",
					icon: "success",
				});
			} catch (error) {
				Swal.fire({
					title: "Erreur",
					text: "Une erreur est survenue lors de la suppression de l'utilisateur",
					icon: "error",
				});
			}
		}
	});
};
</script>
