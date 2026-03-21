<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- En-tête de la page -->
		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
				Enregistrer une commande</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4">
				<NuxtLink :to="AppUrl.ORDER_INDEX"
					class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
					<Icon name="heroicons:list-bullet" class="-ml-1 mr-2 h-5 w-5" />
					Liste des commandes
				</NuxtLink>
			</div>
		</div>

		<!-- Bouton pour choisir la source -->
		<div class="mb-6">
			<button @click="showSourceChoiceModal"
				class="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg transition-all">
				<Icon name="heroicons:plus-circle" class="h-6 w-6 mr-2" />
				{{ sourceType ? 'Modifier la source' : 'Choisir la source (Client ou Proforma)' }}
			</button>
		</div>

		<!-- Affichage de la source sélectionnée -->
		<div v-if="sourceType" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-blue-900">
						Source sélectionnée :
						<span class="font-bold">{{ sourceType === 'proforma' ? 'Proforma' : 'Nouveau Client' }}</span>
					</p>
					<p v-if="selectedQuote" class="text-sm text-blue-700 mt-1">
						{{ getSelectedProformaInfo() }}
					</p>
					<p v-else-if="selectedClient" class="text-sm text-blue-700 mt-1">
						Client: {{ searchClient }}
					</p>
				</div>
				<button @click="resetSource" class="text-red-600 hover:text-red-800 transition-colors" title="Réinitialiser">
					<Icon name="heroicons:x-circle" class="h-6 w-6" />
				</button>
			</div>
		</div>

		<!-- Fichier bon de commande -->
		<div v-if="sourceType"
			class="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6 hover:border-blue-400 transition-colors">
			<label class="block text-sm font-medium text-gray-700 mb-3">
				<Icon name="heroicons:document-arrow-up" class="inline h-5 w-5 mr-1" />
				Joindre le bon de commande (optionnel)
			</label>
			<div class="flex items-center gap-4">
				<label class="cursor-pointer">
					<span
						class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors">
						<Icon name="heroicons:paper-clip" class="h-4 w-4 mr-2" />
						Sélectionner un fichier
					</span>
					<input type="file" @change="handleFileUpload" class="sr-only" accept=".pdf,.doc,.docx,.xls,.xlsx" />
				</label>
				<span v-if="fileName" class="text-sm text-gray-600 flex items-center gap-2">
					<Icon name="heroicons:document-text" class="h-5 w-5 text-blue-600" />
					{{ fileName }}
					<button @click="removeFile" class="ml-2 text-red-500 hover:text-red-700 font-bold transition-colors">
						<Icon name="heroicons:x-circle" class="h-5 w-5" />
					</button>
				</span>
			</div>
		</div>

		<!-- Articles Section -->
		<div v-if="sourceType" class="mt-6">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-semibold text-gray-900">Articles</h3>
				<button @click="addItem" v-if="sourceType === 'client'"
					class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all">
					<i class="fas fa-plus mr-2"></i> Ajouter un article
				</button>
			</div>

			<!-- Affichage en cards pour petits écrans -->
			<div class="lg:hidden space-y-3">
				<div v-for="(item, index) in form.items" :key="index"
					class="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">

					<!-- Désignation -->
					<div class="mb-3 relative">
						<label class="block text-xs text-gray-500 uppercase font-semibold mb-1">Désignation <RequiredField /></label>
						<ProductComboBox
							v-model="item.articleId"
							:products="products"
							:show-price="true"
							:show-quantity="true"
							@update:modelValue="onProductChange(index)"
						/>
					</div>

					<!-- Quantité et Prix -->
					<div class="grid grid-cols-2 gap-3 mb-3">
						<div>
							<label class="block text-xs text-gray-500 uppercase font-semibold mb-1">Quantité <RequiredField /></label>
							<input type="number" min="1" v-model.number="item.quantity"
								class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all p-2 text-sm text-center" />
						</div>
						<div>
							<label class="block text-xs text-gray-500 uppercase font-semibold mb-1">
								PU (F CFA) <span class="text-red-500">*</span>
							</label>
							<input type="number" min="0" v-model.number="item.unitPrice"
								class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all p-2 text-sm text-center" />
						</div>
					</div>

					<!-- Total et Suppression -->
					<div class="flex justify-between items-center pt-3 border-t border-gray-300">
						<div>
							<p class="text-xs text-gray-500 uppercase font-semibold">Total</p>
							<p class="font-bold text-blue-600 text-lg">{{ formatCurrency(item.quantity * item.unitPrice) }}</p>
						</div>
						<button @click="removeItem(index)" class="text-red-500 hover:text-red-700 p-2 transition-colors"
							title="Supprimer cet article">
							<i class="fas fa-trash text-lg"></i>
						</button>
					</div>
				</div>

				<p v-if="form.items.length === 0"
					class="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
					Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.
				</p>
			</div>

			<!-- Affichage en tableau pour grands écrans -->
			<div class="hidden lg:block overflow-x-auto rounded-lg border border-gray-300">
				<table class="w-full text-sm">
					<thead class="bg-gradient-to-r from-blue-50 to-green-50">
						<tr>
							<th class="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Désignation <RequiredField /></th>
							<th class="border-b border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Quantité <RequiredField /></th>
							<th class="border-b border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">PU (F CFA) <RequiredField /></th>
							<th class="border-b border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Total (F CFA)</th>
							<th class="border-b border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">Action</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in form.items" :key="index" class="hover:bg-gray-50 transition-colors">
							<td class="border-b border-gray-200 px-4 py-2 relative">
								<ProductComboBox
									v-model="item.articleId"
									:products="products"
									:show-price="true"
									:show-quantity="true"
									@update:modelValue="onProductChange(index)"
								/>
							</td>

							<!-- Quantité -->
							<td class="border-b border-gray-200 px-4 py-2">
								<input type="number" min="1" v-model.number="item.quantity"
									class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all p-2 text-center" />
							</td>

							<!-- Prix unitaire -->
							<td class="border-b border-gray-200 px-4 py-2">
								<input type="number" v-model.number="item.unitPrice" required
									class="w-full border border-gray-300 rounded p-2 text-center focus:ring-1 focus:ring-indigo-500" />
							</td>

							<!-- Total -->
							<td class="border-b border-gray-200 px-4 py-2 text-center font-semibold text-blue-600">
								{{ formatCurrency(item.quantity * item.unitPrice) }}
							</td>

							<!-- Retire la ligne -->
							<td class="border-b border-gray-200 px-4 py-2 text-center">
								<button @click="removeItem(index)" class="text-red-500 hover:text-red-700 p-2 transition-colors"
									title="Supprimer cet article">
									<i class="fas fa-trash"></i>
								</button>
							</td>
						</tr>
						<tr v-if="form.items.length === 0">
							<td colspan="5" class="text-center text-gray-500 py-8">
								Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Totaux -->
		<div v-if="sourceType && form.items.length > 0" class="mt-6 flex justify-end">
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

		<!-- Boutons -->
		<div v-if="sourceType" class="pt-5 mt-6 border-t border-gray-200 flex justify-end gap-3">
			<button @click="resetForm" type="button"
				class="bg-white py-2 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
				Annuler
			</button>
			<button @click="submitOrder" :disabled="isSaving || form.items.length === 0"
				class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all">
				{{ isSaving ? 'En cours...' : 'Enregistrer la commande' }}
			</button>
		</div>

		<!-- Modal pour choisir la source -->
		<Transition name="modal">
			<div v-if="showSourceModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
				<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
					<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showSourceModal = false"></div>
					<div class="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
						<div class="bg-white px-6 pt-6 pb-4">
							<div class="flex items-center justify-between mb-6">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
										<Icon name="heroicons:question-mark-circle" class="w-6 h-6 text-blue-600" />
									</div>
									<h3 class="text-lg font-semibold text-gray-900">Choisir la source</h3>
								</div>
								<button @click="showSourceModal = false" class="text-gray-400 hover:text-gray-500 transition-colors">
									<Icon name="heroicons:x-mark" class="w-6 h-6" />
								</button>
							</div>
							<p class="text-gray-600 mb-6">Voulez-vous partir d'une proforma existante ou créer une nouvelle commande pour un client ?</p>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<button @click="openProformaModal"
									class="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
									<Icon name="heroicons:document-text" class="w-12 h-12 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
									<span class="font-semibold text-gray-900">Proforma existante</span>
									<span class="text-sm text-gray-500 mt-1">Partir d'un devis validé</span>
								</button>
								<button @click="openClientModal"
									class="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
									<Icon name="heroicons:user-plus" class="w-12 h-12 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
									<span class="font-semibold text-gray-900">Nouvelle commande</span>
									<span class="text-sm text-gray-500 mt-1">Choisir un client</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Modal pour sélectionner une proforma -->
		<Transition name="modal">
			<div v-if="showProformaModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
				<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
					<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showProformaModal = false"></div>
					<div class="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
						<div class="bg-white px-6 pt-6 pb-4">
							<div class="flex items-center justify-between mb-6">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
										<Icon name="heroicons:document-text" class="w-6 h-6 text-blue-600" />
									</div>
									<h3 class="text-lg font-semibold text-gray-900">Sélectionner une proforma</h3>
								</div>
								<button @click="showProformaModal = false" class="text-gray-400 hover:text-gray-500 transition-colors">
									<Icon name="heroicons:x-mark" class="w-6 h-6" />
								</button>
							</div>

							<!-- Liste des proformas -->
							<div v-if="proforma.length === 0" class="text-center py-8">
								<Icon name="heroicons:document-minus" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
								<p class="text-gray-500">Aucune proforma validée disponible</p>
							</div>
							<div v-else class="max-h-80 overflow-y-auto space-y-2">
								<div
									v-for="p in proforma"
									:key="p.id"
									@click="selectProformaItem(p.id)"
									class="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
									:class="{ 'bg-blue-50 border-blue-500': selectedQuote === p.id }"
								>
									<div class="flex items-center justify-between">
										<div>
											<p class="font-semibold text-gray-900">{{ p.reference }}</p>
											<p class="text-sm text-gray-600">{{ getClientName(p.client) }}</p>
											<p v-if="p.object" class="text-sm text-gray-500">{{ p.object }}</p>
										</div>
										<Icon v-if="selectedQuote === p.id" name="heroicons:check-circle" class="w-6 h-6 text-blue-500" />
									</div>
								</div>
							</div>

							<div class="mt-6 flex justify-end gap-3">
								<button @click="showProformaModal = false" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
									Annuler
								</button>
								<button @click="confirmProformaSelection" :disabled="!selectedQuote"
									class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
									Sélectionner
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Modal pour sélectionner le client -->
		<Transition name="modal">
			<div v-if="showClientModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
				<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
					<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeClientModal"></div>
					<div class="relative inline-block align-bottom bg-white rounded-xl text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:max-h-screen sm:min-h-[500px]">
						<div class="bg-white px-6 pt-6 pb-4 max-h-full overflow-visible">
							<div class="flex items-center justify-between mb-6">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
										<Icon name="heroicons:user" class="w-6 h-6 text-green-600" />
									</div>
									<h3 class="text-lg font-semibold text-gray-900">Sélectionner un client</h3>
								</div>
								<button @click="closeClientModal" class="text-gray-400 hover:text-gray-500 transition-colors">
									<Icon name="heroicons:x-mark" class="w-6 h-6" />
								</button>
							</div>

							<div v-if="clients.length === 0" class="text-center py-8">
								<Icon name="heroicons:users" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
								<p class="text-gray-500">Aucun client disponible</p>
							</div>
							<div v-else class="relative" style="z-index: 60;">
								<UiClientComboBox
									v-model="tempSelectedClient"
									:clients="clients"
									:return-object="false"
									:show-email="true"
									:show-phone="true"
									:show-type="true"
									class="modal-combobox"
								/>
							</div>

							<div class="mt-6 flex justify-end gap-3">
								<button @click="closeClientModal" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
									Annuler
								</button>
								<button @click="confirmClientSelection" :disabled="!tempSelectedClient"
									class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
									Sélectionner
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Modal d'alerte/notification -->
		<Transition name="modal">
			<div v-if="alertModal.show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
				<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
					<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeAlertModal"></div>
					<div class="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
						<div class="bg-white px-6 pt-6 pb-4">
							<div class="flex items-center justify-center mb-4">
								<div :class="[
									'w-16 h-16 rounded-full flex items-center justify-center',
									alertModal.type === 'success' ? 'bg-green-100' : '',
									alertModal.type === 'error' ? 'bg-red-100' : '',
									alertModal.type === 'warning' ? 'bg-yellow-100' : ''
								]">
									<Icon v-if="alertModal.type === 'success'" name="heroicons:check-circle" class="w-10 h-10 text-green-600" />
									<Icon v-else-if="alertModal.type === 'error'" name="heroicons:x-circle" class="w-10 h-10 text-red-600" />
									<Icon v-else name="heroicons:exclamation-triangle" class="w-10 h-10 text-yellow-600" />
								</div>
							</div>
							<h3 class="text-lg font-semibold text-gray-900 text-center mb-2">{{ alertModal.title }}</h3>
							<p class="text-gray-600 text-center" v-html="alertModal.message"></p>
							<div class="mt-6 flex justify-center">
								<button @click="closeAlertModal"
									:class="[
										'px-6 py-2 rounded-lg text-white transition-colors',
										alertModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : '',
										alertModal.type === 'error' ? 'bg-red-600 hover:bg-red-700' : '',
										alertModal.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' : ''
									]">
									OK
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useClientStore } from '#imports'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/Sale/OrderStore'
import { useProformaStore } from '@/stores/Stock/ProformaStore'
import { useProductStore } from '@/stores/Stock/ProductStore'
import { getClientName } from '~/models/Client'
import RequiredField from '~/app/components/partials/RequiredField.vue'
import ProductComboBox from "@/components/ui/ProductComboBox.vue";
import UiClientComboBox from "@/components/ui/ClientComboBox.vue";
import Swal from "sweetalert2";

