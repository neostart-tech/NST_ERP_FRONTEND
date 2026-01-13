<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
		<!-- HEADER -->

		<!-- STATS -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Carte Total Proforma -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Commandes totales</p>
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
						<p class="text-3xl font-bold text-amber-900 mt-2">{{ stats.pending || 0 }}</p>
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
						<p class="text-3xl font-bold text-red-900 mt-2">{{ stats.canceled || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-red-500">
						<Icon name="heroicons:x-circle" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>
		</div>

		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-xl font-bold text-gray-900">Liste des commandes</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Barre de recherche -->
				<div class="relative flex-grow">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input type="text" v-model="searchQuery" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400" />
				</div>
				<NuxtLink :to="AppUrl.ADD_NEW_ORDER"
					class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all mouse">
					<Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
					Nouvelle commande
				</NuxtLink>
			</div>
		</div>

		<template v-if="orders.length > 0">
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
							<tr v-for="order in paginatedOrders" :key="order.id + '-table'"
								class="hover:bg-gray-50 transition-colors duration-150">
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{{ order.reference }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">
										{{ getClientName(order.client) }}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="text-sm text-gray-900 truncate" :title="order.comment">{{ order.comment || "-" }}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{{ order.total_ttc.toLocaleString() }} F CFA
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span :class="resolveStatusColor(order.status)"
										class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
										{{ translateStatus(order.status!) }}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{{ formatDate(order.created_at!) }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button v-if="order.status === 'pending'" @click="updateStatus(order, 'delivered')"
										class="text-green-600 hover:text-green-900 mr-3" title="Valider">
										<Icon name="heroicons:check-circle" class="w-5 h-5" />
									</button>
									<button v-if="order.status === 'pending'" @click="updateStatus(order, 'canceled')"
										class="text-red-600 hover:text-red-900 mr-3" title="Rejeter">
										<Icon name="heroicons:x-circle" class="w-5 h-5" />
									</button>
									<NuxtLink :to="AppUrl.parameterize(AppUrl.ORDER_SHOW, order.id)"
										title="Voir" class="text-gray-600 hover:text-gray-900 mr-3">
										<Icon name="heroicons:eye" class="w-5 h-5" />
									</NuxtLink>
									<!-- <button @click="downloadProforma(order)" title="Télécharger"
										class="text-blue-600 hover:text-blue-900 mr-3">
										<Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
									</button> -->
									<button @click="deleteOrder(order)" title="Supprimer" class="text-red-600 hover:text-red-900">
										<Icon name="heroicons:trash" class="w-5 h-5" />
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
			<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
				<div v-for="orders in paginatedOrders" :key="orders.id + '-card'"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
					<div class="p-4">
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">{{ orders.reference }}</h3>
								<p class="text-sm text-gray-600 mt-1">{{ getClientName(orders.client) }}</p>
							</div>
							<span :class="resolveStatusColor(orders.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
								{{ translateStatus(orders.status) }}
							</span>
						</div>

						<div class="mt-3 space-y-2">
							<div class="text-sm text-gray-600">
								<span class="font-medium">Objet:</span> {{ orders.comment || "-" }}
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-600">
									<Icon name="heroicons:calendar" class="w-4 h-4 inline mr-1" />
									{{ formatDate(orders.created_at!) }}
								</span>
								<span class="font-semibold text-gray-900">
									{{ orders.total_ttc.toLocaleString() }} F CFA
								</span>
							</div>
						</div>

						<div class="flex justify-between mt-4 pt-3 border-t border-gray-100">
							<div class="flex gap-2">
								<button v-if="orders.status === 'pending'" @click.stop="updateStatus(orders, 'delivered')"
									class="p-1.5 text-green-600 hover:bg-green-50 rounded-full" title="Valider">
									<Icon name="heroicons:check-circle" class="w-5 h-5" />
								</button>
								<button v-if="orders.status === 'pending'" @click.stop="updateStatus(orders, 'canceled')"
									class="p-1.5 text-red-600 hover:bg-red-50 rounded-full" title="Rejeter">
									<Icon name="heroicons:x-circle" class="w-5 h-5" />
								</button>
							</div>
							<div class="flex gap-2">
								<NuxtLink :to="AppUrl.parameterize(AppUrl.ORDER_SHOW, orders.id)"
									class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full" title="Voir les détails">
									<Icon name="heroicons:eye" class="w-5 h-5" />
								</NuxtLink>
								<!-- <button @click.stop="downloadProforma(orders)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
									title="Télécharger">
									<Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
								</button> -->
								<button @click="deleteOrder(orders)" title="Supprimer"
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
		<div v-if="isLoading || orders.length == 0 || filteredOrders.length == 0">
			<EmptyState title="Aucune commande trouvée" description="Il n'y a actuellement aucune commande à afficher."
				icon="heroicons:cpu-chip" iconColor="text-blue-400" @reload="loadData" :isLoading="isLoading"
				:searchQuery="searchQuery" />
		</div>

		<!-- Pagination -->
		<div v-if="filteredOrders.length > 0" class="mt-6">
			<Paginator :totalItems="filteredOrders.length" @range-changed="onRangeChanged" />
		</div>
	</div>
</template>

<script setup lang="ts">
useHead({
	title: "Gestion des proforma"
});
import { ref, onMounted } from "vue";
import { getClientName } from "~/models/Client";
import Paginator from "@/components/Paginator.vue";
import EmptyState from "@/components/EmptyState.vue";
import Swal from "sweetalert2";
import { useOrderStore } from "@/stores/Sale/OrderStore";
import type { Order } from "~/models/Invoice";

const orderStore = useOrderStore();

const searchQuery = ref("");
const { orders, isLoading, validationErrors } = storeToRefs(orderStore);

// Pagination
const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const paginatedOrders = computed(() => {
	return filteredOrders.value.slice(range.start - 1, range.end)
});

onMounted(async () => {
	await loadData();
});

const loadData = async () => {
	try {
		await orderStore.fetchAll();
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Erreur lors du chargement des données",
			text: "Une erreur est survenue lors du chargement des commandes"
		});
	}
}

const badgeClass = (status: string) => {
	return {
		"bg-yellow-200 text-yellow-800": status === "pending",
		"bg-green-200 text-green-800": status === "delivered",
		"bg-red-200 text-red-800": status === "canceled",
	};
};

const statusColor = (status: string) => {
	switch (status) {
		case "pending":
			return "bg-yellow-200 text-yellow-100";
		case "delivered":
			return "bg-green-200 text-green-800";
		case "canceled":
			return "bg-red-200 text-red-800";
	}
};

const translateStatus = (status: string) => {
	switch (status) {
		case "pending":
			return "Non Validée";
		case "delivered":
			return "Validée";
		case "canceled":
			return "Rejetée";
	}
};

const deleteOrder = (order: Order) => {
	Swal.fire({
		icon: "info",
		title: "Suppression de la commande",
		html: `Voulez-vous vraiment supprimer la commande <strong>${order.reference}</strong> ?`,
		showCancelButton: true,
		confirmButtonText: "Oui",
		cancelButtonText: "Non",
		confirmButtonColor: "#F87171",
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await orderStore.delete(order.id);
				Swal.fire({
					icon: "success",
					title: "Suppression effectuée",
					html: `La commande <strong>${order.reference}</strong> a été supprimée avec succès.`,
				});
			} catch (error) {
				Swal.fire({
					icon: "error",
					title: "Une erreur est survenue",
					html: `Une erreur est survenue lors de la suppression de la commande <strong>${order.reference}</strong>.`,
				});
			}
		}
	});
}

