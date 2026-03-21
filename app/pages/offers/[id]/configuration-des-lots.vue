<template>
	<div class="bg-white rounded-lg shadow overflow-hidden">
		<!-- Page Header -->
		<div class="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold text-gray-900">
					Configuration des lots
				</h2>
				<NuxtLink :to="AppUrl.OFFERS"
									class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
					<svg class="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
							 fill="currentColor">
						<path fill-rule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clip-rule="evenodd"/>
					</svg>
					Retour à la liste
				</NuxtLink>
			</div>
		</div>

		<!-- Content -->
		<div class="p-6">
			<!-- Offer Information -->
			<div class="bg-blue-50 rounded-lg p-6 mb-6">
				<h3 class="text-lg font-medium text-gray-900 mb-4">Informations de l'appel d'offre</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700">Référence</label>
						<p class="text-sm text-gray-900">{{ offerData.number }}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Titre</label>
						<p class="text-sm text-gray-900">{{ offerData.title }}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Date limite de soumission</label>
						<p class="text-sm text-gray-900">{{ formatDate(offerData.submission_deadline) }}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Budget estimé</label>
						<p class="text-sm text-gray-900">{{ formatCurrency(offerData.estimated_budget) }}</p>
					</div>
				</div>
			</div>

			<hr class="mb-3"/>

			<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
				<div>
					<h3 class="text-lg font-medium text-gray-900">Configuration des lots</h3>
					<p class="text-sm text-gray-600 mt-1">Définissez les lots, leurs caractéristiques et leurs prix</p>
				</div>
				<button @click="addNewLot"
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 md:flex-shrink-0">
					<Icon name="heroicons-solid:plus" class="-ml-1 mr-2 h-5 w-5"/>
					Ajouter un lot
				</button>
			</div>

			<div class="space-y-4">
				<div v-for="(lot, index) in lots" :key="lot.id" class="border border-gray-200 rounded-lg overflow-hidden">
					<!-- Collapse Header -->
					<div class="flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
							 @click="toggleLot(index)">
						<div class="flex items-center space-x-3">
							<svg class="w-5 h-5 text-gray-500 transition-transform duration-200"
									 :class="{ 'rotate-90': expandedLots[index] }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
							</svg>
							<h4 class="text-lg font-medium text-gray-900">Lot {{ index + 1 }}</h4>
							<span v-if="lot.name" class="text-sm text-gray-600">- {{ formatCurrency(lot.total_profit) }}</span>
						</div>
						<button @click.stop="removeLot(index)" class="text-red-600 hover:text-red-800" title="Supprimer ce lot">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
								</path>
							</svg>
						</button>
					</div>

					<!-- Collapse Content -->
					<div v-show="expandedLots[index]" class="p-6 bg-white border-t border-gray-200">
						<!-- Section Articles -->
						<div class="flex justify-between items-center mb-3">
							<h3 class="font-semibold text-lg">Articles du lot</h3>
							<button type="button" @click="addItemToLot(index)"
											class="px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
								<i class="fas fa-plus mr-1"></i> Ajouter un article
							</button>
						</div>

						<div v-if="lot.items.length === 0"
								 class="py-8 text-center border-2 border-dashed border-gray-300 rounded text-gray-500">
							Aucun article ajouté à ce lot.
						</div>

						<!-- Liste des articles -->
						<div v-for="(item, idx) in lot.items" :key="idx" class="border p-2 rounded mb-4 bg-gray-50">
							<div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
								<!-- Produit/Service -->
								<div class="md:col-span-5">
									<label class="block text-sm font-medium mb-1">Désignation</label>
									<select v-model="item.productId" @change="onProductChange(index, idx)" required
													class="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500">
										<option value="">Sélectionner un produit</option>
										<option v-for="product in products" :key="product.id" :value="product.id || item.productId">
											{{ product.name }} - {{ formatCurrency(product.unit_price_sale) }}
										</option>
									</select>
								</div>
								<!-- Quantité -->
								<div class="md:col-span-2">
									<label class="block text-sm font-medium mb-1">Quantité</label>
									<input type="number" v-model.number="item.quantity" min="1" required
												 class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500"/>
								</div>

								<!-- Prix unitaire HT -->
								<div class="md:col-span-2">
									<label class="block text-sm font-medium mb-1">Prix unitaire</label>
									<input type="number" v-model.number="item.unitPrice" required
												 class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500"/>
								</div>

								<!-- Total HT -->
								<div class="md:col-span-2 flex flex-col items-center">
									<label class="block text-sm font-medium mb-1">Total</label>
									<div
										class="bg-white border border-gray-300 rounded px-3 py-2 w-full text-center font-semibold">
										{{ formatCurrency(item.quantity * item.unitPrice) }}
									</div>
								</div>

								<!-- Supprimer -->
								<div class="md:col-span-1 flex justify-center">
									<button type="button" @click="removeItemFromLot(index, idx)"
													class="text-red-600 hover:text-red-800 p-2"
													title="Supprimer cet article">
										<i class="fas fa-trash text-sm"></i>
									</button>
								</div>
							</div>
						</div>

						<!-- Total du lot -->
						<div v-if="lot.items.length > 0" class="flex justify-end mt-4">
							<div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
								<span class="text-sm font-medium text-gray-700">Total du lot: </span>
								<span class="text-lg font-bold text-blue-600">{{ formatCurrency(getLotTotal(index) ?? 0) }}</span>
							</div>
						</div>

					</div>
				</div>
			</div>

			<div class="flex justify-end mt-3" v-if="lots.length === 0">
				<button @click="addNewLot"
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 md:flex-shrink-0">
					<Icon name="heroicons-solid:plus" class="-ml-1 mr-2 h-5 w-5"/>
					Ajouter un lot
				</button>
			</div>


			<!-- Summary -->
			<div class="bg-gray-50 rounded-lg p-6 mb-6 mt-3">
				<h3 class="text-lg font-medium text-gray-900 mb-4">Résumé global</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="bg-white p-4 rounded-lg border border-gray-200">
						<div class="text-center">
							<p class="text-sm font-medium text-gray-900">{{ lots.length }}</p>
							<p class="text-xs text-gray-500">Nombre de lots</p>
						</div>
					</div>

					<div class="bg-white p-4 rounded-lg border border-gray-200">
						<div class="text-center">
							<p class="text-sm font-medium text-green-600">{{ totalItems }}</p>
							<p class="text-xs text-gray-500">Nombre d'articles sélectionnés</p>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col md:flex-row md:justify-between gap-3 pt-6 border-t border-gray-200">
				<!-- Bouton gauche -->
				<button @click="navigateTo(`/offers/${offerId}/documents-availability`)" type="button"
								class="w-full md:w-auto inline-flex justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
					Retour aux documents
				</button>

				<!-- Groupe de boutons à droite -->
				<div class="flex flex-col w-full md:w-auto md:flex-row gap-3">
					<button @click="saveLotsConfiguration" type="button" :disabled="lots.length === 0"
									class="w-full md:w-auto inline-flex justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
						<Icon name="heroicons-solid:save" class="-ml-1 mr-2 h-5 w-5"/>
						Sauvegarder la configuration
					</button>

					<button v-if="lots.length > 0" @click="proceedToSubmission" type="button" disabled
									class="w-full md:w-auto inline-flex justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
						Procéder à la soumission
					</button>
				</div>
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
import {formatCurrency} from "@/utils/currency-parser";

