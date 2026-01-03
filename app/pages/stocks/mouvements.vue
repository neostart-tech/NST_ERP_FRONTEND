<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Cartes de statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Carte Total Mouvements -->
			<div class="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-sky-900">Total Mouvements</p>
						<p class="text-3xl font-bold text-sky-900 mt-2">
							{{ stats.totalMovements || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-sky-500">
						<Icon name="heroicons:arrow-path" class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Entrées -->
			<div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-emerald-900">Entrées</p>
						<p class="text-3xl font-bold text-emerald-900 mt-2">
							{{ stats.entries || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-emerald-500">
						<Icon name="heroicons:arrow-down-tray" class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Sorties -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-amber-900">Sorties</p>
						<p class="text-3xl font-bold text-amber-900 mt-2">
							{{ stats.exits || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:arrow-up-tray" class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Ajustements -->
			<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-purple-900">Ajustements</p>
						<p class="text-3xl font-bold text-purple-900 mt-2">
							{{ stats.adjustments || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-purple-500">
						<Icon name="heroicons:adjustments-horizontal" class="h-6 w-6 text-white" />
					</div>
				</div>
			</div>
		</div>

		<!-- Section de filtres collapsible -->
		<div class="bg-white/80 backdrop-blur-sm rounded-2xl mb-4 overflow-hidden">
			<!-- En-tête du collapse -->
			<button @click="isFiltersCollapsed = !isFiltersCollapsed"
				class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
				<h3 class="text-lg font-semibold text-slate-800 flex items-center">
					<svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
					</svg>
					Filtres et Recherche
				</h3>
				<svg class="w-5 h-5 text-slate-600 transition-transform duration-300"
					:class="{ 'rotate-180': !isFiltersCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			<!-- Contenu du collapse -->
			<div v-show="!isFiltersCollapsed" class="px-6 pb-6">
				<div class="flex items-center justify-end mb-4">
					<!-- Bouton de réinitialisation des filtres -->
					<button @click="resetFilters"
						class="text-sm text-slate-600 hover:text-blue-600 flex items-center transition-colors">
						<Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2" />
						Réinitialiser
					</button>
				</div>

				<!-- Grille de filtres -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Filtre par produit -->
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Produit</label>
						<select v-model="historyFilterProduct"
							class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
							<option value="">Tous les produits</option>
							<option v-for="product in products" :key="product.id" :value="product.id">
								{{ product.name }}
							</option>
						</select>
					</div>

					<!-- Filtre par type -->
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Type de mouvement</label>
						<select v-model="historyFilterType"
							class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
							<option value="">Tous les types</option>
							<option value="entry">Entrée</option>
							<option value="exit">Sortie</option>
							<option value="adjustment_positive">Ajustement Positif</option>
							<option value="adjustment_negative">Ajustement Négatif</option>
						</select>
					</div>

					<!-- Filtre par date -->
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Date</label>
						<input type="date" v-model="historyFilterDate"
							class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200" />
					</div>
				</div>
			</div>
		</div>

		<!-- Bouton Nouveau Mouvement -->
		<div class="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 my-3">
			<button @click="showMovementFormModal = true"
				class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600
			text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
				<Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
				<span>Nouveau Mouvement</span>
			</button>
		</div>

		<!-- Loader -->
		<div v-if="isLoading" class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>

		<!-- Contenu principal -->
		<template v-else-if="filteredMovements.length > 0">
			<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
			<div class="hidden lg:block bg-white border rounded-lg shadow mt-6 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gradient-to-r from-blue-50 to-green-50">
							<tr>
								<th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									<div class="flex items-center">
										<Icon name="heroicons:calendar" class="h-4 w-4 mr-1" />
										Date
									</div>
								</th>
								<th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									<div class="flex items-center">
										<Icon name="heroicons:cube" class="h-4 w-4 mr-1" />
										Produit
									</div>
								</th>
								<th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									<div class="flex items-center">
										<Icon name="heroicons:tag" class="h-4 w-4 mr-1" />
										Type
									</div>
								</th>
								<th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									<div class="flex items-center">
										<Icon name="heroicons:cube-transparent" class="h-4 w-4 mr-1" />
										Quantité
									</div>
								</th>
								<th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									<div class="flex items-center">
										<Icon name="heroicons:document-text" class="h-4 w-4 mr-1" />
										Raison
									</div>
								</th>
								<th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="movement in filteredMovements" :key="(movement as any).id"
								class="hover:bg-gray-50 transition-colors duration-150">
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
									{{ formatDate((movement as any).created_at) }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
									{{ getProductName((movement as any).product_id) }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm">
									<span :class="getMovementTypeLabel((movement as any).movement_type).class">
										<Icon :name="getMovementTypeLabel((movement as any).movement_type).icon" class="h-3.5 w-3.5 mr-1" />
										{{ getMovementTypeLabel((movement as any).movement_type).text }}
									</span>
								</td>
								<td :class="[
									'px-6 py-4 whitespace-nowrap text-sm font-semibold',
									(movement as any).movement_type === 'entry' || (movement as any).movement_type === 'adjustment_positive'
										? 'text-green-700'
										: 'text-red-600',
								]">
									{{ (movement as any).movement_type === 'entry' || (movement as any).movement_type ===
										'adjustment_positive' ? '+' : '-'
									}}
									{{ (movement as any).quantity }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 italic">
									{{ truncateReason((movement as any).reason) }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button @click="viewMovement(movement)" class="text-gray-600 hover:text-gray-900" title="Voir les détails">
										<Icon name="heroicons:eye" class="w-5 h-5" />
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
			<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
				<div v-for="movement in filteredMovements" :key="(movement as any).id"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
					<div class="p-4">
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">
									{{ getProductName((movement as any).product_id) }}
								</h3>
								<p class="text-sm text-gray-500 mt-1">
									{{ formatDate((movement as any).created_at) }}
								</p>
							</div>
							<span :class="getMovementTypeLabel((movement as any).movement_type).class">
								<Icon :name="getMovementTypeLabel((movement as any).movement_type).icon" class="h-3.5 w-3.5 mr-1" />
								{{ getMovementTypeLabel((movement as any).movement_type).text }}
							</span>
						</div>
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Quantité</span>
								<span :class="[
									'text-sm font-semibold',
									(movement as any).movement_type === 'entry' || (movement as any).movement_type === 'adjustment_positive'
										? 'text-green-700'
										: 'text-red-600',
								]">
									{{ (movement as any).movement_type === 'entry' || (movement as any).movement_type ===
										'adjustment_positive' ? '+' : '-'
									}}
									{{ (movement as any).quantity }}
								</span>
							</div>
							<div v-if="(movement as any).reason" class="flex items-start">
								<Icon name="heroicons:document-text" class="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
								<span class="text-sm text-gray-600 italic">{{ truncateReason((movement as any).reason) }}</span>
							</div>
						</div>
						<div class="flex justify-end mt-4">
							<button @click.stop="viewMovement(movement)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
								title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- EmptyState -->
		<EmptyState
			v-else
			title="Aucun mouvement trouvé"
			description="Il n'y a actuellement aucun mouvement de stock à afficher."
			icon="heroicons:arrow-path"
			iconColor="text-blue-400"
			@reload="refreshData()"
			:isLoading="isLoading"
		/>

		<!-- Modale de formulaire produit -->
		<div v-if="showMovementFormModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
			role="dialog" aria-modal="true">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showMovementFormModal = false">
				</div>

				<div
					class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
					<div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
						<button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
							@click="showMovementFormModal = false">
							<span class="sr-only">Fermer</span>
							<Icon name="heroicons:x-mark" class="h-6 w-6" />
						</button>
					</div>
					<MovementForm v-model:showMovementFormModal="showMovementFormModal" :products="products"
						:currentMovement="newMovement" :validationErrors="validationErrors" :isFormLoading="isFormLoading"
						@submit="addMovement" />

				</div>
			</div>
		</div>

		<!-- Modale de détails mouvement -->
		<div v-if="showMovementDetailModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title"
			role="dialog" aria-modal="true">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showMovementDetailModal = false">
				</div>

				<div
					class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
					<div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
						<button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
							@click="showMovementDetailModal = false">
							<span class="sr-only">Fermer</span>
							<Icon name="heroicons:x-mark" class="h-6 w-6" />
						</button>
					</div>
					<ShowMovementDetail v-model:showDetailModal="showMovementDetailModal" :movement="selectedMovement"
						:products="products" />

				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '~/app/stores/Stock/ProductStore';
import Swal from 'sweetalert2';
import { useMovementStore } from '~/app/stores/Stock/MovementStore';
import MovementForm from '~/app/components/stock/MovementForm.vue';
import ShowMovementDetail from '~/app/components/stock/ShowMovementDetail.vue';
import EmptyState from '~/app/components/EmptyState.vue';

useHead({
	title: 'Mouvements de Stock',
});

const productStore = useProductStore();
const movementStore = useMovementStore();

const { products } = storeToRefs(productStore);
const { movements, isLoading, validationErrors, isFormLoading } = storeToRefs(movementStore);

// État du formulaire
const showMovementFormModal = ref(false);
const showMovementDetailModal = ref(false);
const selectedMovement = ref<any>(null);
const newMovement = ref({
	product_id: '',
	movement_type: '',
	quantity: null,
	reason: '',
});

// Statistiques
const stats = ref({
	totalMovements: 0,
	entries: 0,
	exits: 0,
	adjustments: 0
});

const historyFilterProduct = ref('');
const historyFilterType = ref('');
const historyFilterDate = ref('');
const isFiltersCollapsed = ref(true);

const getMovementTypeLabel = (type: string) => {
	const labels: Record<string, { text: string; icon: string; color: string }> = {
		'entry': { text: 'Entrée', icon: 'heroicons:arrow-down-tray', color: 'green' },
		'exit': { text: 'Sortie', icon: 'heroicons:arrow-up-tray', color: 'red' },
		'adjustment_positive': { text: 'Ajustement +', icon: 'heroicons:plus-circle', color: 'blue' },
		'adjustment_negative': { text: 'Ajustement -', icon: 'heroicons:minus-circle', color: 'orange' }
	};

	const movement = labels[type] || { text: type, icon: 'heroicons:question-mark-circle', color: 'gray' };

	return {
		...movement,
		class: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${movement.color}-100 text-${movement.color}-800`
	};
};

const getProductName = (productId: number | string) => {
	const id = String(productId);
	const product = products.value.find((p) => p.id === id);
	return product ? product.name : 'Produit inconnu';
};

const formatDate = (dateString: string) => {
	if (!dateString) return 'Date invalide';
	const date = new Date(dateString);
	if (isNaN(date.getTime())) return 'Date invalide';
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	};
	return date.toLocaleDateString('fr-FR', options);
};

const fetchAvailableProducts = async () => {
	try {
		await productStore.fetchAll();
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Erreur lors du chargement",
			text: "Une erreur est survenue lors du chargement des produits",
		});
	}
};

const fetchStockMovements = async () => {
	try {
		await movementStore.fetchAll();
		updateStats();
	} catch (error) {
		console.error('Erreur lors du chargement des mouvements :', error);
		Swal.fire({
			icon: "error",
			title: "Erreur lors du chargement",
			text: "Une erreur est survenue lors du chargement des mouvements",
		});
	}
};

// Mettre à jour les statistiques
const updateStats = () => {
	stats.value = {
		totalMovements: movements.value.length,
		entries: movements.value.filter(m => m.movement_type === 'entry').length,
		exits: movements.value.filter(m => m.movement_type === 'exit').length,
		adjustments: movements.value.filter((m: any) => m.movement_type === 'adjustment_positive' || m.movement_type === 'adjustment_negative').length
	};
};

const refreshData = async () => {
	await fetchAvailableProducts();
	await fetchStockMovements();
};

const addMovement = async () => {
	isFormLoading.value = true;
	validationErrors.value = {};

	try {
		if (!newMovement.value.product_id || !newMovement.value.movement_type || !newMovement.value.quantity || newMovement.value.quantity <= 0) {
			Swal.fire({
				icon: "error",
				title: "Champs manquants",
				text: "Veuillez remplir tous les champs obligatoires.",
			});
			isFormLoading.value = false;
			return;
		}

		await movementStore.store(newMovement.value as any);
		showMovementFormModal.value = false;
		resetForm();
	} catch (err: any) {
		Swal.fire({
			icon: "error",
			title: "Erreur",
			text: "Une erreur est survenue lors de l'ajout du mouvement."
		});
	}
};

const resetForm = () => {
	newMovement.value = {
		product_id: '',
		movement_type: '',
		quantity: null,
		reason: '',
	};
	validationErrors.value = {};
};

const filteredMovements = computed(() => {
	let filtered = movements.value;

	if (historyFilterProduct.value) {
		filtered = filtered.filter((m: any) => String(m.product_id) === historyFilterProduct.value);
	}
	if (historyFilterType.value) {
		filtered = filtered.filter((m) => m.movement_type === historyFilterType.value);
	}
	if (historyFilterDate.value) {
		filtered = filtered.filter((m: any) =>
			m.created_at?.startsWith(historyFilterDate.value)
		);
	}

	return filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});

const productStockSummary = computed(() => {
	const realStockMap: Record<string, number> = {};

	movements.value.forEach((m: any) => {
		const id = m.product_id;
		if (!realStockMap[id]) realStockMap[id] = 0;

		const qte = Number(m.quantity || 0);
		if (['entry', 'adjustment_positive'].includes(m.movement_type)) {
			realStockMap[id] += qte;
		} else if (['exit', 'adjustment_negative'].includes(m.movement_type)) {
			realStockMap[id] -= qte;
		}
	});

	return realStockMap;
});

// Réinitialiser les filtres
const resetFilters = () => {
	historyFilterProduct.value = '';
	historyFilterType.value = '';
	historyFilterDate.value = '';
};

// Tronquer la raison
const truncateReason = (reason: string) => {
	if (!reason) return '-';
	if (reason.length <= 25) return reason;
	return reason.substring(0, 25) + '...';
};

// Voir les détails d'un mouvement
const viewMovement = (movement: any) => {
	selectedMovement.value = movement;
	showMovementDetailModal.value = true;
};

onMounted(async () => {
	await refreshData();
});
</script>

<style scoped>
/* Styles pour les entêtes de tableau */
th {
	@apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

/* Styles pour les cellules du tableau */
td {
	@apply px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200;
}

/* Style pour les lignes du tableau */
tbody tr {
	@apply hover:bg-gray-50 transition-colors duration-150;
}

/* Style pour les boutons d'action */
.action-btn {
	@apply p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200;
}

/* Style pour les badges de statut */
.status-badge {
	@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

/* Style pour les champs de formulaire */
input,
select {
	@apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm;
}

/* Style pour les boutons */
.btn {
	@apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
	@apply bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
	@apply bg-gray-600 hover:bg-gray-700 focus:ring-gray-500;
}

/* Animation de chargement */
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}

/* Styles spécifiques pour le tableau */
th:last-child,
td:last-child {
	border-right: none;
}

table {
	border-collapse: separate;
	border-spacing: 0;
	width: 100%;
}

.overflow-x-auto {
	max-width: 100%;
	overflow-x: auto;
}

thead tr th:first-child {
	border-top-left-radius: 0.375rem;
}

thead tr th:last-child {
	border-top-right-radius: 0.375rem;
}

tbody tr:hover {
	background-color: #f8fafc;
}
</style>
