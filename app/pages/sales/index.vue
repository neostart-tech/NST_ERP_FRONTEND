<template>
	<main
		class="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-x-hidden"
	>
		<div class="max-w-7xl mx-auto w-full overflow-hidden">
			<!-- Header avec gradient et actions -->
			<div class="relative mb-4">
				<div
					class="bg-gradient-to-r from-sky-600 to-sky-700 rounded-lg shadow p-4 text-white overflow-hidden"
				>
					<!-- Motif de fond décoratif simplifié -->
					<div class="absolute inset-0 opacity-5">
						<div class="absolute -top-8 -right-8 w-20 h-20 bg-white rounded-full"></div>
					</div>

					<div class="relative z-10">
						<div class="flex items-center justify-between">
							<div>
								<h1 class="text-xl font-bold">Gestion des Commerciaux</h1>
								<div class="flex items-center gap-3 mt-1 text-xs">
									<div class="flex items-center gap-1">
										<div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
										<span class="text-sky-100 font-medium">
											{{ commercials.length }} Commerciaux
										</span>
									</div>
									<div class="flex items-center gap-1">
										<div class="w-1.5 h-1.5 bg-sky-300 rounded-full"></div>
										<span class="text-sky-100 font-medium">
											{{ userStore.users?.users?.length || 0 }} Utilisateurs
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Statistiques rapides -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div
					class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Total Commerciaux</p>
							<p class="text-3xl font-bold text-gray-900">
								{{ commercials.length }}
							</p>
						</div>
						<div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
							<Icon name="heroicons:user-group" class="w-6 h-6 text-sky-600" />
						</div>
					</div>
				</div>

				<div
					class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">
								Commerciaux Actifs
							</p>
							<p class="text-3xl font-bold text-gray-900">
								{{ commercials.length }}
							</p>
						</div>
						<div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
							<Icon name="heroicons:clock" class="w-6 h-6 text-amber-600" />
						</div>
					</div>
				</div>

				<div
					class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
							<p class="text-3xl font-bold text-gray-900">{{ newThisMonth }}</p>
						</div>
						<div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
							<Icon name="heroicons:user-plus" class="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div
					class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">
								Taux de Performance
							</p>
							<p class="text-3xl font-bold text-gray-900">95%</p>
						</div>
						<div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
							<Icon name="heroicons:chart-bar" class="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>
			</div>

			<!-- Barre de recherche et filtres -->
			<div class="flex justify-between items-center mb-6">
				<div class="relative w-96">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input
						type="text"
						v-model="searchQuery"
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Rechercher un commercial..."
					/>
				</div>
				<div class="flex space-x-3">
					<select
						v-model="statusFilter"
						class="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
					>
						<option value="all">Tous les statuts</option>
						<option value="active">Actifs</option>
						<option value="inactive">Inactifs</option>
					</select>
					<select
						v-model="sortBy"
						class="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
					>
						<option value="name">Trier par nom</option>
						<option value="performance">Trier par performance</option>
						<option value="recent">Récents d'abord</option>
					</select>
					<button
						@click="toggleView"
						class="p-2 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50"
						title="Changer la vue"
					>
						<Icon :name="gridView ? 'heroicons:view-columns' : 'heroicons:list-bullet'" class="h-5 w-5 text-gray-600" />
					</button>
				</div>
			</div>

			<!-- Vue en grille -->
			<div v-if="gridView" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div
					v-for="commercial in filteredCommercials"
					:key="commercial.id"
					class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
				>
					<div class="p-6">
						<div class="flex items-start justify-between">
							<div class="flex items-center space-x-4">
								<div class="relative">
									<div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
										{{ getInitials(commercial.firstName, commercial.lastName) }}
									</div>
									<span
										class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
										:class="commercial.isActive ? 'bg-green-500' : 'bg-gray-300'"
									></span>
								</div>
								<div>
									<h3 class="font-medium text-gray-900">{{ commercial.firstName }} {{ commercial.lastName }}</h3>
									<p class="text-sm text-gray-500">{{ commercial.email }}</p>
								</div>
							</div>
							<div class="relative">
								<button
									@click.stop="toggleActions(commercial.id)"
									class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
								>
									<Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
								</button>
								<div
									v-if="activeActions === commercial.id"
									class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
								>
									<div class="py-1">
										<button
											@click="editCommercial(commercial)"
											class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											<Icon name="heroicons:pencil-square" class="inline-block w-4 h-4 mr-2" />
											Modifier
										</button>
										<button
											@click="confirmDelete(commercial.id)"
											class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
										>
											<Icon name="heroicons:trash" class="inline-block w-4 h-4 mr-2" />
											Supprimer
										</button>
									</div>
								</div>
							</div>
						</div>

						<div class="mt-6">
							<div class="flex justify-between text-sm text-gray-500 mb-2">
								<span>Performance</span>
								<span class="font-medium">{{ commercial.performance || 0 }}%</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="h-2 rounded-full"
									:class="{
										'bg-green-500': commercial.performance >= 80,
										'bg-yellow-500': commercial.performance >= 50 && commercial.performance < 80,
										'bg-red-500': commercial.performance < 50
									}"
									:style="{ width: `${Math.min(100, commercial.performance || 0)}%` }"
								></div>
							</div>
						</div>

						<div class="mt-6 pt-4 border-t border-gray-100">
							<div class="grid grid-cols-3 gap-4 text-center">
								<div>
									<p class="text-sm font-medium text-gray-500">Clients</p>
									<p class="text-lg font-semibold text-gray-900">{{ commercial.clientCount || 0 }}</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">Ventes</p>
									<p class="text-lg font-semibold text-gray-900">{{ commercial.salesCount || 0 }}</p>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-500">CA</p>
									<p class="text-lg font-semibold text-gray-900">{{ formatCurrency(commercial.revenue || 0) }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Vue en tableau -->
			<div v-else class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Commercial
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Contact
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Performance
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Statut
							</th>
							<th scope="col" class="relative px-6 py-3">
								<span class="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="commercial in filteredCommercials" :key="commercial.id" class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-shrink-0 h-10 w-10">
										<div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
											{{ getInitials(commercial.firstName, commercial.lastName) }}
										</div>
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">{{ commercial.firstName }} {{ commercial.lastName }}</div>
										<div class="text-sm text-gray-500">{{ commercial.role || 'Commercial' }}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{{ commercial.email }}</div>
								<div class="text-sm text-gray-500">{{ commercial.phone || 'Non renseigné' }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="w-24 h-2 bg-gray-200 rounded-full mr-3">
										<div
											class="h-2 rounded-full"
											:class="{
												'bg-green-500': commercial.performance >= 80,
												'bg-yellow-500': commercial.performance >= 50 && commercial.performance < 80,
												'bg-red-500': commercial.performance < 50
											}"
											:style="{ width: `${Math.min(100, commercial.performance || 0)}%` }"
										></div>
									</div>
									<span class="text-sm font-medium text-gray-900">{{ commercial.performance || 0 }}%</span>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
									:class="commercial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
								>
									{{ commercial.isActive ? 'Actif' : 'Inactif' }}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button
									@click="editCommercial(commercial)"
									class="text-blue-600 hover:text-blue-900 mr-4"
								>
									<Icon name="heroicons:pencil-square" class="inline-block w-5 h-5" />
								</button>
								<button
									@click="confirmDelete(commercial.id)"
									class="text-red-600 hover:text-red-900"
								>
									<Icon name="heroicons:trash" class="inline-block w-5 h-5" />
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div v-if="filteredCommercials.length > itemsPerPage" class="mt-6 flex justify-between items-center px-6 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-xl">
				<div class="flex-1 flex justify-between sm:hidden">
					<button
						@click="currentPage = Math.max(1, currentPage - 1)"
						:disabled="currentPage === 1"
						class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
					>
						Précédent
					</button>
					<button
						@click="currentPage = Math.min(totalPages, currentPage + 1)"
						:disabled="currentPage === totalPages"
						class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
					>
						Suivant
					</button>
				</div>
				<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
					<div>
						<p class="text-sm text-gray-700">
							Affichage de <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
							à <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredCommercials.length) }}</span>
							sur <span class="font-medium">{{ filteredCommercials.length }}</span> commerciaux
						</p>
					</div>
					<div>
						<nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
							<button
								@click="currentPage = Math.max(1, currentPage - 1)"
								:disabled="currentPage === 1"
								:class="{
									'opacity-50 cursor-not-allowed': currentPage === 1,
									'hover:bg-gray-50': currentPage !== 1
								}"
								class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
							>
								<span class="sr-only">Précédent</span>
								<Icon name="heroicons:chevron-left" class="h-5 w-5" />
							</button>
							<button
								v-for="page in visiblePages"
								:key="page"
								@click="currentPage = page"
								:class="{
									'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
									'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page
								}"
								class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
							>
								{{ page }}
							</button>
							<button
								@click="currentPage = Math.min(totalPages, currentPage + 1)"
								:disabled="currentPage === totalPages"
								:class="{
									'opacity-50 cursor-not-allowed': currentPage === totalPages,
									'hover:bg-gray-50': currentPage !== totalPages
								}"
								class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
							>
								<span class="sr-only">Suivant</span>
								<Icon name="heroicons:chevron-right" class="h-5 w-5" />
							</button>
						</nav>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "~/app/stores/_user";