const sourceType = ref<"client" | "proforma" | ''>('')
const selectedQuote = ref('')
const selectedClient = ref('')
const tempSelectedClient = ref('')
const fileName = ref('')
const file = ref<File | null>(null)
const showClientModal = ref(false)
const showSourceModal = ref(false)
const showProformaModal = ref(false)

// Modal d'alerte
const alertModal = ref({
	show: false,
	type: 'warning' as 'success' | 'error' | 'warning',
	title: '',
	message: ''
})

const showAlert = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
	alertModal.value = { show: true, type, title, message }
}

const closeAlertModal = () => {
	alertModal.value.show = false
	// Si c'est un succès et on vient de créer une commande, rediriger
	if (alertModal.value.type === 'success' && alertModal.value.title === 'Succès') {
		router.push(AppUrl.ORDER_INDEX);
		resetForm();
	}
}

const taux = 18;

const proformaStore = useProformaStore()
const clientStore = useClientStore()
const productStore = useProductStore()
const orderStore = useOrderStore()
const router = useRouter()

const { proforma } = storeToRefs(proformaStore);
const { clients } = storeToRefs(clientStore);
const { validationErrors, isSaving } = storeToRefs(orderStore);
const { products } = storeToRefs(productStore);

const form = ref<{ items: FormItem[] }>({
	items: []
});

