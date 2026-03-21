<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Carte Total Factures -->
			<div
				class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Factures</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">
							{{ stats.total || 0 }}
						</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon
							name="heroicons:document-duplicate"
							class="w-6 h-6 text-white"
						/>
					</div>
				</div>
			</div>

			<!-- Carte Factures Payées -->
			<div
				class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200"
			>
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
			<div
				class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200"
			>
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
			<div
				class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200"
			>
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
					<select
						v-model="selectedStatus"
						class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					>
						<option value="">Tous les statuts</option>
						<option value="paid">Payée</option>
						<option value="pending">En attente</option>
						<option value="cancelled">Annulée</option>
					</select>
				</div>

				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs w-full md:w-auto">
					<div
						class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
					>
						<Icon
							name="heroicons:magnifying-glass"
							class="h-5 w-5 text-gray-400"
						/>
					</div>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
					/>
				</div>
				<!-- Bouton Nouveau -->
				<NuxtLink
					:to="AppUrl.INVOICE"
					class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all text-sm"
				>
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
					Nouvelle facture
				</NuxtLink>
			</div>
		</div>

		<!-- Loader -->
		<div v-if="isLoading" class="flex justify-center py-12">
			<div
				class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
			></div>
		</div>

		<template v-else-if="!error && filteredInvoices.length > 0">
			<!-- Desktop table -->
			<div
				class="hidden lg:block bg-white border rounded-lg shadow mt-6 overflow-hidden"
			>
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gradient-to-r from-blue-50 to-green-50">
						<tr>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider"
							>
								Facture
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 tracking-wider"
							>
								Client
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 tracking-wider"
							>
								Montant TTC
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 tracking-wider"
							>
								Date
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-left text-xs font-semibold text-blue-800 tracking-wider"
							>
								Statut
							</th>
							<th
								scope="col"
								class="px-4 py-4 text-right text-xs font-semibold text-blue-800 tracking-wider"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr
							v-for="invoice in filteredInvoices"
							:key="invoice.id"
							class="hover:bg-gray-50"
						>
							<td class="px-3 py-2 text-left">{{ invoice.reference }}</td>
							<td class="px-3 py-2 text-left">
								{{ getClientName(invoice.client) }}
							</td>
							<td class="px-3 py-2 text-left">
								<div>{{ formatCurrency(invoice.total) }}</div>
								<div class="text-xs text-gray-500 mt-1">
									Reste à payer: {{ formatCurrency(remainingFor(invoice)) }}
								</div>
							</td>
							<td class="px-3 py-2 text-left">
								{{ formatDate(invoice.date) }}
							</td>
							<td class="px-3 py-2 text-left">
								<span
									:class="badgeClass(getStatus(invoice))"
									class="px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center"
								>
									{{ getStatus(invoice) ? "Payée" : "Impayée" }}
								</span>
							</td>
							<td class="px-3 py-2 text-center relative">
								<button
									@click.stop="toggleActions(invoice.id)"
									:data-actions-button="invoice.id"
									class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
								>
									<span class="sr-only">Actions</span>
									<Icon
										name="heroicons-solid:ellipsis-horizontal"
										class="w-5 h-5"
									/>
								</button>

								<!-- Dropdown (téléporté) -->
								<teleport to="body">
									<div
										v-if="
											openActionsId === invoice.id &&
											dropdownPortal.id === invoice.id
										"
										:data-actions-dropdown="String(invoice.id)"
										:style="{
											position: 'fixed',
											top: dropdownPortal.top + 'px',
											left: dropdownPortal.left + 'px',
											width: '11rem',
										}"
										class="z-50 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden"
									>
										<ul class="divide-y divide-gray-100">
											<li>
												<button
													@click.stop="
														() => {
															viewInvoice(invoice);
															closeActions();
														}
													"
													class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
												>
													<Icon
														name="heroicons-solid:eye"
														class="w-4 h-4 inline mr-2"
													/>
													Voir
												</button>
											</li>
											<li>
												<button
													@click.stop="
														() => {
															downloadInvoice(invoice);
															closeActions();
														}
													"
													class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
												>
													<Icon
														name="heroicons-solid:arrow-down-tray"
														class="w-4 h-4 inline mr-2"
													/>
													Télécharger
												</button>
											</li>
											<li>
												<button
													@click.stop="
														() => {
															deleteInvoice(invoice);
															closeActions();
														}
													"
													class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
												>
													<Icon
														name="heroicons-solid:trash"
														class="w-4 h-4 inline mr-2"
													/>
													Supprimer
												</button>
											</li>
										</ul>
									</div>
								</teleport>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Mobile cards -->
			<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
				<div
					v-for="invoice in filteredInvoices"
					:key="invoice.id"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden bg-white"
				>
					<div class="p-4">
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">
									{{ invoice.reference }}
								</h3>
								<p class="text-sm text-gray-600 mt-1">
									{{ getClientName(invoice.client) }}
								</p>
							</div>
							<div class="ml-2 relative">
								<button
									@click.stop="toggleActions(invoice.id)"
									:data-actions-button="invoice.id"
									class="p-1 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
								>
									<Icon
										name="heroicons-solid:ellipsis-horizontal"
										class="w-5 h-5"
									/>
								</button>
								<teleport to="body">
									<div
										v-if="
											openActionsId === invoice.id &&
											dropdownPortal.id === invoice.id
										"
										:data-actions-dropdown="String(invoice.id)"
										:style="{
											position: 'fixed',
											top: dropdownPortal.top + 'px',
											left: dropdownPortal.left + 'px',
											width: '10rem',
										}"
										class="z-50 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden"
									>
										<ul class="divide-y divide-gray-100">
											<li>
												<button
													@click.stop="
														() => {
															viewInvoice(invoice);
															closeActions();
														}
													"
													class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
												>
													<Icon
														name="heroicons-solid:eye"
														class="w-4 h-4 inline mr-2"
													/>
													Voir
												</button>
											</li>
											<li>
												<button
													@click.stop="
														() => {
															downloadInvoice(invoice);
															closeActions();
														}
													"
													class="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
												>
													<Icon
														name="heroicons-solid:arrow-down-tray"
														class="w-4 h-4 inline mr-2"
													/>
													Télécharger
												</button>
											</li>
											<li>
												<button
													@click.stop="
														() => {
															deleteInvoice(invoice);
															closeActions();
														}
													"
													class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
												>
													<Icon
														name="heroicons-solid:trash"
														class="w-4 h-4 inline mr-2"
													/>
													Supprimer
												</button>
											</li>
										</ul>
									</div>
								</teleport>
							</div>
						</div>

						<div class="mt-3 space-y-2">
							<div class="text-sm text-gray-600">
								<span class="font-medium">Montant:</span>
								{{ formatCurrency(invoice.total) }}
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-600">{{
									formatDate(invoice.date)
								}}</span>
								<span
									:class="badgeClass(getStatus(invoice))"
									class="px-2 py-1 text-xs font-semibold rounded-full"
									>{{ invoice.status }}</span
								>
							</div>
						</div>

						<div
							class="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2"
						>
							<button
								@click.stop="viewInvoice(invoice)"
								class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
								title="Voir"
							>
								<Icon name="heroicons:eye" class="w-5 h-5" />
							</button>
							<button
								@click.stop="downloadInvoice(invoice)"
								class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
								title="Télécharger"
							>
								<Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- EmptyState -->
		<div v-else-if="(!isLoading && !error) || filteredInvoices.length == 0">
			<EmptyState
				title="Aucune facture trouvée"
				description="Il n'y a actuellement aucune facture à afficher."
				icon="heroicons:user-group"
				iconColor="text-indigo-400"
				@reload="invoiceStore.fetchAll()"
				:isLoading="isLoading"
				:searchQuery="searchQuery"
			/>
		</div>

		<!-- Modal details -->
		<div
			v-if="showModal && selectedInvoice"
			class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
		>
			<div
				class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
			>
				<button
					@click="closeModal"
					class="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
				>
					<Icon name="heroicons-solid:x-mark" class="w-5 h-5" />
				</button>
				<h2 class="text-2xl font-bold mb-4 text-indigo-700">
					Détails de la Facture
				</h2>

				<div
					class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6"
				>
					<p><strong>Référence :</strong> {{ selectedInvoice.reference }}</p>
					<p><strong>Date :</strong> {{ formatDate(selectedInvoice.date) }}</p>
					<p>
						<strong>Client :</strong>
						{{ getClientName(selectedInvoice?.client) }}
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
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Article
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Description
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Quantité
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Prix Unitaire
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Total
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="article in selectedInvoice.order.articles"
									:key="article.id"
									class="border-t"
								>
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
												article.pivot!.quantity * article.pivot!.unit_price,
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
					<button
						@click="closeModal"
						class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
					>
						Fermer
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/utils/currency-parser";
import { NumberToLetter } from 'convertir-nombre-lettre';

