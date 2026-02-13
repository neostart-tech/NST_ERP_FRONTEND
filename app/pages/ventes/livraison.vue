<template>
	<div class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
		<!-- Titre -->
		<h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
			<i class="fas fa-truck text-indigo-600"></i>
			Générer un bordereau de livraison
		</h1>

		<div class="flex items-center space-x-[400px] ">
			<!-- Sélection commande -->
			<div>
				<label class="font-semibold mb-2">Commande <span class="text-red-700">*</span></label>
				<select v-model="selectedCommande" @change="loadCommande" class="border border-black w-full p-2 rounded-lg">
					<option value="">-- Sélectionner une commande --</option>
					<option v-for="order in orders" :key="order.id" :value="order.id">
						{{ order.date }}
					</option>
				</select>
			</div>

			<!-- Type de livraison -->
			<div>
				<label class="block font-semibold mb-2">Type de livraison <span class="text-red-700">*</span></label>
				<select v-model="livraisonType" class="border border-black w-full p-2 rounded-lg">
					<option value="">-- Choisir --</option>
					<option value="complete">Livraison complète</option>
					<option value="partielle">Livraison partielle</option>
				</select>
			</div>
		</div>

		<!-- Formulaire -->
		<div v-if="selectedCommande && livraisonType" class="space-y-6">
			<!-- Infos livraison -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block mb-1">Date de livraison</label>
					<!-- ✅ min = today -->
					<input type="date" v-model="form.date" :min="today" class="w-full border border-black p-2 rounded-md" />
				</div>
				<div>
					<label class="block mb-1">Adresse de livraison</label>
					<input type="text" v-model="form.address" class="w-full border border-black p-2 rounded-md" />
				</div>
			</div>

			<!-- Articles -->
			<div>
				<h3 class="font-semibold mb-2">Articles à livrer</h3>
				<table class="w-full border border-gray-300 text-sm rounded-md overflow-hidden">
					<thead>
						<tr class="bg-indigo-300 text-blue-700 uppercase text-xs font-semibold">
							<th class="p-2 text-center">Designation</th>
							<th class="p-2 text-center">Code Produit</th>
							<th class="p-2 text-center">N° Série</th>
							<th class="p-2 text-center">Qté commandée</th>
							<th v-if="livraisonType === 'partielle'" class="p-2 text-center">Qté déjà livrée</th>
							<th v-if="livraisonType === 'partielle'" class="p-2 text-center">Qté restante</th>
							<th v-if="livraisonType === 'partielle'" class="p-2 text-center">Qté à livrer</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in form.items" :key="index" class="border-t">
							<td><input v-model="item.designation"
									class="border border-black text-center w-full p-1 rounded-md bg-gray-100" /></td>
							<td><input v-model="item.code" class="border border-black text-center w-full p-1 rounded-md"
									placeholder="Saisir le code" /></td>
							<td><input v-model="item.serial" class="border border-black text-center w-full p-1 rounded-md"
									placeholder="Saisir numéro série" /></td>
							<td><input type="number" v-model.number="item.qtyCommandee" readonly
									class="border border-black text-center w-full p-1 rounded-md bg-gray-100 cursor-not-allowed" /></td>

							<td v-if="livraisonType === 'partielle'">
								<input type="number" :value="item.qtyAlreadyDelivered" readonly
									class="border border-black text-center w-full p-1 rounded-md bg-gray-100 cursor-not-allowed" />
							</td>

							<td v-if="livraisonType === 'partielle'">
								<input type="number"
									:value="Math.max(item.qtyCommandee - (item.qtyAlreadyDelivered + item.qtyToDeliver), 0)" readonly
									class="border border-black text-center w-full p-1 rounded-md bg-gray-100 cursor-not-allowed" />
							</td>

							<td v-if="livraisonType === 'partielle'">
								<input type="number" v-model.number="item.qtyToDeliver"
									:max="Math.max(item.qtyCommandee - item.qtyAlreadyDelivered, 0)" min="0"
									class="border border-black text-center w-full p-1 rounded-md" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex justify-end gap-4 border-t pt-4">
			<button class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400" type="button" @click="resetForm">
				Annuler
			</button>
			<button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" type="button"
				@click="generateBordereau">
				Enregistrer
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/Sale/OrderStore'
import { useDeliveryStore } from '@/stores/Sale/DeliveryStore'