const updateStatus = async (order: Order, status: string) => {
	Swal.fire({
		icon: "info",
		title: "Mise à jour du statut",
		html: `Voulez-vous vraiment mettre à jour le statut de la commande <strong>${order.reference}</strong> ?`,
		showCancelButton: true,
		confirmButtonText: "Oui",
		cancelButtonText: "Non"
	}).then(async result => {
		if (result.isConfirmed) {
			await performStatusUpdate(order, status);
		}
	});
};

const performStatusUpdate = async (order: Order, status: string) => {
	try {
		await orderStore.updateStatus(order.id, status);
		Swal.fire({
			icon: "success",
			title: "Mise à jour du statut",
			html: `Le statut de la commande <strong>${order.reference}</strong> a été mis à jour avec succès.`,
		});
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Erreur lors de la mise à jour du statut",
			html: `Une erreur est survenue lors de la mise à jour du statut de la commande <strong>${order.reference}</strong>. <br>
				Contenu du message: <i>${validationErrors.value._message}</i>`,
		});
	}
}

const filteredOrders = computed(() => {
	return orders.value.filter((_) => {
		const query = searchQuery.value.toLowerCase().trim();
		const clientName = (!!_.client) ? getClientName(_.client) : "";
		return (
			_.reference?.toLowerCase().includes(query) ||
			_.comment?.toLowerCase().includes(query) ||
			clientName.toLowerCase().includes(query) ||
			_.status?.toLowerCase().includes(query)
		);
	});
});


const stats = computed(() => ({
	total: orders.value.length || 0,
	pending: orders.value.filter(_ => _.status === "pending").length || 0,
	validated: orders.value.filter(_ => _.status === "delivered").length || 0,
	canceled: orders.value.filter(_ => _.status === "canceled").length || 0,
}));
</script>