useHead({ title: "Récapitulatif des factures" });

import { ref, computed, onMounted, onBeforeUnmount } from "vue"; // ajouté onBeforeUnmount
import Swal from "sweetalert2";
import EmptyState from "~/app/components/EmptyState.vue";
import { useInvoiceStore } from "@/stores/Sale/InvoiceStore";
import { getStatus, type Invoice } from "~/models/Invoice";
import { getClientName } from "~/models/Client";

const invoiceStore = useInvoiceStore();
const selectedInvoice = ref<Invoice | undefined | null>();
const showModal = ref(false);
const error = ref(false);

const { invoices, isLoading } = storeToRefs(invoiceStore);

// New state for filtering and search
const searchQuery = ref("");
const selectedStatus = ref("");

// Actions menu state
const openActionsId = ref<number | string | null>(null);
const dropdownPortal = ref<{
	id: number | string | null;
	top: number;
	left: number;
}>({ id: null, top: 0, left: 0 });

const toggleActions = (id: number | string) => {
	if (openActionsId.value === id) {
		closeActions();
		return;
	}

	// calculer position du bouton
	const button = document.querySelector(
		`[data-actions-button=\"${id}\"]`,
	) as HTMLElement | null;
	const dropdownWidth = 176; // approx w-44
	const dropdownHeight = 150; // estimation
	let left = 8;
	let top = 8;

	if (button) {
		const rect = button.getBoundingClientRect();
		left = rect.right - dropdownWidth;
		if (left < 8) left = rect.left;
		if (left + dropdownWidth > window.innerWidth - 8)
			left = window.innerWidth - dropdownWidth - 8;

		if (window.innerHeight - rect.bottom < dropdownHeight) {
			// show above
			top = rect.top - dropdownHeight - 8;
		} else {
			// show below
			top = rect.bottom + 8;
		}
	}

	dropdownPortal.value = { id, top: Math.max(8, top), left: Math.max(8, left) };
	openActionsId.value = id;
};

