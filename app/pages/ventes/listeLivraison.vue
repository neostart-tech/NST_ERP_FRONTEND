<template>
	<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<!-- En-tête avec titre -->
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-gray-900">Suivi des Bordereaux de Livraison</h1>
		</div>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
		<!-- Carte Total Livraisons -->
		<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-blue-900">Total Livraisons</p>
					<p class="text-3xl font-bold text-blue-900 mt-2">150</p>
				</div>
				<div class="p-3 rounded-lg bg-blue-500">
					<Icon name="heroicons:truck" class="w-6 h-6 text-white" />
				</div>
			</div>
		</div>

		<!-- Carte Livraisons Effectuées -->
		<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-green-900">Effectuées</p>
					<p class="text-3xl font-bold text-green-900 mt-2">120</p>
				</div>
				<div class="p-3 rounded-lg bg-green-500">
					<Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
				</div>
			</div>
		</div>

		<!-- Carte En Cours -->
		<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-amber-900">En Cours</p>
					<p class="text-3xl font-bold text-amber-900 mt-2">25</p>
				</div>
				<div class="p-3 rounded-lg bg-amber-500">
					<Icon name="heroicons:clock" class="w-6 h-6 text-white" />
				</div>
			</div>
		</div>

		<!-- Carte Retards -->
		<div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-red-900">Retards</p>
					<p class="text-3xl font-bold text-red-900 mt-2">5</p>
				</div>
				<div class="p-3 rounded-lg bg-red-500">
					<Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-white" />
				</div>
			</div>
		</div>
	</div>

	<div class="flex justify-between items-center mb-6">
		<h2 class="text-xl font-semibold text-gray-800">Liste des Bordereaux</h2>
		<select v-model="filterType"
			class="border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
			<option value="">Tous les types</option>
			<option value="complete">Livraison Complète</option>
			<option value="partial">Livraison Partielle</option>
		</select>
	</div>

	<div class="bg-white shadow-lg rounded-lg overflow-x-auto">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gradient-to-r from-blue-50 to-blue-100">
				<tr>
					<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
						Client
					</th>
					<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
						Commande
					</th>
					<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
						Type
					</th>
					<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
						Date
					</th>
					<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
						Adresse
					</th>
					<th scope="col" class="px-4 py-4 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="delivery in filteredDeliveries" :key="delivery.id" class="hover:bg-gray-50 border-b border-gray-200">
					<td class="p-3 text-center border border-gray-200"></td>
					<td class="p-3 text-center border border-gray-200"></td>
					<td class="p-3 text-center border border-gray-200">
						<span class="px-2 py-1 rounded text-xs font-bold">
							{{ translateDeliveryType(delivery.delivery_type) }}
						</span>
					</td>
					<td class="p-3 text-center border border-gray-200">
						{{ formatDate(delivery.delivery_date) }}
					</td>
					<td class="p-3 text-center border border-gray-200">
						{{ delivery.delivery_address }}
					</td>
					<td class="p-3 text-center space-x-2">
						<button @click="viewDetails(delivery)" title="Voir"
							class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
							<i class="fas fa-eye"></i>
						</button>
						<button @click="downloadDelivery(delivery)" title="Télécharger"
							class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out">
							<i class="fas fa-download"></i>
						</button>
					</td>
				</tr>
				<tr v-if="filteredDeliveries.length === 0">
					<td colspan="5" class="text-center p-4 text-gray-500">
						Aucune livraison trouvée.
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div v-if="showModal && selectedDelivery"
		class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
		<div class="bg-white rounded-lg shadow-xl w-3/4 max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
			<h2 class="text-2xl font-bold mb-4 text-indigo-700">
				Détails du Bordereau
			</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
				<!-- <p><strong>Commande :</strong> {{ selectedDelivery.order.reference }}</p> -->
				<!-- <p><strong>Client :</strong> {{ selectedDelivery.order.client.name }} </p> -->
				<p>
					<strong>Date :</strong>
					{{ formatDate(selectedDelivery.delivery_date) }}
				</p>
				<p>
					<strong>Adresse :</strong> {{ selectedDelivery.delivery_address }}
				</p>
				<p>
					<strong>Type :</strong>
					<span :class="deliveryTypeClass(selectedDelivery.delivery_type)" class="px-2 py-1 rounded text-xs font-bold">
						{{ translateDeliveryType(selectedDelivery.delivery_type) }}
					</span>
				</p>
			</div>

			<h3 class="text-lg font-semibold mt-4 mb-2">Articles Livrés</h3>
			<div class="bg-white border p-4 rounded-lg shadow mt-6">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Désignation
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Code
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Numéro Série
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Qté Livrée
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="article in selectedDelivery.items" :key="article.id" class="border-t">
								<td class="p-2 border text-center">
									{{ article.designation }}
								</td>
								<td class="p-2 border text-center">
									{{ article.product_code }}
								</td>
								<td class="p-2 border text-center">
									{{ article.serial_number }}
								</td>
								<td class="p-2 text-center border">
									{{ article.quantity_delivered }}
								</td>
							</tr>
							<tr v-if="
								!selectedDelivery.items || selectedDelivery.items.length === 0
							">
								<td colspan="4" class="text-center p-4 text-gray-500">
									Aucun article livré.
								</td>
							</tr>
						</tbody>
					</table>
					<div class="mt-6 text-right flex justify-between">
						<button @click="downloadDelivery(selectedDelivery)" title="Télécharger"
							class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
							<i class="fas fa-download"></i>
						</button>
						<button @click="closeModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useDeliveryStore } from "@/stores/Sale/DeliveryStore";

const filterType = ref("");
const selectedDelivery = ref(null);
const showModal = ref(false);

const deliveryStore = useDeliveryStore();
const { deliveries, isLoading } = storeToRefs(deliveryStore);

onMounted(() => {
	deliveryStore.fetchAll();
});

const stats = computed(() => {
	return {
		total: deliveries.value.length,
		complete: deliveries.value.filter((d) => d.delivery_type === "complete")
			.length,
		partial: deliveries.value.filter((d) => d.delivery_type === "partial").length,
	};
});

const filteredDeliveries = computed(() => {
	if (!filterType.value) {
		return deliveries.value;
	}
	return deliveries.value.filter(_ => _.delivery_type === filterType.value);
});

const deliveryTypeClass = (type) => {
	switch (type) {
		case "complete":
			return "bg-green-200 text-green-800";
		case "partial":
			return "bg-yellow-200 text-yellow-800";
		default:
			return "bg-gray-200 text-gray-800";
	}
};

const translateDeliveryType = (type) => {
	switch (type) {
		case "complete":
			return "Complète";
		case "partial":
			return "Partielle";
		default:
			return type;
	}
};

function viewDetails(delivery) {
	selectedDelivery.value = delivery;
	showModal.value = true;
}

function closeModal() {
	showModal.value = false;
	selectedDelivery.value = null;
}

function downloadDelivery(delivery) {
	deliveryStore.downloadDelivery(delivery);
}

const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR");
</script>
