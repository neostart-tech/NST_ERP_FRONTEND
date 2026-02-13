<template>
	<div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
		aria-modal="true">
		<div class="flex items-center justify-center min-h-screen pt-4 px-4 mx-3 pb-20 text-center sm:block sm:p-0">
			<!-- Background overlay -->
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
				@click="closeModal"></div>

			<!-- Modal panel -->
			<div
				class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
				<div class="bg-white px-6 pt-5 pb-4">
					<!-- Header -->
					<div class="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-500 to-green-500 p-2">
						<h2 class="text-lg font-semibold text-white flex items-center gap-2">
							<i class="fas fa-file-invoice"></i> {{ modalName }}
						</h2>
						<button @click="closeModal" class="text-white">
							<Icon name="heroicons:x-mark" class="w-6 h-6" />
						</button>
					</div>

					<!-- Form -->
					<form @submit.prevent="handleSubmit" class="space-y-6 max-h-[70vh] overflow-y-auto px-2">

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

							<!-- Client -->
							<div>
								<label for="client" class="block font-medium mb-1">Client <RequiredField /></label>
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
									class="px-3 py-1 rounded bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
									<i class="fas fa-plus mr-1"></i> Ajouter un article
								</button>
							</div>

							<div v-if="form.items.length === 0"
								class="py-8 text-center border-2 border-dashed border-gray-300 rounded text-gray-500">
								Aucun article ajouté.
							</div>

							<!-- Liste des articles -->
							<div v-for="(item, idx) in form.items" :key="idx" class="border p-2 rounded mb-4 bg-gray-50">
								<div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
									<!-- Produit/Service -->
									<div class="md:col-span-5">
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
									<div class="md:col-span-2">
										<label class="block text-sm font-medium mb-1">Quantité</label>
										<input type="number" v-model.number="item.quantity" min="1" required
											class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500" />
									</div>

									<!-- Prix unitaire HT -->
									<div class="md:col-span-2">
										<label class="block text-sm font-medium mb-1">Prix unitaire </label>
										<input type="number" v-model.number="item.unitPrice" required
											class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500" />
									</div>

									<!-- Total HT -->
									<div class="md:col-span-2 flex flex-col items-center">
										<label class="block text-sm font-medium mb-1">Total </label>
										<div
											class="bg-white border border-gray-300 rounded px-3 py-2 w-full text-center font-semibold">
											{{ formatCurrency(item.quantity * item.unitPrice) }}
										</div>
									</div>

									<!-- Supprimer -->
									<div class="md:col-span-1 flex justify-center">
										<button type="button" @click="removeItem(idx)" class="text-red-600 hover:text-red-800 p-2"
											title="Supprimer cet article">
											<i class="fas fa-trash text-sm"></i>
										</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Totaux -->
						<div v-if="form.items.length > 0" class="p-3 text-right border-2 border-dashed border-gray-300 rounded text-gray-500">
							<div class="text-md italic">Total HT : {{ formatCurrency(totalHT) }}</div>
							<div class="text-md italic">TVA (18%) : {{ formatCurrency(totalTVA) }}</div>
							<div class="text-md italic text-lg font-bold">Total TTC : {{ formatCurrency(totalTTC) }}</div>
						</div>

						<!-- Actions -->
						<div class="flex justify-end gap-4 pt-4 border-t border-gray-300">
							<button type="button" @click="closeModal"
								class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
								Annuler
							</button>
							<button type="submit"
								class="px-4 py-2 text-white rounded disabled:opacity-50 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
								:disabled="form.items.length === 0">
								Enregistrer
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useProformaStore } from '@/stores/Stock/ProformaStore.ts'
import { useProductStore } from '@/stores/Stock/ProductStore'
import { useClientStore } from '@/stores/ClientStore'
import { getClientName } from '~/models/Client'
import RequiredField from '../partials/RequiredField.vue'

const props = defineProps({
	showModal: {
		type: Boolean,
		required: true
	},
	modalName: {
		type: String,
		required: false,
		default: 'Enregistrer une Facture Proforma'
	}
});

const emit = defineEmits(['close', 'saved'])

const form = ref({
	clientId: '',
	object: '',
	notes: '',
	items: [] // { productName, quantity, unitPrice }
});

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
	const product = form.value.items[index]
	if(product.productName) {
		useAlert().showAlert(`Article ${product.productName} supprimé`, 'success')
	} else {
		useAlert().showAlert(`Ligne vide supprimée`, 'success')
	}
	form.value.items.splice(index, 1)
}
const clientStore = useClientStore()
const productStore = useProductStore();
const proformaStore = useProformaStore();
const { products } = storeToRefs(productStore);

onMounted(() => {
	clientStore.fetchAll()
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

// Fermer le modal
const closeModal = () => {
	emit('close')
}

const handleSubmit = async () => {
	await proformaStore.store(form.value);
	Swal.fire({
		icon: 'success',
		title: 'Succès',
		text: 'Proforma enregistrée avec succès',
	});
	form.value = { clientId: '', object: '', items: [] };
	emit('saved')
	emit('close')
};

</script>