const closeActions = () => {
	openActionsId.value = null;
	dropdownPortal.value = { id: null, top: 0, left: 0 };
};

// Click-away: fermer le dropdown si on clique en dehors (inclut teleportés)
const onDocumentClick = (e: MouseEvent) => {
	if (!openActionsId.value) return;

	const path = (e.composedPath && e.composedPath()) || (e as any).path || [];
	const clickedInsideDropdown = path.some(
		(el: any) =>
			el &&
			el.dataset &&
			(typeof el.dataset.actionsDropdown !== "undefined" ||
				typeof el.dataset.actionsButton !== "undefined"),
	);
	if (!clickedInsideDropdown) closeActions();
};

onMounted(async () => {
	await invoiceStore.fetchAll();
	document.addEventListener("click", onDocumentClick);

	console.log("Test:", NumberToLetter(12000000));

});

onBeforeUnmount(() => {
	document.removeEventListener("click", onDocumentClick);
});

const stats = computed(() => {
	const paidInvoices = invoices.value.filter((i) => i.status === "paid");
	const pendingInvoices = invoices.value.filter((i) => i.status === "pending");

	const paidAmount = paidInvoices.reduce(
		(sum, invoice) => sum + invoice.total,
		0,
	);

	const pendingAmount = pendingInvoices.reduce(
		(sum, invoice) => sum + invoice.total,
		0,
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
		(sum: number, article) =>
			sum + article.pivot!.quantity * article.pivot!.unit_price,
		0,
	);
});

const viewInvoice = (invoice: Invoice) => {
	selectedInvoice.value = invoice;
	console.log("SelectedInvoice:", selectedInvoice.value);
	showModal.value = true;
};

// helper to compute remaining per invoice
const remainingFor = (invoice: Invoice) => {
	const paidAttr = (invoice as any).payed;
	let paid = 0;
	if (typeof paidAttr === "number") paid = paidAttr;
	else if (paidAttr === true) paid = invoice.total;
	return Math.max(0, invoice.total - (paid || 0));
};

const closeModal = () => {
	showModal.value = false;
	selectedInvoice.value = null;
};

const downloadInvoice = async (_invoice: Invoice) => {
	try {
		await invoiceStore.generatePdf(_invoice);
	} catch (_) {
		Swal.fire({
			icon: "error",
			title: "Erreur",
			text: "La génération du PDF a échoué.",
		});
	}
};

const deleteInvoice = (invoice: Invoice) => {
	Swal.fire({
		icon: "warning",
		title: "Voulez-vous  supprimer cette facture ?",
		html: `Êtes-vous sûre de vouloir supprimer la facture <b>${invoice.reference}</b> ?`,
		showCancelButton: true,
		confirmButtonText: "Oui, supprimer",
		cancelButtonText: "Non, annuler",
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

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const badgeClass = (status: boolean) =>
	status ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800";
</script>