definePageMeta({
	layout: 'default'
});

import {ref, computed, onMounted} from "vue";
import {useRouter} from '#app';
import Swal from 'sweetalert2';
import {defaultLotData, defaultOfferData, type Lot, type LotItem, type Offer} from "~/models/Offer";
import {useProductStore} from '@/stores/Stock/ProductStore';
import {formatDate} from "@/utils/dateParser";

const offerStore = useOfferStore();
const lotStore = useLotStore();
const productStore = useProductStore();
const {products} = storeToRefs(productStore);

// Route params
const navigateTo = useRouter().push;
const route = useRoute();
const offerId = route.params.id as string;

const isLoading = ref(true);
const offerData = ref<Offer>(defaultOfferData());

// Lots configuration
const lots = ref<Lot[]>([{...defaultLotData(), id: Date.now().toString(), name: "Lot 1", title: "Lot 1"}]);
const expandedLots = ref<Record<number, boolean>>({0: true});

const totalProfit = computed(() => {
	return lots.value.reduce((total, lot) => total + (lot.total_profit || 0), 0);
});

const loadOfferData = async () => {
	// Chargement des informations de l'offre
	try {
		offerData.value = await offerStore.getOneOffer(offerId);
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "Une erreur est survenue lors de la récupération de la données de l'offre",
			confirmButtonText: "Revenir en arrière",
			allowOutsideClick: false
		}).then(() => {
			window.history.back();
		});
		console.error('Erreur lors du chargement de l\'offre:', error);
	}
};

const toggleLot = (index: number) => {
	expandedLots.value[index] = !expandedLots.value[index];
};

const totalItems = computed(() => {
	return lots.value.reduce((sum, lot) => sum + (lot.items?.length || 0), 0);
});

const addNewLot = () => {
	const newIndex = lots.value.length;
	lots.value.push({...defaultLotData(), title: `Lot ${newIndex + 1}`});
	expandedLots.value[newIndex] = true;
	useAlert().showAlert("Nouveau lot ajouté", "info");
};

