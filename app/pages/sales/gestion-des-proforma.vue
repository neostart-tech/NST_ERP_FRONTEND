<template>
	<div
		class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
	>
		<!-- HEADER -->

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
			<h1 class="text-xl font-bold text-gray-900">Liste des Proformas</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Barre de recherche -->
				<div class="relative flex-grow">
					<div
						class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
					>
						<Icon
							name="heroicons:magnifying-glass"
							class="h-5 w-5 text-gray-400"
						/>
					</div>
					<input
						type="text"
						v-model="searchQuery"
						placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
						@input="filterProformas"
					/>
				</div>
				<NuxtLink
					:to="AppUrl.PROPO"
					class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all"
				>
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
					Nouvelle Proforma
				</NuxtLink>
			</div>
		</div>

		<!-- Liste des Proformas -->
		<div class="bg-white border p-4 rounded-lg shadow mt-6">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gradient-to-r from-blue-50 to-blue-100">
						<tr>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
								Réf
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
								Client
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
								Objet
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
								Montant TTC
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
								Statut
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
								Date
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="proforma in filteredProformas"
							:key="proforma.id"
							class="hover:bg-gray-50"
						>
							<td class="border px-3 py-2">{{ proforma.reference }}</td>
							<td class="border px-3 py-2">
								{{ proforma.client?.last_name }}
								{{ proforma.client?.first_name }}
							</td>
							<td class="border px-3 py-2">{{ proforma.object }}</td>
							<td class="border px-3 py-2">
								{{ proforma.total_ttc.toLocaleString() }} FCFA
							</td>
							<td class="border px-3 py-2">
								<span
									:class="badgeClass(proforma.status)"
									class="px-2 py-1 rounded text-xs font-bold"
								>
									{{ translateStatus(proforma.status) }}
								</span>
							</td>
							<td class="border px-3 py-2">
								{{ formatDate(proforma.created_at) }}
							</td>
							<td class="border px-3 py-2 flex justify-center gap-2">
								<button
									v-if="proforma.status === 'draft'"
									@click="updateStatus(proforma.id, 'validated')"
									class="bg-green-500 text-white px-2 py-1 rounded text-xs"
								>
									Valider
								</button>
								<button
									v-if="proforma.status === 'draft'"
									@click="updateStatus(proforma.id, 'rejected')"
									class="bg-red-500 text-white px-2 py-1 rounded text-xs"
								>
									Rejeter
								</button>
								<button
									@click="viewProforma(proforma)"
									title="Voir"
									class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out"
								>
									<i class="fas fa-eye"></i>
								</button>
								<button
									@click="downloadProforma(proforma)"
									title="Telecharger"
									class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out"
								>
									<i class="fas fa-download"></i>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div
		v-if="showModal"
		class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
	>
		<div class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
			<h2 class="text-2xl font-bold mb-4 text-indigo-700">
				Détails de la Proforma
			</h2>

			<!-- Infos Proforma -->
			<div class="mb-4 space-y-1 text-sm text-gray-700">
				<p><strong>Référence :</strong> {{ selectedProforma.reference }}</p>
				<p>
					<strong>Date :</strong> {{ formatDate(selectedProforma.created_at) }}
				</p>
				<p>
					<strong>Statut :</strong>
					{{ translateStatus(selectedProforma.status) }}
				</p>
				<p><strong>Objet :</strong> {{ selectedProforma.object }}</p>
			</div>

			<!-- Client -->
			<div class="mb-4 text-sm text-gray-700">
				<h3 class="font-semibold text-lg mb-2">Client</h3>
				<p>
					{{ selectedProforma.client.last_name }}
					{{ selectedProforma.client.first_name }}
				</p>
			</div>

			<!-- Articles -->
			<div class="overflow-x-auto">
				<h3 class="font-semibold text-lg mb-2">Articles</h3>
				<table class="w-full table-auto border text-sm">
					<thead class="bg-gray-100 text-gray-700 uppercase">
						<tr>
							<th class="border px-4 py-2 text-left">Article</th>
							<th class="border px-4 py-2 text-left">Description</th>
							<th class="border px-4 py-2 text-right">Quantité</th>
							<th class="border px-4 py-2 text-right">Prix unitaire</th>
							<th class="border px-4 py-2 text-right">Total</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="article in selectedProforma.articles"
							:key="article.id"
							class="hover:bg-gray-50"
						>
							<td class="border px-4 py-2">{{ article.label }}</td>
							<td class="border px-4 py-2">{{ article.description }}</td>
							<td class="border px-4 py-2 text-right">
								{{ article.pivot.quantity }}
							</td>
							<td class="border px-4 py-2 text-right">
								{{ formatCurrency(article.pivot.unit_price) }}
							</td>
							<td class="border px-4 py-2 text-right">
								{{
									formatCurrency(
										article.pivot.quantity * article.pivot.unit_price
									)
								}}
							</td>
						</tr>
					</tbody>
					<tfoot class="bg-gray-50">
						<tr>
							<td colspan="4" class="text-right font-bold px-4 py-2">
								Total HT
							</td>
							<td class="text-right font-bold px-4 py-2">
								{{ formatCurrency(selectedProforma.total_ht) }}
							</td>
						</tr>
						<tr>
							<td colspan="4" class="text-right font-bold px-4 py-2">
								Total TTC
							</td>
							<td class="text-right font-bold px-4 py-2">
								{{ formatCurrency(selectedProforma.total_ttc) }}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<div class="mt-6 flex justify-between">
				<button
					@click="downloadProforma(selectedProforma)"
					class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
				>
					<i class="fas fa-download"></i> Imprimer
				</button>

				<button
					@click="closeModal"
					class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
				>
					Fermer
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProformaStore } from "~/app/stores/Stock/proformaStore";
import { AppUrl } from "~/app/composables/appUrl";
import type { Proforma } from "~/models/Proforma";