interface FormItem {
	articleId: string;
	name: string;
	unitPrice: number;
	quantity: number;
}

// Charge les données à l'ouverture
onMounted(() => {
	proformaStore.fetchProformaValidate()
	clientStore.fetchAll();
	productStore.fetchAll();
})

// Modal pour choisir la source
const showSourceChoiceModal = () => {
	showSourceModal.value = true
}

// Ouvrir le modal proforma
const openProformaModal = () => {
	showSourceModal.value = false
	if (!proforma.value || proforma.value.length === 0) {
		showAlert('warning', 'Aucune proforma', 'Aucune proforma validée disponible')
		return
	}
	selectedQuote.value = ''
	showProformaModal.value = true
}

// Ouvrir le modal client
const openClientModal = () => {
	showSourceModal.value = false
	if (!clients.value || clients.value.length === 0) {
		showAlert('warning', 'Aucun client', 'Aucun client disponible')
		return
	}
	tempSelectedClient.value = ''
	showClientModal.value = true
}

// Sélection d'une proforma dans la liste
const selectProformaItem = (proformaId: string) => {
	selectedQuote.value = proformaId
}

// Confirmer la sélection de proforma
const confirmProformaSelection = () => {
	if (!selectedQuote.value) return
	selectedClient.value = ""
	sourceType.value = 'proforma'
	form.value.items = []
	loadProformaArticles(selectedQuote.value)
	showProformaModal.value = false
}