const removeLot = (index: number) => {
	Swal.fire({
		icon: "question",
		title: `Attention`,
		html: `Êtes-vous sûr de vouloir supprimer le lot N° ${index + 1} de désignation <b>${lots.value[index]!.name}</b> ?`,
		showCancelButton: true,
		confirmButtonText: "Supprimer",
		denyButtonText: `Annuler`
	}).then((result) => {
		if (result.isConfirmed) {
			deleteLot(index);
		}
	})
};

const deleteLot = async (index: number) => {
	const lot = lots.value.find(_ => _.id === lots.value[index]!.id);
	try {
		// Si lot a déjà été enregistré en BD, on fait une requête de suppression
		if (!lot?.isNew)
			await lotStore.deleteLot(lots.value[index]!.id);

		lots.value.splice(index, 1);
		delete expandedLots.value[index];
		useAlert().showAlert('Lot supprimé avec succès', 'success');
	} catch (error) {
		console.error('Error deleting lot:', error);
		useAlert().showAlert('Une erreur est survenue lors de la suppression du lot', 'error');
	}
}

// const calculateLotTotals = (index: number) => {
// 	const lot = lots.value[index];

// 	if (!lot) return;

// 	// Calculer le coût total
// 	lot.totalCost = (lot.supplierPrice || 0) + (lot.transportCost || 0) + (lot.customsCost || 0);

// 	// Calculer le bénéfice
// 	lot.profit = (lot.sellingPrice || 0) - lot.totalCost;

// 	// Calculer la marge
// 	if (lot.totalCost > 0) {
// 		lot.profitMargin = Math.round((lot.profit / lot.totalCost) * 100);
// 	} else {
// 		lot.profitMargin = 0;
// 	}
// };

const saveLotsConfiguration = async () => {
	Swal.fire({
		icon: "question",
		text: "Voulez-vous enregistrer cette configuration ?"
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				isLoading.value = true;
				console.log("Lots to save:", offerId);
				await lotStore.configureLots(offerId, lots.value);

				// Afficher un message de succès
				useAlert().showAlert('Configuration des lots sauvegardée avec succès');
			} catch (error) {
				console.error('Erreur lors de la sauvegarde de la configuration:', error);
			} finally {
				isLoading.value = false;
			}
		}
	})
};

const proceedToSubmission = () => {
	useAlert().showAlert("Not implemented yet !");
};

// Gestion des articles dans les lots
const addItemToLot = (lotIndex: number) => {
	lots.value[lotIndex]?.items.push({
		productId: '',
		productName: '',
		quantity: 1,
		unitPrice: 0
	});
};

const removeItemFromLot = (lotIndex: number, itemIndex: number) => {
	const item = lots.value[lotIndex]?.items[itemIndex];
	if (item?.productName) {
		useAlert().showAlert(`Article ${item.productName} supprimé`, 'success');
	} else {
		useAlert().showAlert(`Ligne vide supprimée`, 'success');
	}
	lots.value[lotIndex]?.items.splice(itemIndex, 1);
};

const onProductChange = (lotIndex: number, itemIndex: number) => {
	const selectedProduct = products.value.find(
		(product) => product.id === lots.value[lotIndex]!.items[itemIndex]?.productId
	);
	if (selectedProduct && lots.value[lotIndex]?.items[itemIndex]) {
		lots.value[lotIndex].items[itemIndex].productName = selectedProduct.name;
		lots.value[lotIndex].items[itemIndex].unitPrice = selectedProduct.unit_price_sale || 0;
	}
};

const getLotTotal = (lotIndex: number) => {
	return lots.value[lotIndex]?.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
};

const loadOfferLots = async () => {
// 	// Chargement des lots de l'offre
	try {
		lots.value = await lotStore.fetchAll(offerId);
		if (lots.value.length === 0) {
			lots.value.push({...defaultLotData(), id: Date.now().toString(), name: "Lot 1", title: "Lot 1"});
			expandedLots.value[0] = true;
		}
	} catch (error: unknown) {
		console.error('Erreur lors du chargement des lots:', error);
		const errorMessage = (error as Error)?.message || 'Une erreur est survenue lors de la récupération des lots';
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: errorMessage,
			confirmButtonText: "Revenir en arrière",
			allowOutsideClick: false
		}).then(() => {
			window.history.back();
		});
	}
};

onMounted(async () => {
	Swal.fire({
		title: 'Chargement en cours',
		text: 'Veuillez patienter pendant que nous récupérons les données de l\'offre...',
		allowOutsideClick: false,
		didOpen: () => {
			Swal.showLoading();
		}
	}).then();
	try {
		isLoading.value = true;
		await productStore.fetchAll();
		await loadOfferData();
		await loadOfferLots();
	} finally {
		isLoading.value = false;
		Swal.close();
	}
});
</script>
