<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- En-tête de la page avec sélection de commande -->
		<div class="mb-6">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
				<!-- Sélection de la commande -->
				<div class="w-full">
					<label class="block mb-2 text-sm font-semibold text-gray-700">
						Choisir la commande <span class="text-red-700">*</span>
					</label>
					<select
						v-model="selectedOrderId"
						@change="loadOrderDetails"
						class="text-center border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
						<option value="">Sélectionner une commande</option>
						<option v-for="cmd in orders" :key="cmd.id" :value="cmd.id">
							Commande n° {{ cmd.reference }} - {{ formatDate(cmd.created_at) }}
						</option>
					</select>
				</div>

				<!-- Sélection type de facture -->
				<div class="w-full">
					<label class="block mb-2 text-sm font-semibold text-gray-700">
						Type de facture <span class="text-red-700">*</span>
					</label>
					<select
						v-model="factureType"
						class="text-center border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
						<option value="">Choisir le type de facture</option>
						<option v-for="invoiceType in invoiceTypes" :key="invoiceType.id" :value="invoiceType.id">
							{{ invoiceType.label }}
						</option>
					</select>
				</div>

				<!-- Bouton retour -->
				<div class="md:flex md:justify-end">
					<NuxtLink
						:to="AppUrl.ORDER_INDEX"
						class="inline-flex items-center justify-center
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
			</div>
		</div>

		<!-- Message si aucune commande sélectionnée -->
		<div v-if="!selectedOrderId" class="text-center py-12">
			<Icon name="heroicons:shopping-cart" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
			<p class="text-gray-500 text-lg">Veuillez sélectionner une commande pour afficher les détails</p>
		</div>

		<!-- Contenu affiché après sélection d'une commande -->
		<div v-else-if="order">
			<!-- Date d'émission (affichée seulement si type de facture est sélectionné) -->
			<div v-if="factureType" class="mb-6">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label class="block mb-2 text-sm font-semibold text-gray-700">Date d'émission</label>
						<input
							type="date"
							v-model="invoiceDate"
							class="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
					</div>
				</div>
			</div>
			<!-- Informations de la commande -->
			<div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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

			<!-- Cas spécifique : Acompte - Saisie du pourcentage -->
			<div v-if="factureType === 'acompte' && orderArticles.length > 0"
				class="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
				<div class="flex flex-col items-center">
					<label class="block mb-2 text-sm font-semibold text-gray-700">
						Pourcentage d'acompte (%)
					</label>
					<input
						type="number"
						v-model.number="acomptePercent"
						min="0"
						max="100"
						class="border border-gray-300 p-2 rounded-lg w-32 text-center focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500" />
				</div>
			</div>

			<!-- Totaux -->
			<div v-if="orderArticles.length > 0 && factureType" class="mt-6 flex justify-end">
				<div class="w-full max-w-sm space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
					<!-- Totaux pour Facture Définitive -->
					<div v-if="factureType === 'definitive'">
						<div class="flex justify-between text-sm text-gray-600">
							<span class="font-medium">Total HT :</span>
							<span class="font-semibold">{{ formatCurrency(subtotal) }}</span>
						</div>
						<div class="flex justify-between text-sm text-gray-600 mt-2">
							<span class="font-medium">Total Net HT :</span>
							<span class="font-semibold">{{ formatCurrency(totalNet) }}</span>
						</div>
						<div class="flex justify-between text-sm text-gray-600 mt-2">
							<span class="font-medium">TVA ({{ taux }}%) :</span>
							<span class="font-semibold">{{ formatCurrency(tvaAmount) }}</span>
						</div>
						<div class="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-gray-300 mt-3">
							<span>Total TTC :</span>
							<span class="text-blue-600">{{ formatCurrency(total) }}</span>
						</div>
					</div>

					<!-- Totaux pour Facture Acompte -->
					<div v-if="factureType === 'acompte'">
						<div class="flex justify-between text-sm text-gray-600">
							<span class="font-medium">Total HT :</span>
							<span class="font-semibold">{{ formatCurrency(subtotal) }}</span>
						</div>
						<div class="flex justify-between text-sm text-gray-600 mt-2">
							<span class="font-medium">Acompte HT ({{ acomptePercent }}%) :</span>
							<span class="font-semibold">{{ formatCurrency(acompteHT) }}</span>
						</div>
						<div class="flex justify-between text-sm text-gray-600 mt-2">
							<span class="font-medium">TVA ({{ taux }}%) sur acompte :</span>
							<span class="font-semibold">{{ formatCurrency(acompteTVA) }}</span>
						</div>
						<div class="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-gray-300 mt-3">
							<span>Montant Acompte TTC :</span>
							<span class="text-blue-600">{{ formatCurrency(acompteTTC) }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Boutons d'action -->
			<div v-if="factureType && orderArticles.length > 0" class="flex justify-end gap-3 mt-6 pt-4 border-t">
				<button
					@click="cancelInvoice"
					class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
					Annuler
				</button>
				<button
					@click="submitInvoice"
					class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
					Enregistrer
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useOrderStore } from '@/stores/Sale/OrderStore'
import { getClientName } from '~/models/Client'
import type { Order } from '~/models/Invoice'
import { useRouter } from 'vue-router'
import { useInvoiceTypeStore } from '@/stores/Sale/InvoiceTypeStore'
import { useInvoiceStore } from '@/stores/Sale/InvoiceStore'

