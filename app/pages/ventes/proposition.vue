<template>
	<div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
		<h2 class="text-2xl font-semibold text-indigo-700 mb-6 flex items-center gap-2">
			<i class="fas fa-file-invoice"></i> Enregistrer une Facture Proforma
		</h2>

		<form @submit.prevent="handleSubmit" class="space-y-6">

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

				<!-- Client -->
				<div>
					<label for="client" class="block font-medium mb-1">Client</label>
					<select id="client" v-model="form.clientId" required
						class="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500">
						<option value="">Sélectionner un client</option>
						<option v-for="client in clientStore.clients" :key="client.id" :value="client.id">
							{{ getClientName(client) }}
						</option>
					</select>
				</div>

				<!-- Objet (pleine largeur) -->
				<div class="md:col-span-2">
					<label for="object" class="block font-medium mb-1">Objet</label>
					<textarea id="object" v-model="form.object" rows="4"
						class="w-full border border-gray-400 rounded p-2 focus:ring-2 focus:ring-indigo-500"></textarea>
				</div>

			</div>


			<!-- Section Articles -->
			<div>
				<div class="flex justify-between items-center mb-3">
					<h3 class="font-semibold text-lg">Articles</h3>
					<button type="button" @click="addItem"
						class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition">
						<i class="fas fa-plus mr-1"></i> Ajouter un article
					</button>
				</div>

				<div v-if="form.items.length === 0"
					class="py-8 text-center border-2 border-dashed border-gray-300 rounded text-gray-500">
					Aucun article ajouté.
				</div>

				<!-- Liste des articles -->
				<div v-for="(item, idx) in form.items" :key="idx" class="border p-4 rounded mb-4 bg-gray-50">
					<div class="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
						<!-- Produit/Service -->
						<div class="md:col-span-2">
							<label class="block text-sm font-medium mb-1">Désignation</label>
							<select v-model="item.articleId" @change="onProductChange(idx)" required
								class="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500">
								<option value="">Sélectionner un produit</option>
								<option v-for="product in products" :key="product.id" :value="product.id">
									{{ product.name }} - {{ formatCurrency(product.unit_price_sale) }}
								</option>
							</select>
						</div>
						<!-- Quantité -->
						<div>
							<label class="block text-sm font-medium mb-1">Quantité</label>
							<input type="number" v-model.number="item.quantity" min="1" required
								class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500" />
						</div>

						<!-- Prix unitaire HT -->
						<div>
							<label class="block text-sm font-medium mb-1">Prix unitaire </label>
							<input type="number" v-model.number="item.unitPrice" min="3500" required
								class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500" />
						</div>

						<!-- Total HT -->
						<div class="flex flex-col items-center">
							<label class="block text-sm font-medium mb-1">Total </label>
							<div class="bg-white border border-gray-300 rounded px-3 py-2 w-full text-center font-semibold">
								{{ formatCurrency(item.quantity * item.unitPrice) }}
							</div>
						</div>

						<!-- Supprimer -->
						<div class="flex justify-center">
							<button type="button" @click="removeItem(idx)" class="text-red-600 hover:text-red-800"
								title="Supprimer cet article">
								<i class="fas fa-trash text-xl"></i>
								<!-- <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1zM4 7h16" />
                </svg> -->

							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Totaux -->
			<div v-if="form.items.length > 0" class="bg-gray-100 p-4 rounded text-right space-y-1 font-semibold">
				<div>Total HT : {{ formatCurrency(totalHT) }}</div>
				<div>TVA (18%) : {{ formatCurrency(totalTVA) }}</div>
				<div class="text-indigo-700 text-lg font-bold">Total TTC : {{ formatCurrency(totalTTC) }}</div>
			</div>

			<!-- Actions -->
			<div class="flex justify-end gap-4 pt-4 border-t border-gray-300">
				<button type="button" @click="goBack" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
					Annuler
				</button>
				<button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
					:disabled="form.items.length === 0">
					Enregistrer
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useProformaStore } from '~/app/stores/Stock/ProformaStore'
import { useProductStore } from '@/stores/Stock/ProductStore'
import { useClientStore } from '@/stores/ClientStore'
import { getClientName } from '~/models/Client'


const form = ref({
	clientId: '',
	object: '',
	notes: '',
	items: [] // { productName, quantity, unitPrice }
})

// Ajouter un article
const addItem = () => {
	form.value.items.push({
		articleId: '',
		productName: '',
		quantity: 1,
		unitPrice: 0
	})
}

// Supprimer un article
const removeItem = (index) => {
	form.value.items.splice(index, 1)
}
const clientStore = useClientStore()
const productStore = useProductStore();
const proformaStore = useProformaStore();
const { products } = storeToRefs(productStore);

onMounted(() => {
	clientStore.fetchClients()
	productStore.fetchAll()
})

// Gestion du changement de produit
const onProductChange = (idx) => {
	const selectedProduct = products.value.find(
		(product) => product.id === form.value.items[idx].articleId
	)
	if (selectedProduct) {
		form.value.items[idx].productName = selectedProduct.name
		form.value.items[idx].unitPrice = parseFloat(selectedProduct.unit_price_sale) || 0
	}
}


// Calculs totaux
const totalHT = computed(() =>
	form.value.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
)
const totalTVA = computed(() => totalHT.value * 0.18)
const totalTTC = computed(() => totalHT.value + totalTVA.value)

// Format monétaire
const formatCurrency = (amount) => {
	return amount ? amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' }) : "0"
}

// Retour à la page précédente
const goBack = () => {
	router.push(AppUrl.PROPO)
}

const handleSubmit = async () => {
	await proformaStore.store(form.value);
	Swal.fire({
		icon: 'success',
		title: 'Succès',
		text: 'Proforma enregistrée avec succès',
	});
	form.value = { clientId: '', object: '', items: [] }; // reset formulaire
};

</script>