// Confirmer la sélection de client
const confirmClientSelection = () => {
	if (!tempSelectedClient.value) return
	selectedQuote.value = ""
	sourceType.value = 'client'
	selectedClient.value = tempSelectedClient.value
	searchClient.value = getClientName(clients.value.find(c => c.id === tempSelectedClient.value))
	form.value.items = []
	addItem()
	showClientModal.value = false
}

// Charger les articles d'une proforma
const loadProformaArticles = (proformaId: string) => {
	const _proforma = proforma.value.find(p => p.id === proformaId);
	if (_proforma && _proforma.articles && _proforma.client) {
		selectedClient.value = _proforma.client.id
		form.value.items = _proforma.articles.map(article => ({
			name: article.name,
			quantity: article.pivot?.quantity || 0,
			unitPrice: article.pivot?.unit_price || 0,
			articleId: article.id,
		}))
	}
}

// Obtenir les infos de la proforma sélectionnée
const getSelectedProformaInfo = () => {
	if (!selectedQuote.value) return ''
	const _proforma = proforma.value.find(p => p.id === selectedQuote.value)
	if (_proforma) {
		return `${_proforma.reference} - ${getClientName(_proforma.client)}`
	}
	return ''
}

// Réinitialiser la source
const resetSource = () => {
	sourceType.value = ''
	selectedQuote.value = ''
	selectedClient.value = ''
	searchClient.value = ''
	form.value.items = []
}

