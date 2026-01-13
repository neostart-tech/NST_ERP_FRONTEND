<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Carte Total Factures -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Factures</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">
							{{ stats.total || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:document-duplicate" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Factures Payées -->
			<div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-emerald-900">Factures Payées</p>
						<p class="text-3xl font-bold text-emerald-900 mt-2">
							{{ formatCurrency(stats.paidAmount) || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-emerald-500">
						<Icon name="heroicons:user" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte En Attente -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-amber-900">En Attente</p>
						<p class="text-3xl font-bold text-amber-900 mt-2">
							{{ formatCurrency(stats.pendingAmount) || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:clock" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Montant Total -->
			<div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-purple-900">Montant Total</p>
						<p class="text-3xl font-bold text-purple-900 mt-2">
							{{ formatCurrency(stats.totalAmount) }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-emerald-500">
						<Icon name="heroicons:user" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>
		</div>

		<!-- En-tête avec recherche et actions -->
		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-xl font-bold text-gray-900">Liste des factures</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<div class="relative flex-1 max-w-xs w-full md:w-auto">
					<select v-model="selectedStatus"
						class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
						<option value="">Tous les statuts</option>
						<option value="paid">Payée</option>
						<option value="pending">En attente</option>
						<option value="cancelled">Annulée</option>
					</select>
				</div>

				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs w-full md:w-auto">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400" />
				</div>
				<!-- Bouton Nouveau -->
				<NuxtLink :to="AppUrl.INVOICE"
					class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all text-sm">
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
					Nouvelle facture
				</NuxtLink>
			</div>
		</div>

		<!-- Loader -->
		<div v-if="isLoading" class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>

		<template v-else-if="!error && filteredInvoices.length > 0">
			<div class="bg-white shadow rounded overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gradient-to-r from-blue-50 to-blue-100">
						<tr>
							<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
								Facture
							</th>
							<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
								Client
							</th>
							<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
								Montant TTC
							</th>
							<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
								Date
							</th>
							<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-gray-50">
							<td class="border px-3 py-2 text-center">
								{{ invoice.reference }}
							</td>
							<td class="border px-3 py-2 text-center"></td>
							<td class="border px-3 py-2 text-center">
								{{ formatCurrency(invoice.total) }}
							</td>
							<td class="border px-3 py-2 text-center">
								{{ formatDate(invoice.date) }}
							</td>
							<td class="border px-3 py-2 flex justify-center gap-2">
								<button @click="viewInvoice(invoice)" title="Voir"
									class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
									<i class="fas fa-eye"></i>
								</button>
								<!-- <button @click="downloadInvoice(invoice)" title="Télécharger"
									class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out">
									<i class="fas fa-download"></i>
								</button> -->
								<button @click="deleteInvoice(invoice)" title="Télécharger"
									class="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition duration-150 ease-in-out">
									<i class="fas fa-trash"></i>
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				<div v-if="filteredInvoices.length === 0" class="text-center py-8 text-gray-500">
					<p>Aucune facture trouvée.</p>
				</div>
			</div>
		</template>

		<!-- EmptyState -->
		<div v-else-if="!isLoading && !error || filteredInvoices.length == 0">
			<EmptyState title="Aucune facture trouvée" description="Il n'y a actuellement aucune facture à afficher."
				icon="heroicons:user-group" iconColor="text-indigo-400" @reload="" :isLoading="isLoading"
				:searchQuery="searchQuery" />
		</div>

		<div v-if="showModal && selectedInvoice"
			class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
			<div class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
				<button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
					<i class="fas fa-times"></i>
				</button>
				<h2 class="text-2xl font-bold mb-4 text-indigo-700">
					Détails de la Facture
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
					<p><strong>Référence :</strong> {{ selectedInvoice.reference }}</p>
					<p><strong>Date :</strong> {{ formatDate(selectedInvoice.date) }}</p>
					<p>
						<strong>Client :</strong> {{ selectedInvoice && getClientName(selectedInvoice.client) }}
					</p>
					<p>
						<strong>Commande concernée:</strong>
						{{ selectedInvoice.order.reference }}
					</p>
					<p>
						<strong>Montant TTC:</strong>
						{{ formatCurrency(selectedInvoice.total) }}
					</p>
				</div>

				<div v-if="selectedInvoice.order.articles">
					<div class="overflow-x-auto">
						<table class="w-full text-sm border">
							<thead class="bg-gray-100">
								<tr>
									<th scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Article
									</th>
									<th scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Description
									</th>
									<th scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Quantité
									</th>
									<th scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Prix Unitaire
									</th>
									<th scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Total
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="article in selectedInvoice.order.articles" :key="article.id" class="border-t">
									<td class="px-4 py-2 border">{{ article.name }}</td>
									<td class="px-4 py-2 border">{{ article.description }}</td>
									<td class="px-4 py-2 text-right border">
										{{ article.pivot!.quantity }}
									</td>
									<td class="px-4 py-2 text-right border">
										{{ formatCurrency(article.pivot!.unit_price) }}
									</td>
									<td class="px-4 py-2 text-right border">
										{{
											formatCurrency(
												article.pivot!.quantity * article.pivot!.unit_price
											)
										}}
									</td>
								</tr>
							</tbody>
							<tfoot v-if="selectedInvoice">
								<tr>
									<td colspan="4" class="py-2 px-4 text-right font-bold border">
										Total HT
									</td>
									<td class="py-2 px-4 text-right font-bold border">
										{{ formatCurrency(totalHT) }}
									</td>
								</tr>
								<tr>
									<td colspan="4" class="py-2 px-4 text-right font-bold border">
										TVA (18%)
									</td>
									<td class="py-2 px-4 text-right font-bold border">
										{{ formatCurrency(totalHT * 0.18) }}
									</td>
								</tr>
								<tr>
									<td colspan="4" class="py-2 px-4 text-right font-bold border">
										Total TTC
									</td>
									<td class="py-2 px-4 text-right font-bold border">
										{{ formatCurrency(totalHT * 1.18) }}
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
				<div v-else class="text-sm text-gray-500 italic">
					Aucune proforma enregistrée.
				</div>

				<div class="mt-6 text-right flex justify-between">
					<!-- <button @click="downloadInvoice(selectedInvoice)"
						class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
						<i class="fas fa-download"></i> Imprimer
					</button> -->
					<button @click="closeModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
						Fermer
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
useSeoMeta({ title: "Récapitulatif des factures" });

import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import EmptyState from "~/app/components/EmptyState.vue";
import { useInvoiceStore } from "~/app/stores/sale/InvoiceStore";
import type { Invoice } from "~/models/Invoice";
import { getClientName } from "~/models/Client";

const invoiceStore = useInvoiceStore();
const selectedInvoice = ref<Invoice | undefined | null>();
const showModal = ref(false);
const error = ref(false);

const { invoices, isLoading } = storeToRefs(invoiceStore);

// New state for filtering and search
const searchQuery = ref("");
const selectedStatus = ref("");

onMounted(async () => {
	await invoiceStore.fetchAll();
});

const stats = computed(() => {
	const paidInvoices = invoices.value.filter((i) => i.status === "paid");
	const pendingInvoices = invoices.value.filter((i) => i.status === "pending");

	const paidAmount = paidInvoices.reduce(
		(sum, invoice) => sum + invoice.total,
		0
	);

	const pendingAmount = pendingInvoices.reduce(
		(sum, invoice) => sum + invoice.total,
		0
	);

	const totalAmount = paidAmount + pendingAmount;

	return {
		total: invoices.value.length,
		paidAmount,
		pendingAmount,
		totalAmount,
	};
});

const filteredInvoices = computed(() => {
	const query = searchQuery.value.toLowerCase().trim();
	const status = selectedStatus.value;

	return invoices.value.filter((invoice) => {
		const matchesSearch =
			!query ||
			invoice.reference.toLowerCase().includes(query) ||
			invoice.order.client.first_name.toLowerCase().includes(query) ||
			invoice.order.client.last_name.toLowerCase().includes(query);

		const matchesStatus = !status || invoice.status === status;

		return matchesSearch && matchesStatus;
	});
});

const totalHT = computed(() => {
	if (!selectedInvoice.value) return 0;
	return selectedInvoice.value.order.articles.reduce(
		(sum: number, article) => sum + article.pivot!.quantity * article.pivot!.unit_price,
		0
	);
});

const viewInvoice = (invoice: Invoice) => {
	selectedInvoice.value = invoice;
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
	selectedInvoice.value = null;
};

const downloadInvoice = (invoice: Invoice) => {
	// invoiceStore.downloadInvoice(invoice);
};

const deleteInvoice = (invoice: Invoice) => {
	Swal.fire({
		icon: "warning",
		title: "Voulez-vous  supprimer cette facture ?",
		html: `Êtes-vous sûre de vouloir supprimer la facture <b>${invoice.reference}</b> ?`,
		showCancelButton: true,
		confirmButtonText: "Oui, supprimer",
		cancelButtonText: "Non, annuler"
	}).then(async (result) => {
		if (result.isConfirmed) {
			try {
				await invoiceStore.delete(invoice.id);
				Swal.fire({
					icon: "success",
					title: "Facture supprimée",
					text: "La facture a été supprimée avec succès.",
				});
			} catch (_) {
				Swal.fire({
					icon: "error",
					title: "Erreur",
					html: `Une erreur est survenue lors de la suppression de la facture <b>${invoice.reference}</b>.`,
				});
			}
		}
	});
};

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
	}).format(amount);
};
</script>
