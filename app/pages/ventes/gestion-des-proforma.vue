<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
		<!-- STATS -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Carte Total Proforma -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Proforma</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ stats.total || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:document-text" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Brouillons -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-amber-900">Brouillons</p>
						<p class="text-3xl font-bold text-amber-900 mt-2">{{ stats.draft || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:pencil" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Validés -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-green-900">Validés</p>
						<p class="text-3xl font-bold text-green-900 mt-2">{{ stats.validated || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Rejetés -->
			<div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-red-900">Rejetés</p>
						<p class="text-3xl font-bold text-red-900 mt-2">{{ stats.rejected || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-red-500">
						<Icon name="heroicons:x-circle" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>
		</div>

		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-xl font-bold text-gray-900">Liste des Proforma</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Barre de recherche -->
				<div class="relative flex-grow">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input type="text" v-model="searchQuery" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
						@input="filterProforma" />
				</div>
				<button @click="openProformaModal"
					class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
					Nouvelle Proforma
				</button>
			</div>
		</div>

		<template v-if="proforma.length > 0">
			<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
			<div class="hidden lg:block bg-white border rounded-lg shadow mt-6 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gradient-to-r from-blue-50 to-green-50">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Réf
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Client
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Objet
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Montant TTC
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Statut
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Date
								</th>
								<th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-blue-800 tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="proforma in paginatedProforma" :key="proforma.id + '-table'"
								class="hover:bg-gray-50 transition-colors duration-150">
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{{ proforma.reference }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">
										{{ getClientName(proforma.client) }}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="text-sm text-gray-900 truncate" :title="proforma.object">{{ proforma.object || "-" }}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{{ proforma.total_ttc.toLocaleString() }} F CFA
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span :class="badgeClass(proforma.status)"
										class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
										{{ translateStatus(proforma.status!) }}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ formatDate(proforma.created_at!) }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
									<!-- Bouton actions: ... -->
									<button @click.stop="toggleActions(proforma.id)"
										class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
										<span class="sr-only">Actions</span>
										<Icon name="heroicons-solid:ellipsis-horizontal" class="w-5 h-5"/>
									</button>

									<!-- Dropdown -->
									<div v-if="openActionsId === proforma.id" class="absolute right-6 top-10 z-50 w-48 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden">
										<ul class="divide-y divide-gray-100">
											<li>
												<button @click.stop="() => { updateStatus(proforma, 'validated'); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50">
													<Icon name="heroicons-solid:check" class="w-4 h-4 inline mr-2" />
													Valider
												</button>
											</li>
											<li>
												<button @click.stop="() => { updateStatus(proforma, 'rejected'); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
													<Icon name="heroicons-solid:x-mark" class="w-4 h-4 inline mr-2" />
													Rejeter
												</button>
											</li>
											<li>
												<button @click.stop="() => { viewProforma(proforma); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
													<Icon name="heroicons-solid:eye" class="w-4 h-4 inline mr-2" />
													Voir
												</button>
											</li>
											<li>
												<button @click.stop="() => { downloadProforma(proforma); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
													<Icon name="heroicons-solid:arrow-down-tray" class="w-4 h-4 inline mr-2" />
													Télécharger
												</button>
											</li>
											<li>
												<button @click.stop="() => { deleteProforma(proforma); closeActions(); }"
												class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
													<Icon name="heroicons-solid:trash" class="w-4 h-4 inline mr-2" />
													Supprimer
												</button>
											</li>
										</ul>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
			<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
				<div v-for="proforma in paginatedProforma" :key="proforma.id + '-card'"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
					<div class="p-4">
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">{{ proforma.reference }}</h3>
								<p class="text-sm text-gray-600 mt-1">{{ getClientName(proforma.client) }}</p>
							</div>
							<span :class="badgeClass(proforma.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
								{{ translateStatus(proforma.status) }}
							</span>
						</div>

						<div class="mt-3 space-y-2">
							<div class="text-sm text-gray-600">
								<span class="font-medium">Objet:</span> {{ proforma.object }}
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-600">
									<Icon name="heroicons:calendar" class="w-4 h-4 inline mr-1" />
									{{ formatDate(proforma.created_at) }}
								</span>
								<span class="font-semibold text-gray-900">
									{{ proforma.total_ttc.toLocaleString() }} F CFA
								</span>
							</div>
						</div>

						<div class="flex justify-between mt-4 pt-3 border-t border-gray-100">
							<div class="flex gap-2">
								<button v-if="proforma.status === 'draft'" @click.stop="updateStatus(proforma, 'validated')"
									class="p-1.5 text-green-600 hover:bg-green-50 rounded-full" title="Valider">
									<Icon name="heroicons:check-circle" class="w-5 h-5" />
								</button>
								<button v-if="proforma.status === 'draft'" @click.stop="updateStatus(proforma, 'rejected')"
									class="p-1.5 text-red-600 hover:bg-red-50 rounded-full" title="Rejeter">
									<Icon name="heroicons:x-circle" class="w-5 h-5" />
								</button>
							</div>
							<div class="flex gap-2">
								<button @click.stop="viewProforma(proforma)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
									title="Voir les détails">
									<Icon name="heroicons:eye" class="w-5 h-5" />
								</button>
								<button @click.stop="downloadProforma(proforma)"
									class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full" title="Télécharger">
									<Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
								</button>
								<button @click="deleteProforma(proforma)" title="Supprimer"
									class="p-1.5 text-red-600 hover:bg-red-50 rounded-full">
									<Icon name="heroicons:trash" class="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- EmptyState -->
		<div v-if="isLoading || proforma.length == 0 || filteredProforma.length == 0">
			<EmptyState title="Aucune proforma trouvée" description="Il n'y a actuellement aucune proforma à afficher."
				icon="heroicons:cpu-chip" iconColor="text-blue-400" @reload="proformaStore.fetchAll()" :isLoading="isLoading"
				:searchQuery="searchQuery" />
		</div>

		<ShowProformaDetails :showModal="showModal" :selectedProforma="selectedProforma!" :formatDate="formatDate"
			:translateStatus="translateStatus" :downloadProforma="downloadProforma" :closeModal="closeModal" />

		<ProformaFormModal :showModal="showProformaFormModal" @close="closeProformaModal" @saved="onProformaSaved" />

		<!-- Pagination -->
		<div v-if="filteredProforma.length > 0" class="mt-6">
			<Paginator :totalItems="filteredProforma.length" @range-changed="onRangeChanged" />
		</div>
	</div>
</template>

<script setup lang="ts">
useHead({
	title: "Gestion des proforma"
});
import { ref, onMounted, reactive, computed } from "vue";
import type { Proforma } from "~/models/Proforma";
import { getClientName } from "~/models/Client";
import ShowProformaDetails from '@/components/sales/ShowProformaDetails.vue'
import ProformaFormModal from '@/components/sales/ProformaFormModal.vue'
import Paginator from "~/app/components/Paginator.vue";
import EmptyState from "~/app/components/EmptyState.vue";
import Swal from "sweetalert2";
import { useProformaStore } from "@/stores/Stock/ProformaStore";

const proformaStore = useProformaStore();
const filteredProforma = ref<Proforma[]>([]);
const searchQuery = ref("");
const stats = ref({ total: 0, draft: 0, validated: 0, rejected: 0 });
const selectedProforma = ref<Proforma>();
const showModal = ref(false);
const showProformaFormModal = ref(false);
const { proforma, isLoading } = storeToRefs(proformaStore);

// Pagination
const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const paginatedProforma = computed(() => {
	return filteredProforma.value.slice(range.start - 1, range.end)
});

onMounted(async () => {
	await proformaStore.fetchAll();
	proforma.value = proformaStore.proforma;
	filteredProforma.value = [...proforma.value];
	computeStats();
});

// Gestion du menu d'actions (id du proforma dont le menu est ouvert)
const openActionsId = ref<number | string | null>(null);
const toggleActions = (id: number | string) => {
	openActionsId.value = openActionsId.value === id ? null : id;
};
const closeActions = () => { openActionsId.value = null };

const badgeClass = (status: string) => {
	return {
		"bg-yellow-200 text-yellow-800": status === "draft",
		"bg-green-200 text-green-800": status === "validated",
		"bg-red-200 text-red-800": status === "rejected",
	};
};
const translateStatus = (status: string) => {
	switch (status) {
		case "draft":
			return "Non Validée";
		case "validated":
			return "Validée";
		case "rejected":
			return "Rejettée";
	}
};

const deleteProforma = (proforma: Proforma) => {
	Swal.fire({
		icon: "info",
		title: "Suppression de la proforma",
		html: `Voulez-vous vraiment supprimer la proforma <strong>${proforma.reference}</strong> ?`,
		showCancelButton: true,
		confirmButtonText: "Oui",
		cancelButtonText: "Non"
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await proformaStore.delete(proforma.id);
				Swal.fire({
					icon: "success",
					title: "Suppression effectuée",
					html: `La proforma <strong>${proforma.reference}</strong> a été supprimée avec succès.`,
				});
			} catch(error) {
				Swal.fire({
					icon: "error",
					title: "Une erreur esr survenue",
					text: `Une erreur est survenue lors de la suppression de la proforma <strong>${proforma.reference}</strong>.`,
				});
			}
		}
	});
}

const updateStatus = async (proforma: Proforma, status: string) => {
	Swal.fire({
		icon: "info",
		title: "Mise à jour du statut",
		html: `Voulez-vous vraiment mettre à jour le statut de la proforma <strong>${proforma.reference}</strong> ?`,
		showCancelButton: true,
		confirmButtonText: "Oui",
		cancelButtonText: "Non"
	}).then(async result => {
		if (result.isConfirmed) {
			await performStatusUpdate(proforma, status);
		}
	});
};

const performStatusUpdate = async (proforma: Proforma, status: string) => {
	try {
		await proformaStore.updateStatus(proforma.id, status);
		Swal.fire({
			icon: "success",
			title: "Mise à jour du statut",
			html: `Le statut de la proforma <strong>${proforma.reference}</strong> a été mis à jour avec succès.`,
		});
		computeStats();
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Erreur",
			html: `Une erreur est survenue lors de la mise à jour du statut de la proforma <strong>${proforma.reference}</strong>. <br>
				Contenu du message: <i>${error}</i>`,
		});
	}
}
function viewProforma(proforma: Proforma) {
	selectedProforma.value = proforma;
	showModal.value = true;
}
function closeModal() {
	showModal.value = false;
	selectedProforma.value = undefined;
}

function downloadProforma(proforma: Proforma) {
	try {
		proformaStore.downloadProformaAsPdf(proforma);
	} catch(_) {
		Swal.fire({
			icon: "error",
			title: "Erreur",
			text: "La génération du PDF a échoué.",
		});
	}
}


const formatDate = (date: string): string => new Date(date).toLocaleDateString();

const filterProforma = () => {
	if (!searchQuery.value.trim()) {
		filteredProforma.value = [...proforma.value];
		return;
	}

	const query = searchQuery.value.toLowerCase().trim();
	filteredProforma.value = proforma.value.filter((proforma) => {
		return (
			proforma.reference?.toLowerCase().includes(query) ||
			proforma.object?.toLowerCase().includes(query) ||
			(proforma.client?.first_name + " " + proforma.client?.last_name)
				.toLowerCase()
				.includes(query) ||
			proforma.status?.toLowerCase().includes(query)
		);
	});

	// Mettre à jour les statistiques avec les résultats filtrés
	computeStats();
};

const computeStats = () => {
	const items = searchQuery.value ? filteredProforma.value : proforma.value;
	stats.value.total = items.length;
	stats.value.draft = items.filter((p) => p.status === "draft").length;
	stats.value.validated = items.filter((p) => p.status === "validated").length;
	stats.value.rejected = items.filter((p) => p.status === "rejected").length;
};

// Fonctions pour le modal de création
const openProformaModal = () => {
	showProformaFormModal.value = true;
};

const closeProformaModal = () => {
	showProformaFormModal.value = false;
};

const onProformaSaved = async () => {
	proforma.value = proformaStore.proforma;
	filteredProforma.value = [...proforma.value];
	computeStats();
};
</script>