const proformaStore = useProformaStore();
const filteredProformas = ref<Proforma[]>([]);
const searchQuery = ref("");
const stats = ref({ total: 0, draft: 0, validated: 0, rejected: 0 });
const selectedProforma = ref();
const showModal = ref(false);
const {proforma: proformas} = storeToRefs(proformaStore);


onMounted(async () => {
	await proformaStore.fetchAll();
	proformas.value = proformaStore.proforma;
	filteredProformas.value = [...proformas.value];
	computeStats();
});

const badgeClass = (status: string) => {
	return {
		"bg-yellow-200 text-yellow-800": status === "draft",
		"bg-green-200 text-green-800": status === "validated",
		"bg-red-200 text-red-800": status === "rejected",
	};
};
const statusColor = (status: string) => {
	switch (status) {
		case "draft":
			return "bg-yellow-200 text-yellow-100";
		case "validated":
			return "bg-gren-200 text-green-800";
		case "rejected":
			return "bg-red-200 text-red-800";
	}
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

const updateStatus = async (id: string, status: string) => {
	console.log("Mise à jour du statut : ${status} pour ID ${id");
	await proformaStore.updateStatus(id, status); // PATCH
	await proformaStore.fetchProforma();
	proformas.value = proformaStore.proforma;
	computeStats();
};
function viewProforma(proforma: Proforma) {
	selectedProforma.value = proforma;
	showModal.value = true;
}
function closeModal() {
	showModal.value = false;
	selectedProforma.value = null;
}

function downloadProforma(proforma: Proforma) {
	proformaStore.downloadProforma(proforma);
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
	}).format(amount);
}

const formatDate = (date: string): string => new Date(date).toLocaleDateString();

const filterProformas = () => {
	if (!searchQuery.value.trim()) {
		filteredProformas.value = [...proformas.value];
		return;
	}

	const query = searchQuery.value.toLowerCase().trim();
	filteredProformas.value = proformas.value.filter((proforma) => {
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
	const items = searchQuery.value ? filteredProformas.value : proformas.value;
	stats.value.total = items.length;
	stats.value.draft = items.filter((p) => p.status === "draft").length;
	stats.value.validated = items.filter((p) => p.status === "validated").length;
	stats.value.rejected = items.filter((p) => p.status === "rejected").length;
};
</script>
