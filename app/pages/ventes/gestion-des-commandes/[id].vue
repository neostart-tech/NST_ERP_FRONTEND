<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- En-tête de la page -->
		<div class="mb-6 md:flex md:items-center md:justify-end">
			<NuxtLink :to="AppUrl.ORDER_INDEX" class="inline-flex items-center justify-center
			   w-full md:w-auto
			   py-2 px-6
			   border border-transparent shadow-sm
			   text-sm font-medium rounded-lg text-white
			   bg-gradient-to-r from-blue-500 to-green-500
			   hover:from-blue-600 hover:to-green-600
			   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
			   disabled:opacity-50 transition-all">
				<Icon name="heroicons:arrow-left" class="-ml-1 mr-2 h-5 w-5" />
				Revenir à la liste
			</NuxtLink>
		</div>


		<div v-if="orderInfo" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

				<!-- Référence -->
				<div class="lg:col-span-2">
					<p class="text-sm font-medium text-blue-900">
						Commande n° <span class="font-bold">{{ orderInfo.reference }}</span>
					</p>
				</div>

				<!-- Source -->
				<div>
					<p class="text-sm font-medium text-blue-900">
						Source sélectionnée :
						<span class="font-bold">
							{{ orderInfo.sourceType === 'proforma' ? 'Proforma' : 'Client' }}
						</span>
					</p>
					<p v-if="orderInfo.sourceType === 'proforma'" class="text-sm text-blue-700 mt-1">
						Proforma n° <strong>{{ orderInfo.proformaReference }}</strong> —
						{{ orderInfo.proformaObject }}
					</p>
					<p v-else class="text-sm text-blue-700 mt-1">
						Client : <strong>{{ orderInfo.clientName }}</strong>
					</p>
				</div>

				<!-- Date / Statut -->
				<div>
					<p class="text-sm text-blue-700">
						<strong>Date :</strong> {{ orderInfo.date }}
					</p>
					<p class="text-sm text-blue-700 mt-1">
						<strong>Statut :</strong> {{ orderInfo.status }}
					</p>
				</div>

				<!-- Totaux -->
				<div>
					<p class="text-sm text-blue-900 font-semibold">
						Total HT : {{ orderInfo.total_ht }}
					</p>
					<p class="text-sm text-blue-900 font-semibold mt-1">
						Total TTC : {{ orderInfo.total_ttc }}
					</p>
				</div>

				<!-- Articles / Commentaire -->
				<div>
					<p class="text-sm text-blue-700">
						<strong>Articles :</strong> {{ orderInfo.articlesCount }}
					</p>
					<p class="text-sm text-blue-700 mt-1">
						<strong>Commentaire :</strong> {{ orderInfo.comment }}
					</p>
				</div>

			</div>
		</div>

		<!-- Articles Section -->
		<div class="mt-6">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-semibold text-gray-900">Articles</h3>
			</div>

			<!-- Affichage en cards pour petits écrans -->
			<div class="lg:hidden space-y-3">
				<div v-for="(item, index) in orderArticles" :key="index"
					class="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">

					<!-- Désignation -->
					<div class="mb-3 relative">
						<label class="block text-xs text-gray-500 uppercase font-semibold mb-1">Désignation
						</label>
						<input :value="item.name" type="text" readonly
							class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all p-2 text-sm text-center" />
					</div>

					<!-- Quantité et Prix -->
					<div class="grid grid-cols-2 gap-3 mb-3">
						<div>
							<label class="block text-xs text-gray-500 uppercase font-semibold mb-1">Quantité</label>
							<input type="text" :value="item.quantity" readonly
								class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all p-2 text-sm text-center" />
						</div>
						<div>
							<label class="block text-xs text-gray-500 uppercase font-semibold mb-1">PU (F CFA)</label>
							<input type="text" min="0" :value="item.unitPrice" readonly
								class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all p-2 text-sm text-center" />
						</div>
					</div>

					<!-- Total -->
					<div class="flex justify-between items-center pt-3 border-t border-gray-300">
						<div>
							<p class="text-xs text-gray-500 uppercase font-semibold">Total</p>
							<p class="font-bold text-blue-600 text-lg">{{ formatCurrency(item.quantity * item.unitPrice) }}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Affichage en tableau pour grands écrans -->
			<div class="hidden lg:block overflow-x-auto rounded-lg border border-gray-300">
				<table class="w-full text-sm">
					<thead class="bg-gradient-to-r from-blue-50 to-green-50">
						<tr>
							<th class="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Désignation
							</th>
							<th class="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Quantité
							</th>
							<th class="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">PU (F CFA)
							</th>
							<th class="border-b border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Total (F CFA)</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in orderArticles" :key="index" class="hover:bg-gray-50 transition-colors"
							style="min-height: 64px;">
							<td class="border-b border-gray-200 px-4 py-4 relative">{{ item.name }}</td>

							<!-- Quantité -->
							<td class="border-b border-gray-200 px-4 py-4">{{ item.quantity }}</td>

							<!-- Prix unitaire -->
							<td class="border-b border-gray-200 px-4 py-4">{{ item.unitPrice }}</td>

							<!-- Total -->
							<td class="border-b border-gray-200 px-4 py-4 text-center font-semibold text-blue-600">
								{{ formatCurrency(item.quantity * item.unitPrice) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Totaux -->
		<div v-if="orderArticles.length > 0" class="mt-6 flex justify-end">
			<div class="w-full max-w-sm space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
				<div class="flex justify-between text-sm text-gray-600">
					<span class="font-medium">Sous-total :</span>
					<span class="font-semibold">{{ formatCurrency(subtotal) }}</span>
				</div>
				<div class="flex justify-between text-sm text-gray-600">
					<span class="font-medium">TVA ({{ taux }}%) :</span>
					<span class="font-semibold">{{ formatCurrency(tvaAmount) }}</span>
				</div>
				<div class="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
					<span>Total TTC :</span>
					<span class="text-blue-600">{{ formatCurrency(total) }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useOrderStore } from '@/stores/Sale/OrderStore'
import { getClientName } from '~/models/Client'
import type { Order } from '~/models/Invoice'

const route = useRoute();

const taux = 18;

const orderStore = useOrderStore()
const order = ref<Order | null>(null);

const orderInfo = computed(() => {
	if (!order.value) return null;
	const sourceType = order.value.proforma ? 'proforma' : 'client';

	return {
		sourceType,
		reference: order.value.reference,
		proformaReference: order.value.proforma?.reference || '',
		proformaObject: order.value.proforma?.object || '',
		clientName: getClientName(order.value.client),
		date: formatDate(order.value.created_at!),
		status: order.value.status,
		total_ttc: formatCurrency(order.value.total_ttc),
		total_ht: formatCurrency(order.value.total_ht),
		comment: order.value.comment || '-',
		articlesCount: order.value.articles?.length ?? 0
	};
});

const orderArticles = computed(() => {
	if (!order.value) return [];
	return order.value.articles.map(article => ({
		name: article.name,
		quantity: article.pivot?.quantity || 0,
		unitPrice: article.pivot?.unit_price || 0,
		articleId: article.id,
	}));
});

function formatCurrency(amount: number) {
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'XOF',
	}).format(amount)
}

// Calculs des totaux
const subtotal = computed(() =>
	orderArticles.value.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0)
);

const tvaAmount = computed(() => subtotal.value * taux / 100);
const total = computed(() => subtotal.value + tvaAmount.value);


const orderId = computed(() => route.params.id || route.query.id)

// Charger les données de l'utilisateur
onMounted(async () => {
	Swal.fire({
		title: "Chargement en cours...",
		didOpen: () => {
			Swal.showLoading();
		},
		allowOutsideClick: false,
		allowEscapeKey: false
	});

	if (!orderId.value) {
		Swal.fire({
			icon: "error",
			title: "Erreur",
			text: "Aucun ID de commande fourni",
			allowOutsideClick: false,
			allowEscapeKey: false
		});
		return;
	}
	try {
		order.value = await orderStore.find(orderId.value!.toString());
		Swal.close();
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Erreur",
			text: "Erreur lors du chargement de l'utilisateur",
			allowOutsideClick: false,
			allowEscapeKey: false
		});
		console.error('Erreur lors du chargement de l\'utilisateur:', error)
	} finally {
	}
});
</script>
