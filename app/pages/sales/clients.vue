<template>
	<div class="max-w-6xl mx-auto p-6 space-y-6">
		<!-- En-tête -->
		<div class="relative mb-4">
			<div class="bg-gradient-to-r from-sky-600 to-sky-700 rounded-lg shadow p-4 text-white overflow-hidden">
				<!-- Motif de fond décoratif simplifié -->
				<div class="absolute inset-0 opacity-5">
					<div class="absolute -top-8 -right-8 w-20 h-20 bg-white rounded-full"></div>
				</div>
				<div>
					<h1 class="text-xl font-bold">Gestion des Clients</h1>
					<p class="text-sky-100 text-sm mt-1">
						Créer et suivez vos clients physiques et moraux
					</p>
				</div>
			</div>
		</div>

		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Carte Total Clients -->
			<div
				class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Clients</p>
						<p class="text-3xl font-bold text-gray-900">
							{{ clientStore.stat.total }}
						</p>
					</div>
					<div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:user-group" class="w-6 h-6 text-sky-600" />
					</div>
				</div>
			</div>

			<!-- Carte Nouveaux Clients (Mois) -->
			<div
				class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Nouveaux (Mois)</p>
						<p class="text-3xl font-bold text-purple-600">
							{{ clientStore.stat.newThisMonth || 0 }}
						</p>
						<p class="text-xs text-gray-500 mt-1">+5% vs mois dernier</p>
					</div>
					<div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:sparkles" class="w-6 h-6 text-purple-600" />
					</div>
				</div>
			</div>

			<!-- Carte Clients Physiques -->
			<div
				class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Clients Physiques</p>
						<p class="text-3xl font-bold text-emerald-600">
							{{ clientStore.stat.physique }}
						</p>
					</div>
					<div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:user" class="w-6 h-6 text-emerald-600" />
					</div>
				</div>
			</div>

			<!-- Carte Clients Moraux -->
			<div
				class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Clients Moraux</p>
						<p class="text-3xl font-bold text-amber-600">
							{{ clientStore.stat.moral }}
						</p>
					</div>
					<div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:building-office" class="w-6 h-6 text-amber-600" />
					</div>
				</div>
			</div>
		</div>

		<div class="flex justify-between items-center mb-6">
			<h2 class="text-lg font-semibold text-gray-800">Liste des Clients</h2>
			<button @click="openModalForCreate"
				class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
				<Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
				Nouveau client
			</button>
		</div>
		<!-- Liste des Clients -->
		<div class="bg-white border p-4 rounded-lg shadow mt-6">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Nom
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Prénom
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Téléphone
							</th>
							<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="client in clientStore.clients" :key="client.id"
							class="hover:bg-gray-50 transition-colors duration-150">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{{ client.last_name }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{{ client.first_name }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ client.email || '-' }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ client.phone || '-' }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button @click="editClient(client)" class="text-blue-600 hover:text-blue-900 mr-4">
									<Icon name="heroicons:pencil-square" class="w-5 h-5" />
								</button>
								<button @click="viewClient(client)" class="text-gray-600 hover:text-gray-900">
									<Icon name="heroicons:eye" class="w-5 h-5" />
								</button>
							</td>
						</tr>
						<tr v-if="clientStore.clients.length === 0">
							<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
								Aucun client trouvé
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Modal Client -->
		<div class="fixed inset-0 z-50 overflow-y-auto">
			<div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="showModal = false"></div>

			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
					<!-- En-tête -->
					<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div
								class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
								<Icon name="heroicons:user-circle" class="h-6 w-6 text-blue-600" />
							</div>
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
								<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
									{{ isEditing ? 'Modifier le client' : 'Nouveau client' }}
								</h3>
							</div>
						</div>
					</div>

					<!-- Contenu du formulaire -->
					<div class="px-6 py-4">
						<div class="space-y-6">
							<!-- Type de client -->
							<div>
								<label for="client-type" class="block text-sm font-medium text-gray-700 mb-1">Type de client</label>
								<select id="client-type" v-model="newClient.type"
									class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border">
									<option value="">Sélectionnez un type de client</option>
									<option value="Physique">Particulier</option>
									<option value="Moral">Entreprise</option>
								</select>
							</div>

							<!-- Formulaire Client Physique -->
							<div v-if="newClient.type == 'Physique'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div class="space-y-1">
									<label class="block text-sm font-medium text-gray-700">Nom</label>
									<input v-model="newClient.last_name" type="text"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
								</div>
								<div class="space-y-1">
									<label class="block text-sm font-medium text-gray-700">Prénom</label>
									<input v-model="newClient.first_name" type="text"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
								</div>
							</div>

							<!-- Formulaire Client Moral -->
							<div v-if="newClient.type == 'Moral'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div class="space-y-1 sm:col-span-2">
									<label class="block text-sm font-medium text-gray-700">Raison Sociale</label>
									<input v-model="newClient.companyName" type="text"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
								</div>
							</div>

							<!-- Formulaire Client Moral -->
							<div v-if="newClient.type !== ''" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div class="space-y-1">
									<label class="block text-sm font-medium text-gray-700">Email</label>
									<input v-model="newClient.email" type="email"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
								</div>
								<div class="space-y-1">
									<label class="block text-sm font-medium text-gray-700">Téléphone</label>
									<input v-model="newClient.phone" type="tel"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
								</div>
								<div class="space-y-1">
									<label class="block text-sm font-medium text-gray-700">Région</label>
									<input v-model="newClient.region" type="text"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
								</div>
								<div class="space-y-1">
									<label class="block text-sm font-medium text-gray-700">Ville</label>
									<input v-model="newClient.city" type="text"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
								</div>
								<div class="space-y-1 sm:col-span-2">
									<label class="block text-sm font-medium text-gray-700">Pays</label>
									<input v-model="newClient.country" type="text"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
								</div>
							</div>
						</div>

						<!-- Pied de page du modal -->
						<div class="bg-gray-50 px-6 py-4 mt-4 sm:flex sm:flex-row-reverse sm:px-6">
							<button type="button" @click="handleSave"
								class="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">
								{{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}
							</button>
							<button type="button" @click="showModal = false"
								class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
								Annuler
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Affichage Client -->
	<div v-if="showViewModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="bg-white p-6 rounded-lg w-96 shadow-lg">
			<h3 class="text-lg font-semibold mb-4">Informations Client</h3>

			<div class="space-y-2">
				<p><strong>Type :</strong> {{ selectedClient.type || selectedClient.client_type }}</p>
				<p v-if="selectedClient.type === 'Physique' || selectedClient.client_type === 'Physique'">
					<strong>Nom :</strong> {{ selectedClient.last_name }}<br>
					<strong>Prénom :</strong> {{ selectedClient.first_name }}
				</p>
				<p v-if="selectedClient.type === 'Moral' || selectedClient.client_type === 'Moral'">
					<strong>Raison Sociale :</strong> {{ selectedClient.company_name || selectedClient.companyName }}
				</p>
				<p><strong>Email :</strong> {{ selectedClient.email }}</p>
				<p><strong>Téléphone :</strong> {{ selectedClient.phone }}</p>
				<p><strong>Région :</strong> {{ selectedClient.region }}</p>
				<p><strong>Ville :</strong> {{ selectedClient.city }}</p>
				<p><strong>Pays :</strong> {{ selectedClient.country }}</p>
			</div>

			<div class="flex justify-end mt-4">
				<button @click="showViewModal = false"
					class="px-4 py-2 bg-red-300 rounded-[15px] hover:bg-red-700 hover:text-white">Fermer</button>
			</div>
		</div>
	</div>

</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useClientStore } from '~/app/stores/sale/client'
import Swal from 'sweetalert2'
import { defaultClient } from '~/models/Client'

