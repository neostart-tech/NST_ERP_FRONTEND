<template>
	<div v-if="showCreateForm" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
		aria-modal="true">
		<div class="flex items-center justify-center min-h-screen pt-4 px-4 mx-3 pb-20 text-center sm:block sm:p-0">
			<!-- Background overlay -->
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
				@click="showCreateForm = false"></div>

			<!-- Modal panel -->
			<div
				class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
				<div class="bg-white px-6 pt-5 pb-4">
					<!-- Header -->
					<div class="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-500 to-green-500 p-2">
						<h2 class="text-lg font-semibold text-white flex items-center gap-2">
							<i class="fas fa-file-invoice"></i> Nouveau Devis
						</h2>
						<button @click="showCreateForm = false" class="text-white">
							<Icon name="heroicons:x-mark" class="w-6 h-6" />
						</button>
					</div>

					<!-- Formulaire de création -->
					<form id="quoteForm" @submit.prevent="createQuote" class="space-y-6 max-h-[70vh] overflow-y-auto px-2">
						<!-- Informations client et date -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block font-medium mb-1">Client *</label>
								<select v-model="newQuote.client_id" required
									class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500"
									:disabled="isClientLoading">
									<option value="">Sélectionner un client</option>
									<option v-for="client in clients" :key="client.id" :value="client.id">
										{{ getClientName(client) }}
									</option>
								</select>
								<!-- Messages d'état du chargement -->
								<p v-if="isClientLoading" class="text-sm text-gray-500 mt-2">
									<i class="fas fa-spinner fa-spin mr-2"></i>Chargement des clients...
								</p>
								<p v-if="clients.length === 0 && !isClientLoading" class="text-sm text-red-500 mt-2">
									<i class="fas fa-exclamation-triangle mr-2"></i>
									Aucun client disponible. Veuillez d'abord créer un client.
								</p>
							</div>
							<div>
								<label class="block font-medium mb-1">Date *</label>
								<input v-model="newQuote.date" type="date" required
									class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500">
							</div>
						</div>

						<!-- Statut et validité -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block font-medium mb-1">Statut *</label>
								<select v-model="newQuote.status" required
									class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500">
									<option value="Brouillon">Brouillon</option>
									<option value="Envoyé">Envoyé</option>
									<option value="Accepté">Accepté</option>
									<option value="Refusé">Refusé</option>
									<option value="Facturé">Facturé</option>
								</select>
							</div>
							<div>
								<label class="block font-medium mb-1">Validité (jours) *</label>
								<input v-model.number="(newQuote as any).validity_days" type="number" min="1" required
									class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500">
							</div>
						</div>

						<!-- Taux de TVA -->
						<div>
							<label class="block font-medium mb-1">Taux de TVA (%) *</label>
							<input v-model.number="(newQuote as any).vat_rate" type="number" step="0.01" min="0" required
								class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500">
						</div>

						<!-- Notes supplémentaires -->
						<!-- <div>
							<label class="block font-medium mb-1">Notes</label>
							<textarea v-model="newQuote.notes" rows="4"
								class="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-indigo-500"
								placeholder="Notes supplémentaires..."></textarea>
						</div> -->

						<!-- Conditions générales et modalités -->
						<!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block font-medium mb-1">Conditions générales</label>
								<textarea v-model="newQuote.terms_conditions" rows="3"
									class="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-indigo-500"
									placeholder="Conditions générales..."></textarea>
							</div>
							<div>
								<label class="block font-medium mb-1">Modalités de paiement</label>
								<textarea v-model="newQuote.payment_terms" rows="3"
									class="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-indigo-500"
									placeholder="Modalités de paiement..."></textarea>
							</div>
						</div> -->

						<!-- Section des articles -->
						<div>
							<div class="flex justify-between items-center mb-3">
								<h3 class="font-semibold text-lg">Articles</h3>
								<button type="button" @click="addNewItem"
									class="px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
									<i class="fas fa-plus mr-2"></i>
									Ajouter un article
								</button>
							</div>

							<div v-if="newQuote.items.length === 0"
								class="py-8 text-center border-2 border-dashed border-gray-300 rounded text-gray-500">
								Aucun article ajouté.
							</div>

							<div v-for="(item, index) in newQuote.items" :key="index" class="border p-2 rounded mb-4 bg-gray-50">
								<div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
									<div class="md:col-span-5">
										<label class="block text-sm font-medium mb-1">Désignation</label>
										<select v-model="(item as any).articleId" @change="onProductChange(index, newQuote)" required
											class="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500">
											<option value="">Sélectionner un produit</option>
											<option v-for="product in getAvailableProducts((item as any).articleId, newQuote)"
												:key="product.id" :value="product.id">
												{{ product.name }} - {{ formatCurrency(product.unit_price_sale) }}
											</option>
										</select>
									</div>
									<div class="md:col-span-2">
										<label class="block text-sm font-medium mb-1">Quantité</label>
										<input type="number" v-model.number="(item as any).quantity" min="1" required
											class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500" />
									</div>
									<div class="md:col-span-2">
										<label class="block text-sm font-medium mb-1">Prix unitaire </label>
										<input type="number" v-model.number="(item as any).unit_price" required
											class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500" />
									</div>
									<div class="md:col-span-2 flex flex-col items-center">
										<label class="block text-sm font-medium mb-1">Total </label>
										<div class="bg-white border border-gray-300 rounded px-3 py-2 w-full text-center font-semibold">
											{{ formatCurrency(((item as any).quantity || 0) * ((item as any).unit_price || 0)) }}
										</div>
									</div>
									<div class="md:col-span-1 flex justify-center">
										<button type="button" @click="removeNewItem(index)" class="text-red-600 hover:text-red-800 p-2"
											title="Supprimer cet article">
											<i class="fas fa-trash text-sm"></i>
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Totaux -->
						<div v-if="newQuote.items.length > 0"
							class="p-3 text-right border-2 border-dashed border-gray-300 rounded text-gray-500">
							<div class="text-md italic">Total HT : {{ formatCurrency(calculateSubtotal(newQuote.items)) }}</div>
							<div class="text-md italic">TVA ({{ (newQuote as any).vat_rate }}%) : {{ formatCurrency(calculateVAT(newQuote.items,
								(newQuote as any).vat_rate)) }}</div>
							<div class="text-md italic text-lg font-bold">Total TTC : {{ formatCurrency(calculateTotal(newQuote.items,
								(newQuote as any).vat_rate)) }}</div>
						</div>
					</form>
				</div>
				<!-- Footer du modal (hors scroll) -->
				<div class="flex justify-end gap-4 px-6 py-4 border-t border-gray-300 bg-white">
					<button type="button" @click="showCreateForm = false"
						class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
						Annuler
					</button>
					<button type="submit" form="quoteForm" :disabled="creatingQuote || clients.length === 0"
						class="px-4 py-2 text-white rounded disabled:opacity-50 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
						{{ creatingQuote ? 'Création...' : 'Créer le devis' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { Client } from '~/models/Client';
import type { Quote } from '~/models/Quote';
import { useProductStore } from '@/stores/Stock/ProductStore'
import { storeToRefs } from 'pinia'

defineProps<{
	createQuote: () => Promise<void>;
	newQuote: Quote,
	isClientLoading: boolean;
	clients: Client[];
	getClientName: (client?: Client) => string;
	addNewItem: () => void;
	removeNewItem: (index: any) => void;
	formatCurrency: (amount: number) => string;
	calculateSubtotal: (items: Array<{ quantity: number; unit_price: number; }>) => number;
	calculateVAT: (items: Array<{ quantity: number; unit_price: number; }>, vatRate?: number) => number;
	calculateTotal: (items: Array<{ quantity: number; unit_price: number; }>, vatRate?: number) => number;
}>()
const showCreateForm = defineModel<boolean>('showCreateForm', { required: true })
const creatingQuote = defineModel<boolean>('creatingQuote', { required: true })

// Store pour les produits
const productStore = useProductStore();
const { products } = storeToRefs(productStore);

onMounted(() => {
	productStore.fetchAll()
})

const getAvailableProducts = (currentArticleId: any, quote: Quote) => {
	const selectedIds = (quote.items || [])
		.map((it: any) => it?.articleId)
		.filter((id: any) => Boolean(id))
	return (products.value || []).filter(
		(p: any) => p.id === currentArticleId || !selectedIds.includes(p.id)
	)
}

// Gestion du changement de produit
const onProductChange = (index: number, newQuote: Quote) => {
	const selectedId = (newQuote.items[index] as any)?.articleId
	const selectedProduct = products.value.find((product: any) => product.id === selectedId)
	if (selectedProduct) {
		const updatedItem: any = {
			...(selectedProduct as any),
			quantity: (newQuote.items[index] as any)?.quantity || 1,
			unit_price: parseFloat(selectedProduct.unit_price_sale.toString()) || 0,
			articleId: selectedId
		}
		newQuote.items[index] = updatedItem
	}
}
</script>