const router = useRouter()
const livraisonType = ref('')
const selectedCommande = ref('')

// ✅ today = date du jour formatée pour l’input date
const today = new Date().toISOString().split('T')[0]

const form = ref({
	client: '',
	date: '',
	address: '',
	items: []
})

const orderStore = useOrderStore()
const deliveryStore = useDeliveryStore();

const { orders } = storeToRefs(orderStore)

// Chargement des commandes au montage
onMounted(() => {
	orderStore.fetchValidatedOrders("delivered")
})

// Quand une commande est sélectionnée
watch(selectedCommande, (newVal) => {
	if (!newVal) {
		form.value.items = []
		return
	}
	const cmd = orders.value.find(c => c.id === newVal)
	if (cmd && cmd.articles) {
		form.value.items = cmd.articles.map(article => ({
			article_id: article.id,
			designation: article.label,
			code: '',
			serial: '',
			qtyCommandee: article.pivot.quantity,
			qtyAlreadyDelivered: article.pivot.qtyAlreadyDelivered || 0,
			qtyToDeliver: livraisonType.value === 'complete' ? article.pivot.quantity : 0
		}))
	} else {
		form.value.items = []
	}
})

// Reset form
const resetForm = () => {
	selectedCommande.value = ''
	livraisonType.value = ''
	form.value = {
		client: '',
		date: '',
		address: '',
		items: []
	}
}

// Générer bordereau
const generateBordereau = async () => {
	// Vérification champs requis
	if (!selectedCommande.value || !livraisonType.value) {
		Swal.fire({ icon: 'warning', title: 'Attention', text: 'Veuillez sélectionner une commande et un type de livraison.' })
		return
	}

	if (!form.value.date || !form.value.address) {
		Swal.fire({ icon: 'warning', title: 'Champs manquants', text: 'Veuillez renseigner la date et l’adresse de livraison.' })
		return
	}

	// ✅ Vérification date >= aujourd’hui
	if (form.value.date < today) {
		Swal.fire({ icon: 'error', title: 'Date invalide', text: 'La date de livraison ne peut pas être antérieure à aujourd’hui.' })
		return
	}

	if (form.value.items.length === 0) {
		Swal.fire({ icon: 'warning', title: 'Aucun article', text: 'Veuillez ajouter au moins un article.' })
		return
	}

	// ✅ Vérification des quantités
	for (const item of form.value.items) {
		const restante = item.qtyCommandee - item.qtyAlreadyDelivered
		if (item.qtyToDeliver < 0) {
			Swal.fire({ icon: 'error', title: 'Quantité invalide', text: `La quantité à livrer pour ${item.designation} ne peut pas être négative.` })
			return
		}
		if (item.qtyToDeliver > restante) {
			Swal.fire({ icon: 'error', title: 'Quantité invalide', text: `La quantité à livrer pour ${item.designation} ne peut pas dépasser la quantité restante (${restante}).` })
			return
		}
	}

	// Préparer payload
	const payload = {
		order_id: selectedCommande.value,
		delivery_date: form.value.date,
		delivery_address: form.value.address,
		delivery_type: livraisonType.value === 'partielle' ? 'partial' : 'complete',
		items: form.value.items.map(item => ({
			article_id: item.article_id,
			product_code: item.code,
			designation: item.designation,
			serial_number: item.serial,
			quantity_ordered: item.qtyCommandee,
			quantity_delivered: livraisonType.value === 'complete' ? item.qtyCommandee : item.qtyToDeliver
		}))
	}

	// Confirmation
	const confirmResult = await Swal.fire({
		title: 'Confirmer l\'enregistrement ?',
		text: 'Voulez-vous vraiment enregistrer ce bordereau ?',
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: 'Oui',
		cancelButtonText: 'Annuler'
	})

	if (!confirmResult.isConfirmed) return

	try {
		Swal.fire({ title: 'Enregistrement...', text: 'Veuillez patienter', allowOutsideClick: false, didOpen: () => Swal.showLoading() })

		await deliveryStore.store(payload)

		Swal.fire({ icon: 'success', title: 'Succès', text: 'Bordereau enregistré avec succès.' })
		router.push(AppUrl.DELIVERYINFO)
	} catch (error) {
		Swal.fire({ icon: 'error', title: 'Erreur', text: "Une erreur est survenue lors de l'enregistrement" })
		console.error(error)
	}
}
</script>
