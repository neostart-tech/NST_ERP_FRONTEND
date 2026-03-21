<template>
	<div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
		<div class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
			<h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
				Détails de la Commande
			</h2>

			<!-- Infos Commande -->
			<div class="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-gray-700">
				<p>
					<strong>Référence :</strong> {{ selectedOrder.reference }}
				</p>
				<p>
					<strong>Date :</strong> {{ formatDate(selectedOrder.created_at || selectedOrder.date) }}
				</p>
				<p>
					<strong>Statut :</strong>
					{{ translateStatus(selectedOrder.status) }}
				</p>
				<p>
					<strong>Objet :</strong> {{ selectedOrder.comment || "Non défini" }}
				</p>
				<p>
					<strong>Client :</strong> {{ getClientName(selectedOrder.client) }}
				</p>
			</div>

			<hr class="border-t-2 mt-4 mb-4" />

			<!-- Articles -->
			<div>
				<h3 class="font-semibold text-lg mb-2">Liste des articles choisis</h3>

				<!-- Affichage en cards pour petits écrans -->
				<div class="lg:hidden space-y-3">
					<div
						v-for="article in selectedOrder.articles"
						:key="article.id"
						class="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm"
					>
						<div class="mb-2">
							<p class="text-xs text-gray-500 uppercase font-semibold">Article</p>
							<p class="font-semibold text-gray-800">{{ article.name }}</p>
						</div>
						<div class="mb-2">
							<p class="text-xs text-gray-500 uppercase font-semibold">Description</p>
							<p class="text-sm text-gray-700">{{ article.description || "N/A" }}</p>
						</div>
						<div class="grid grid-cols-3 gap-2 text-sm">
							<div>
								<p class="text-xs text-gray-500 uppercase font-semibold">Quantité</p>
								<p class="font-medium">{{ article.pivot?.quantity || 0 }}</p>
							</div>
							<div>
								<p class="text-xs text-gray-500 uppercase font-semibold">Prix unit.</p>
								<p class="font-medium">{{ formatCurrency(article.pivot?.unit_price || 0) }}</p>
							</div>
							<div>
								<p class="text-xs text-gray-500 uppercase font-semibold">Total</p>
								<p class="font-semibold text-blue-600">
									{{ formatCurrency((article.pivot?.quantity || 0) * (article.pivot?.unit_price || 0)) }}
								</p>
							</div>
						</div>
					</div>

					<!-- Totaux en cards -->
					<div class="border-t-2 border-gray-300 pt-3 space-y-2">
						<div class="flex justify-between items-center bg-gray-100 p-3 rounded">
							<span class="font-bold text-gray-700">Total HT</span>
							<span class="font-bold text-gray-900">{{ formatCurrency(selectedOrder.total_ht) }}</span>
						</div>
						<div class="flex justify-between items-center bg-blue-50 p-3 rounded">
							<span class="font-bold text-blue-700">Total TTC</span>
							<span class="font-bold text-blue-900 text-lg">{{ formatCurrency(selectedOrder.total_ttc) }}</span>
						</div>
					</div>
				</div>

				<!-- Affichage en tableau pour grands écrans -->
				<div class="hidden lg:block overflow-x-auto">
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
							<tr v-for="article in selectedOrder.articles" :key="article.id" class="hover:bg-gray-50">
								<td class="border px-4 py-2">{{ article.name }}</td>
								<td class="border px-4 py-2">{{ article.description || "N/A" }}</td>
								<td class="border px-4 py-2 text-right">{{ article.pivot?.quantity || 0 }}</td>
								<td class="border px-4 py-2 text-right">{{ formatCurrency(article.pivot?.unit_price || 0) }}</td>
								<td class="border px-4 py-2 text-right">
									{{ formatCurrency((article.pivot?.quantity || 0) * (article.pivot?.unit_price || 0)) }}
								</td>
							</tr>
						</tbody>
						<tfoot class="bg-gray-50">
							<tr>
								<td colspan="4" class="text-right font-bold px-4 py-2">Total HT</td>
								<td class="text-right font-bold px-4 py-2">{{ formatCurrency(selectedOrder.total_ht) }}</td>
							</tr>
							<tr>
								<td colspan="4" class="text-right font-bold px-4 py-2">Total TTC</td>
								<td class="text-right font-bold px-4 py-2">{{ formatCurrency(selectedOrder.total_ttc) }}</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>

			<div class="mt-6 flex justify-between">
				<button
					@click="downloadOrder(selectedOrder)"
					class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-4 py-2 rounded shadow"
				>
					<i class="fas fa-download"></i> Imprimer
				</button>

				<button
					@click="closeModal"
					class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-4 py-2 rounded shadow"
				>
					Fermer
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getClientName } from "~/models/Client";
import { formatCurrency } from "~/models/Product";
import type { Order } from "~/models/Invoice";

defineProps<{
	showModal: boolean;
	selectedOrder: Order;
	translateStatus: (status: string) => string | undefined;
	downloadOrder: (order: Order) => void;
	closeModal: () => void;
}>();
</script>
