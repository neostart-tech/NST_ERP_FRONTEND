<template>
	<div class="p-6 space-y-6 max-w-7xl mx-auto">
		<div class="flex justify-between items-center">
			<h1 class="text-3xl font-extrabold text-gray-900">
				Gestion des Factures
			</h1>
			<NuxtLink
				:to="AppUrl.INVOICE"
				class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
			>
				<i class="fas fa-add"></i> Nouvelle facture
			</NuxtLink>
		</div>
		<!--
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gray-300 shadow rounded p-4 text-center">
        <i class="fas fa-file-invoice text-gray-500 text-3xl"></i>
        <p class="text-sm text-gray-500">Total Factures</p>
        <p class="text-2xl font-bold">{{ stats.total }}</p>
      </div>
      <div class="bg-green-200 shadow rounded p-4 text-center">
        <i class="fas fa-check-circle text-green-600 text-3xl"></i>
        <p class="text-sm text-gray-600">Payées</p>
        <p class="text-2xl font-bold text-green-700">{{ formatCurrency(stats.paidAmount) }}</p>
      </div>
      <div class="bg-yellow-200 shadow rounded p-4 text-center">
        <i class="fas fa-clock text-yellow-500 text-3xl"></i>
        <p class="text-sm text-gray-600">En attente</p>
        <p class="text-2xl font-bold text-yellow-700">{{ formatCurrency(stats.pendingAmount) }}</p>
      </div>
      <div class="bg-purple-200 shadow rounded p-4 text-center">
        <i class="fas fa-xof-sign text-purple-600 text-3xl"></i>
        <p class="text-sm text-gray-600">Montant Total</p>
        <p class="text-2xl font-bold text-purple-700">{{ formatCurrency(stats.totalAmount) }}</p>
      </div>
    </div> -->

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			<!-- Carte Total Factures -->

			<div
				class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Factures</p>
						<p class="text-3xl font-bold text-purple-600">
							{{ stats.total }}
						</p>
						<!-- <p class="text-xs text-gray-500 mt-1">+5% vs mois dernier</p> -->
					</div>
					<div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:sparkles" class="w-6 h-6 text-purple-600" />
					</div>
				</div>
			</div>

			<!-- Carte Factures Payées -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
				<div class="p-5">
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm font-medium text-gray-500 uppercase tracking-wider"
							>
								Payées
							</p>
							<p class="mt-2 text-2xl font-semibold text-green-600">
								{{ formatCurrency(stats.paidAmount) }}
							</p>
						</div>
						<div class="p-3 rounded-full bg-green-50 text-green-600">
							<i class="fas fa-check-circle text-xl"></i>
						</div>
					</div>
					<div class="mt-4 pt-4 border-t border-gray-100">
						<div class="flex items-center justify-between">
							<span class="text-xs font-medium text-gray-500">Statut</span>
							<span
								class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
							>
								{{
									Math.round(
										(stats.paidAmount / (stats.totalAmount || 1)) * 100
									) || 0
								}}%
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Carte En Attente -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
				<div class="p-5">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
								En attente
							</p>
							<p class="mt-2 text-2xl font-semibold text-amber-500">
								{{ formatCurrency(stats.pendingAmount) }}
							</p>
						</div>
						<div class="p-3 rounded-full bg-amber-50 text-amber-500">
							<i class="fas fa-clock text-xl"></i>
						</div>
					</div>
					<div class="mt-4 pt-4 border-t border-gray-100">
						<div class="flex items-center justify-between">
							<span class="text-xs font-medium text-gray-500">Statut</span>
							<span
								class="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800"
							>
								{{
									Math.round(
										(stats.pendingAmount / (stats.totalAmount || 1)) * 100
									) || 0
								}}%
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Carte Montant Total -->
			<div
				class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
			>
				<div class="p-5">
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm font-medium text-gray-500 uppercase tracking-wider"
							>
								Montant Total
							</p>
							<p class="mt-2 text-2xl font-semibold text-purple-600">
								{{ formatCurrency(stats.totalAmount) }}
							</p>
						</div>
						<div class="p-3 rounded-full bg-purple-50 text-purple-600">
							<i class="fas fa-xof-sign text-xl"></i>
						</div>
					</div>
					<div class="mt-4 pt-4 border-t border-gray-100">
						<div class="flex items-center justify-between">
							<span class="text-xs font-medium text-gray-500"
								>Toutes factures confondues</span
							>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col md:flex-row gap-4 items-center mb-6">
			<div class="relative w-full md:w-1/2">
				<div
					class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
				>
					<i class="fas fa-search text-gray-400"></i>
				</div>
				<input
					type="text"
					v-model="searchQuery"
					placeholder="Rechercher par référence, client..."
					class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
			</div>
			<div class="w-full md:w-1/4">
				<label for="status-filter" class="sr-only">Filtrer par statut</label>
				<select
					id="status-filter"
					v-model="selectedStatus"
					class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
					<option value="">Tous les statuts</option>
					<option value="paid">Payée</option>
					<option value="pending">En attente</option>
					<option value="partially_paid">Partiellement payée</option>
				</select>
			</div>
		</div>

		<div class="bg-white shadow rounded overflow-x-auto">
			<table class="w-full text-sm border border-gray-200">
				<thead class="bg-gray-100">
					<tr>
						<th class="px-3 py-2 border text-center">Facture</th>
						<th class="px-3 py-2 border text-center">Client</th>
						<th class="px-3 py-2 border text-center">Montant TTC</th>
						<th class="px-3 py-2 border text-center">Date</th>
						<th class="px-3 py-2 border text-center">Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="invoice in filteredInvoices"
						:key="invoice.id"
						class="hover:bg-gray-50"
					>
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
							<button
								@click="viewInvoice(invoice)"
								title="Voir"
								class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out"
							>
								<i class="fas fa-eye"></i>
							</button>
							<button
								@click="downloadInvoice(invoice)"
								title="Télécharger"
								class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out"
							>
								<i class="fas fa-download"></i>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
			<div
				v-if="filteredInvoices.length === 0"
				class="text-center py-8 text-gray-500"
			>
				<p>Aucune facture trouvée.</p>
			</div>
		</div>
	</div>

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
				<i class="fas fa-times"></i>
			</button>
			<h2 class="text-2xl font-bold mb-4 text-indigo-700">
				Détails de la Facture
			</h2>

			<div
				class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6"
			>
				<p><strong>Référence :</strong> {{ selectedInvoice.reference }}</p>
				<p><strong>Date :</strong> {{ formatDate(selectedInvoice.date) }}</p>
				<p><strong>Client :</strong> {{ selectedInvoice.order.client.name }}</p>
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
								<td class="px-4 py-2 border">{{ article.label }}</td>
								<td class="px-4 py-2 border">{{ article.description }}</td>
								<td class="px-4 py-2 text-right border">
									{{ article.pivot.quantity }}
								</td>
								<td class="px-4 py-2 text-right border">
									{{ formatCurrency(article.pivot.unit_price) }}
								</td>
								<td class="px-4 py-2 text-right border">
									{{
										formatCurrency(
											article.pivot.quantity * article.pivot.unit_price
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
					@click="downloadInvoice(selectedInvoice)"
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
<script setup>
import { ref, computed, onMounted } from "vue";
import { useInvoiceStore } from "#imports";
import Swal from "sweetalert2";

const invoiceStore = useInvoiceStore();
const selectedInvoice = ref();
const showModal = ref(false);
const isLoading = ref(true);

// New state for filtering and search
const searchQuery = ref("");
const selectedStatus = ref("");

onMounted(async () => {
	isLoading.value = true;
	await invoiceStore.fetchInvoice();
	isLoading.value = false;
});

const stats = computed(() => {
	const invoices = invoiceStore.facture;
	const paidInvoices = invoices.filter((i) => i.status === "paid");
	const pendingInvoices = invoices.filter((i) => i.status === "pending");

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
		total: invoices.length,
		paidAmount,
		pendingAmount,
		totalAmount,
	};
});

const filteredInvoices = computed(() => {
	const query = searchQuery.value.toLowerCase().trim();
	const status = selectedStatus.value;

	return invoiceStore.facture.filter((invoice) => {
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
		(sum, article) => sum + article.pivot.quantity * article.pivot.unit_price,
		0
	);
});

const viewInvoice = (invoice) => {
	selectedInvoice.value = invoice;
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
	selectedInvoice.value = null;
};

const downloadInvoice = (invoice) => {
	invoiceStore.downloadInvoice(invoice);
};

const formatCurrency = (amount) => {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
	}).format(amount);
};

const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR");
</script>