// Références
const userStore = useUserStore();
const searchQuery = ref('');
const statusFilter = ref('all');
const sortBy = ref('name');
const gridView = ref(true);
const activeActions = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;

// Données des commerciaux (à remplacer par un appel API)
const commercials = ref([
  {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    role: 'Responsable commercial',
    isActive: true,
    performance: 85,
    clientCount: 42,
    salesCount: 128,
    revenue: 125000,
    joinDate: '2022-01-15'
  },
  {
    id: 2,
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    phone: '06 23 45 67 89',
    role: 'Commerciale',
    isActive: true,
    performance: 92,
    clientCount: 38,
    salesCount: 156,
    revenue: 148000,
    joinDate: '2022-03-10'
  },
  {
    id: 3,
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre.durand@example.com',
    phone: '06 34 56 78 90',
    role: 'Commercial sénior',
    isActive: true,
    performance: 78,
    clientCount: 31,
    salesCount: 95,
    revenue: 89000,
    joinDate: '2023-01-20'
  },
  {
    id: 4,
    firstName: 'Sophie',
    lastName: 'Leroy',
    email: 'sophie.leroy@example.com',
    phone: '06 45 67 89 01',
    role: 'Commerciale',
    isActive: false,
    performance: 65,
    clientCount: 24,
    salesCount: 72,
    revenue: 68000,
    joinDate: '2023-05-15'
  }
]);