const router = useRouter()
const taux = 18;

const orderStore = useOrderStore()
const invoiceStore = useInvoiceStore()
const invoiceTypeStore = useInvoiceTypeStore()
const { orders } = storeToRefs(orderStore)
const { invoiceTypes } = storeToRefs(invoiceTypeStore)
const order = ref<Order | null>(null);
const selectedOrderId = ref('')
const factureType = ref('')
const invoiceDate = ref(new Date().toISOString().slice(0, 10))
const acomptePercent = ref(0)
const remisePercent = ref(0)

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

// Calculs des totaux pour Facture Définitive
const subtotal = computed(() =>
	orderArticles.value.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0)
);

const totalRemise = computed(() => (subtotal.value * remisePercent.value) / 100);
const totalNet = computed(() => subtotal.value - totalRemise.value);
const tvaAmount = computed(() => (totalNet.value * taux) / 100);
const total = computed(() => totalNet.value + tvaAmount.value);

// Calculs des totaux pour Facture Acompte
const acompteHT = computed(() => (subtotal.value * acomptePercent.value) / 100);
const acompteTVA = computed(() => (acompteHT.value * taux) / 100);
const acompteTTC = computed(() => acompteHT.value + acompteTVA.value);

// Charger les détails de la commande sélectionnée
const loadOrderDetails = async () => {
	if (!selectedOrderId.value) {
		order.value = null;
		return;
	}

	Swal.fire({
		title: "Chargement en cours...",
		didOpen: () => {
			Swal.showLoading();
		},
		allowOutsideClick: false,
		allowEscapeKey: false
	});

	try {
		order.value = await orderStore.find(selectedOrderId.value.toString());
		Swal.close();
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Erreur",
			text: "Erreur lors du chargement de la commande",
			allowOutsideClick: false,
			allowEscapeKey: false
		});
		console.error('Erreur lors du chargement de la commande:', error)
		order.value = null;
	}
};

// Soumettre la facture
const submitInvoice = async () => {
	if (!selectedOrderId.value || orderArticles.value.length === 0) {
		Swal.fire({
			icon: 'warning',
			title: 'Erreur',
			text: 'Veuillez sélectionner une commande et avoir au moins un article'
		});
		return;
	}

	if (!factureType.value) {
		Swal.fire({
			icon: 'warning',
			title: 'Erreur',
			text: 'Veuillez sélectionner un type de facture'
		});
		return;
	}

	const cmd = orders.value.find(c => c.id === selectedOrderId.value);
	const payload = {
		clientId: cmd ? cmd.client.id : null,
		orderId: selectedOrderId.value,
		invoiceType: factureType.value,
		date: invoiceDate.value,
		remisePercent: remisePercent.value,
		acomptePercent: factureType.value === 'acompte' ? acomptePercent.value : null,
		items: orderArticles.value.map(item => ({
			productName: item.name,
			quantity: item.quantity,
			unitPrice: item.unitPrice
		})),
		invoiceTypeId: factureType.value
	};

	try {
		await invoiceStore.store(payload);

		Swal.fire({
			icon: 'success',
			title: 'Succès',
			text: 'Facture enregistrée avec succès',
			timer: 2000,
			showConfirmButton: false,
		});

		// Réinitialiser le formulaire
		selectedOrderId.value = '';
		factureType.value = '';
		order.value = null;
		remisePercent.value = 0;
		acomptePercent.value = 0;
		invoiceDate.value = new Date().toISOString().slice(0, 10);

		router.push(AppUrl.INVOICEINFO);
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Erreur',
			text: "Une erreur est survenue lors de l'enregistrement de votre facture"
		});
		console.error(error);
	}
};

// Annuler l'enregistrement
const cancelInvoice = () => {
	Swal.fire({
		title: 'Êtes-vous sûr ?',
		text: "Voulez-vous vraiment annuler cette opération ?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Oui, annuler',
		cancelButtonText: 'Non, continuer'
	}).then((result) => {
		if (result.isConfirmed) {
			router.push(AppUrl.INVOICEINFO);
		}
	});
};

// Charger la liste des commandes au montage
onMounted(async () => {
	Swal.fire({
		title: "Chargement des commandes...",
		didOpen: () => {
			Swal.showLoading();
		},
		allowOutsideClick: false,
		allowEscapeKey: false
	});

	try {
		await orderStore.fetchValidatedOrders("delivered");
		await invoiceTypeStore.fetchAll();
		Swal.close();
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Erreur",
			text: "Erreur lors du chargement des commandes",
			allowOutsideClick: false,
			allowEscapeKey: false
		});
	}
});
</script>