// Modal client
const closeClientModal = () => {
	showClientModal.value = false
}

const searchClient = ref("")


// Gestion du changement de produit
const onProductChange = (idx: number) => {
	const selectedProduct = products.value.find((_) => _.id === form.value.items[idx]?.articleId)
	if (selectedProduct) {
		form.value.items[idx]!.name = selectedProduct.name
		form.value.items[idx]!.unitPrice = selectedProduct.unit_price_sale || 0
	}
}

// Ajouter une ligne d'article vide
const addItem = () => {
	form.value.items.push({ name: '', quantity: 1, unitPrice: 0, articleId: '' })
}

// Supprimer une ligne d'article
const removeItem = (index: number) => form.value.items.splice(index, 1)

// Reset complet du formulaire
const resetForm = () => {
	resetSource()
	fileName.value = ''
	file.value = null
}

// Gestion du fichier (UI uniquement)
const handleFileUpload = (e: Event) => {
	const target = e.target as HTMLInputElement
	const selectedFile = target.files?.[0]
	if (selectedFile) {
		fileName.value = selectedFile.name
		file.value = selectedFile
	}
}

const removeFile = () => {
	fileName.value = ''
	file.value = null
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'XOF',
	}).format(amount)
}

// Calculs des totaux
const subtotal = computed(() =>
	form.value.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0)
)
const tvaAmount = computed(() => subtotal.value * taux / 100)
const total = computed(() => subtotal.value + tvaAmount.value)

// Validation et soumission
const submitOrder = async () => {
	if (isSaving.value) return

	// Validation client obligatoire
	if (!selectedClient.value) {
		Swal.fire({
			icon: 'error',
			title: 'Attention',
			text: 'Veuillez sélectionner un client ou une proforma.'
		})
		return
	}

	// Validation articles
	if (form.value.items.length === 0) {
		Swal.fire({
			icon: 'warning',
			title: 'Erreur',
			text: 'Veuillez ajouter au moins un article.'
		})
		return
	}

	for (const item of form.value.items) {
		if (!item.articleId) {
			Swal.fire({
				icon: 'warning',
				title: 'Erreur',
				text: 'Certains articles sont invalides. Veuillez les corriger.'
			})
			return
		}
		if (item.quantity < 1) {
			Swal.fire({
				icon: 'warning',
				title: 'Erreur',
				text: 'La quantité doit être positive (>= 1).'
			})
			return
		}
		if (item.unitPrice < 0) {
			Swal.fire({
				icon: 'warning',
				title: 'Erreur',
				text: 'Le prix doit être positif (>= 0).'
			})
			return
		}
	}

	const payload = {
		client: {
			id: selectedClient.value || null
		},
		proforma: {
			id: selectedQuote.value || null
		},
		date: new Date().toISOString().split('T')[0],
		comment: '',
		items: form.value.items.map(i => ({
			articleId: i.articleId,
			quantity: i.quantity,
			unitPrice: i.unitPrice
		}))
	}

	try {
		// @ts-ignore
		await orderStore.store(payload);
		Swal.fire({
			icon: 'success',
			title: 'Succès',
			text: 'Votre commande a été enregistrée avec succès !',
			timer: 2000,
			showConfirmButton: false
		})
		router.push(AppUrl.ORDER_INDEX);
		resetForm();
	} catch (error) {
		console.error('Erreur lors de la soumission:', error);
		let errorMessage = "<ul>";
		Object.entries(validationErrors.value).forEach(([key, value]) => {
			errorMessage += `<li>${key}: ${value}</li>`;
		});
		errorMessage += "</ul>";

		Swal.fire({
			icon: 'error',
			title: 'Erreur',
			html: errorMessage
		})
	} finally {
	}
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
	transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
	transform: scale(0.95);
	opacity: 0;
}
</style>

