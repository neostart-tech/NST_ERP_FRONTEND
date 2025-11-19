<template>
	<div
		class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
	>
		<!-- En-tête avec titre et bouton -->
		<div
			class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
		>
			<h1 class="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
			<div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
						placeholder="Rechercher par référence, client..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						@input="filterOrders"
					/>
				</div>
				<NuxtLink
					:to="AppUrl.ORDER"
					class="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					<Icon name="heroicons:plus" class="h-4 w-4 mr-1.5" />
					Nouvelle commande
				</NuxtLink>
			</div>
		</div>

		<!-- Cartes de statistiques -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Carte Total Commandes -->
			<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-gray-100">
						<Icon name="heroicons:shopping-cart" class="h-6 w-6 text-gray-600"/>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-500">Total Commandes</p>
						<h3 class="text-2xl font-semibold text-gray-900">
							{{ stats.total || 0 }}
						</h3>
					</div>
				</div>
			</div>

			<!-- Carte En Cours -->
			<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-yellow-50">
						<Icon name="heroicons:arrow-path" class="h-6 w-6 text-yellow-600" />
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-500">En Cours</p>
						<h3 class="text-2xl font-semibold text-yellow-700">
							{{ stats.pending || 0 }}
						</h3>
					</div>
				</div>
			</div>

			<!-- Carte Livrées -->
			<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-green-50">
						<Icon name="heroicons:check-circle" class="h-6 w-6 text-green-600"/>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-500">Livrées</p>
						<h3 class="text-2xl font-semibold text-green-700">
							{{ stats.delivered || 0 }}
						</h3>
					</div>
				</div>
			</div>

			<!-- Carte Annulées -->
			<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-red-50">
						<Icon name="heroicons:x-circle" class="h-6 w-6 text-red-600" />
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-500">Annulées</p>
						<h3 class="text-2xl font-semibold text-red-700">
							{{ stats.canceled || 0 }}
						</h3>
					</div>
				</div>
			</div>
		</div>

		<div class="flex justify-between items-center mb-8">
			<div class="w-1/3">
				<label for="status-filter" class="sr-only">Filtrer par statut</label>
				<select
					id="status-filter"
					v-model="selectedStatus"
					class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
					<option value="">Tous les statuts</option>
					<option value="pending">En attente</option>
					<option value="delivered">Livrée</option>
					<option value="canceled">Annulée</option>
				</select>
			</div>
		</div>

		<div class="bg-white border p-4 rounded-lg shadow mt-6">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								REF
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Client
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Statut
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Actions
							</th>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Modifier Statut
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="order in filteredOrders"
							:key="order.id"
							class="hover:bg-gray-50"
						>
							<td class="border px-3 py-2 text-center"></td>
							<td class="border px-3 py-2 text-center"></td>
							<td class="border px-3 py-2 text-center">
								<span
									:class="statusClass(order.status)"
									class="px-2 py-1 rounded text-xs font-bold"
									>{{ translateStatus(order.status) }}</span
								>
							</td>
							<td class="border px-3 py-2 flex justify-center gap-2">
								<button
									@click="viewOrder(order)"
									title="Voir"
									class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out"
								>
									<i class="fas fa-eye"></i>
								</button>
								<!-- <button @click="downloadOrder(order)" title="Télécharger" class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out">
                <i class="fas fa-download"></i>
              </button>
              <button @click="editOrder(order.id)" title="Modifier" class="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100 transition duration-150 ease-in-out">
                <i class="fas fa-edit"></i>
              </button> -->
							</td>
							<td class="border px-3 py-2 text-center">
								<select
									v-model="order.status"
									@change="updateStatus(order.id, order.status)"
									class="text-sm border rounded px-2 py-1"
								>
									<option value="pending">En attente</option>
									<option value="delivered">Livrée</option>
									<option value="canceled">Annulée</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div
				v-if="filteredOrders.length === 0"
				class="text-center py-8 text-gray-500"
			>
				<p>Aucune commande trouvée.</p>
			</div>
		</div>

		<div
			v-if="showModal && selectedOrder"
			class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
		>
			<div class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
				<button
					@click="closeModal"
					class="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
				>
					<i class="fas fa-times"></i>
				</button>
				<h2 class="text-2xl font-bold mb-4 text-indigo-700">
					Détails de la Commande
				</h2>

				<div
					class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6"
				>
					<p><strong>Référence :</strong></p>
					<p><strong>Client :</strong> {{ selectedOrder.client.name }}</p>
					<p>
						<strong>Date :</strong> {{ formatDate(selectedOrder.created_at) }}
					</p>
					<p>
						<strong>Statut :</strong>
						<span :class="statusClass(selectedOrder.status)">{{
							translateStatus(selectedOrder.status)
						}}</span>
					</p>
					<p>
						<strong>Proforma associée :</strong>
						<span v-if="selectedOrder.proforma"
							>Oui ({{ selectedOrder.proforma.reference }})</span
						>
						<span v-else class="italic text-gray-500">Aucune</span>
					</p>
				</div>

				<h3 class="font-semibold text-lg mb-2">Articles de la commande</h3>
				<table class="w-full text-sm border">
					<thead class="bg-gray-100">
						<tr>
							<th class="px-4 py-2 text-left border">Article</th>
							<th class="px-4 py-2 text-left border">Description</th>
							<th class="px-4 py-2 text-right border">Quantité</th>
							<th class="px-4 py-2 text-right border">Prix Unitaire</th>
							<th class="px-4 py-2 text-right border">Total</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="article in selectedOrder.articles"
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
				</table>
				<div class="mt-6 flex justify-end">
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
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "#imports";
import Swal from "sweetalert2";