const clientStore = useClientStore()
console.log("clients: ", clientStore.clients)

const showModal = ref(false)
const isEditing = ref(false)
const clientId = ref(null)

// Référence pour le modal
const modalRef = ref(null)

const newClient = ref(defaultClient())

// Charger les clients au montage
onMounted(() => {
	clientStore.fetchClients()
	// clientStore.fetchStats()
})

// Ouvrir modal pour créer un client
const openModalForCreate = async () => {
	console.log('openModalForCreate appelé')
	resetForm()
	isEditing.value = false
	showModal.value = true
	console.log('showModal après mise à jour:', showModal.value)
	// Forcer le re-rendu
	await nextTick()
	if (modalRef.value) {
		modalRef.value.focus()
	}
}

const selectedClient = ref(null)
const showViewModal = ref(false)

const viewClient = (client) => {
	selectedClient.value = client
	showViewModal.value = true
}

// Créer ou mettre à jour selon le mode
const handleSave = async () => {
	// Validation du type
	if (!newClient.value.type) {
		Swal.fire({
			icon: 'warning',
			title: 'Attention',
			text: 'Le type de client est requis !'
		})
		return
	}

	// Validation selon le type
	if (newClient.value.type === 'Physique') {
		if (!newClient.value.first_name || !newClient.value.last_name) {
			Swal.fire({
				icon: 'warning',
				title: 'Attention',
				text: 'Le nom et prénom sont obligatoires pour un client physique.'
			})
			return
		}
	} else if (newClient.value.type === 'Moral') {
		if (!newClient.value.companyName) {
			Swal.fire({
				icon: 'warning',
				title: 'Attention',
				text: 'La raison sociale est obligatoire pour un client moral.'
			})
			return
		}
	}

	// Si tout est bon, enregistrer ou mettre à jour
	if (isEditing.value) {
		await updateClient()
	} else {
		await saveClient()
	}
}