// Fonction pour obtenir les initiales d'un commercial
const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

// Formater une valeur monétaire
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

// Filtrer et trier les commerciaux
const filteredCommercials = computed(() => {
  // Utiliser les données du store si disponibles, sinon utiliser les données de test
  let result = [];

  if (userStore.users && userStore.users.length > 0) {
    // Mapper les données du store vers le format attendu
    result = userStore.users
      .filter(user => user.role && user.role.toLowerCase() === 'commercial')
      .map(user => ({
        id: user.id,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'Commercial',
        isActive: user.is_active !== undefined ? user.is_active : true,
        performance: user.performance || 0,
        clientCount: user.client_count || 0,
        salesCount: user.sales_count || 0,
        revenue: user.revenue || 0,
        joinDate: user.created_at || new Date().toISOString().split('T')[0]
      }));
  } else {
    // Utiliser les données de test
    result = [...commercials.value];
  }

  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(commercial =>
      commercial.firstName.toLowerCase().includes(query) ||
      commercial.lastName.toLowerCase().includes(query) ||
      commercial.email.toLowerCase().includes(query)
    );
  }

  // Filtrage par statut
  if (statusFilter.value !== 'all') {
    const isActive = statusFilter.value === 'active';
    result = result.filter(commercial => commercial.isActive === isActive);
  }

  // Tri
  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`));
      break;
    case 'performance':
      result.sort((a, b) => (b.performance || 0) - (a.performance || 0));
      break;
    case 'recent':
      result.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
      break;
  }

  return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredCommercials.value.length / itemsPerPage));
const paginatedCommercials = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCommercials.value.slice(start, end);
});

// Pages visibles dans la pagination
const visiblePages = computed(() => {
  const range = [];
  const maxVisiblePages = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1);

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
});

// Gestion des actions
const toggleActions = (commercialId) => {
  activeActions.value = activeActions.value === commercialId ? null : commercialId;
};

const editCommercial = (commercial) => {
  // Rediriger vers le formulaire d'édition
  navigateTo(`/sales/commercials/edit/${commercial.id}`);
};

const confirmDelete = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce commercial ? Cette action est irréversible.')) {
    userStore.deleteUser(id).then(() => {
      console.log('Commercial supprimé avec succès');
      // Recharger la liste des utilisateurs
      userStore.fetchUsers();
    }).catch(error => {
      console.error('Erreur lors de la suppression du commercial:', error);
      alert('Une erreur est survenue lors de la suppression du commercial');
    });
  }
};

const toggleView = () => {
  gridView.value = !gridView.value;
};

// Gestion du clic en dehors du menu d'actions
const handleClickOutside = (e) => {
  const actionMenus = document.querySelectorAll('.action-menu');
  const isOutside = Array.from(actionMenus).every(
    menu => !menu.contains(e.target)
  );

  if (isOutside && activeActions.value !== null) {
    activeActions.value = null;
  }
};

// Nettoyage des écouteurs d'événements
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Ajout de l'écouteur d'événement
document.addEventListener('click', handleClickOutside);

// Charger les données au montage
onMounted(() => {
  // Charger les utilisateurs depuis le store s'ils ne sont pas déjà chargés
  if (!userStore.users || userStore.users.length === 0) {
    userStore.fetchUsers().catch(error => {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    });
  }
});

// Statistique des nouveaux commerciaux ce mois
const newThisMonth = computed(() => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  return filteredCommercials.value.filter(commercial => {
    const joinDate = new Date(commercial.joinDate);
    return joinDate.getMonth() === thisMonth &&
           joinDate.getFullYear() === thisYear;
  }).length;
});

// Charger les utilisateurs au montage du composant
onMounted(() => {
	userStore.fetchUsers();
});
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
	thead,
	tbody,
	tr,
	th,
	td {
		display: block;
	}
	tr {
		margin-bottom: 1rem;
	}
}
</style>