const router = useRouter();
const orderStore = useOrderStore();

const selectedOrder = ref(null);
const showModal = ref(false);
const selectedStatus = ref("");
const isLoading = ref(true);

onMounted(async () => {
	isLoading.value = true;
	await orderStore.fetchOrder();
	isLoading.value = false;
});

const stats = computed(() => {
	const allOrders = orderStore.commande;
	return {
		total: allOrders.length,
		pending: allOrders.filter((o) => o.status === "pending").length,
		delivered: allOrders.filter((o) => o.status === "delivered").length,
		canceled: allOrders.filter((o) => o.status === "canceled").length,
	};
});

const filteredOrders = computed(() => {
	if (!selectedStatus.value) {
		return orderStore.commande.map((order, index) => ({
			...order,
		}));
	}
	return orderStore.commande
		.filter((order) => order.status === selectedStatus.value)
		.map((order, index) => ({
			...order,
		}));
});

const updateStatus = async (orderId, newStatus) => {
	try {
		const confirm = await Swal.fire({
			title: "Confirmer la mise à jour",
			text: `Voulez-vous vraiment changer le statut en "${translateStatus(
				newStatus
			)}" ?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Oui, changer",
			cancelButtonText: "Annuler",
		});

		if (!confirm.isConfirmed) return;

		await orderStore.updateStatus(orderId, newStatus);
		Swal.fire("Succès", "Statut mis à jour avec succès.", "success");
	} catch (error) {
		console.error(error);
		Swal.fire("Erreur", "Impossible de mettre à jour le statut", "error");
	}
};

const viewOrder = (order) => {
	selectedOrder.value = order;
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
	selectedOrder.value = null;
};

const downloadOrder = (order) => {
	orderStore.downloadOrder(order);
};

const editOrder = (id) => {
	router.push(`/orders/${id}/edit`);
};

const statusClass = (status) => {
	switch (status) {
		case "pending":
			return "bg-yellow-200 text-yellow-800";
		case "canceled":
			return "bg-red-200 text-red-800";
		case "delivered":
			return "bg-green-200 text-green-800";
		default:
			return "bg-gray-200 text-gray-800";
	}
};

const translateStatus = (status) => {
	switch (status) {
		case "pending":
			return "En attente";
		case "canceled":
			return "Annulée";
		case "delivered":
			return "Livrée";
		default:
			return status;
	}
};

const formatCurrency = (amount) =>
	new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
		amount
	);
const formatDate = (date) => new Date(date).toLocaleDateString();
</script>