// Enregistrer un nouveau client
const saveClient = async () => {
	try {
		await clientStore.createClients(newClient.value);
		Swal.fire({ icon: 'success', title: 'Succès', text: 'Client enregistré avec succès', timer: 2000, showConfirmButton: false })
		await clientStore.fetchClients()
		await clientStore.fetchStats()
		resetForm()
	} catch (error) {
		console.error(error)
		Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible d’enregistrer le client' })
	}
}

// Préparer le formulaire pour édition
const editClient = (client) => {
	isEditing.value = true
	showModal.value = true
	clientId.value = client.id
	newClient.value = {
		type: client.client_type || '',
		first_name: client.first_name || '',
		last_name: client.last_name || '',
		companyName: client.company_name || '',
		email: client.email || '',
		phone: client.phone || '',
		region: client.region || '',
		country: client.country || '',
		city: client.city || ''
	}
}

// Mettre à jour un client existant
const updateClient = async () => {
	try {
		const payload = {
			first_name: newClient.value.first_name,
			last_name: newClient.value.last_name,
			email: newClient.value.email,
			phone: newClient.value.phone,
			client_type: newClient.value.type,
			country: newClient.value.country,
			region: newClient.value.region,
			city: newClient.value.city,
			company_name: newClient.value.companyName
		}

		await clientStore.updateClient(clientId.value, payload)
		Swal.fire({ icon: 'success', title: 'Succès', text: 'Client modifié avec succès', timer: 2000, showConfirmButton: false })
		await clientStore.fetchClients()
		await clientStore.fetchStats()
		resetForm()
	} catch (error) {
		console.error(error)
		Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de modifier le client' })
	}
}

// Réinitialiser le formulaire
const resetForm = () => {
	newClient.value = {
		type: '',
		first_name: '',
		last_name: '',
		companyName: '',
		email: '',
		phone: '',
		region: '',
		country: '',
		city: ''
	}
	isEditing.value = false
	clientId.value = null
	// Ne pas modifier showModal ici, c'est géré par openModalForCreate
}


</script>
