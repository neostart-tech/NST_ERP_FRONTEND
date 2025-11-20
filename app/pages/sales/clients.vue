<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- En-tête -->
		<!-- <div class="relative mb-4">
			<div class="bg-gradient-to-r from-sky-600 to-sky-700 rounded-lg shadow p-4 text-white overflow-hidden">
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
		</div> -->

		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			<!-- Carte Total Clients -->
			<div
				class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Clients</p>
						<p class="text-3xl font-bold text-gray-900">
							{{ stat.total }}
						</p>
					</div>
					<div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:user-group" class="w-6 h-6 text-sky-600" />
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
							{{ stat.physique }}
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
							{{ stat.moral }}
						</p>
					</div>
					<div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
						<Icon name="heroicons:building-office" class="w-6 h-6 text-amber-600" />
					</div>
				</div>
			</div>
		</div>

		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-2xl font-bold text-gray-900">Liste des clients</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400" />
				</div>

				<!-- Boutons d'action -->
				<button @click="openModalForCreate"
					class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
					<Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
					Nouveau client
				</button>
			</div>
		</div>

		<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
		<div class="hidden lg:block bg-white border p-4 rounded-lg shadow mt-6">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Nom / Raison Sociale
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
						<tr v-for="client in paginatedClients" :key="client.id + '-table'"
							class="hover:bg-gray-50 transition-colors duration-150">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900" v-if="client.client_type === 'Physique'">
									{{ client.last_name }} {{ client.first_name }}
									<Icon name="heroicons:user" class="w-4 h-4 text-emerald-600 inline-block ml-1" />
								</div>
								<div class="text-sm font-medium text-gray-900" v-else>
									{{ client.company_name }}
									<Icon name="heroicons:building-office" class="w-4 h-4 text-amber-600 inline-block ml-1" />
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ client.email || '-' }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ client.phone || '-' }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button @click="editClient(client)" class="text-blue-600 hover:text-blue-900 mr-3" title="Modifier">
									<Icon name="heroicons:pencil-square" class="w-5 h-5" />
								</button>
								<button @click="viewClient(client)" class="text-gray-600 hover:text-gray-900 mr-3" title="Voir les détails">
									<Icon name="heroicons:eye" class="w-5 h-5" />
								</button>
								<button @click="deleteClient(client)" class="text-red-600 hover:text-red-900" title="Supprimer">
									<Icon name="heroicons:trash" class="w-5 h-5" />
								</button>
							</td>
						</tr>
						<tr v-if="filteredClients.length === 0">
							<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
								<EmptyState title="Aucun client trouvé" :description="noDataDescription" icon="heroicons:user-group"
									iconColor="text-indigo-400" @reload="fetchClients" :isLoading="isLoading"
									:searchQuery="searchQuery" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
		<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<template v-if="filteredClients.length > 0">
				<div v-for="client in paginatedClients" :key="client.id + '-card'"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200"
					:class="{ 'bg-amber-100': client.client_type === 'Moral', 'bg-emerald-100': client.client_type === 'Physique' }">
					<div class="p-4">
						<div class="flex items-start justify-between">
							<div>
								<div class="flex items-center">
									<h3 class="text-lg font-semibold text-gray-900">
										<template v-if="client.client_type === 'Physique'">
											{{ client.last_name }} {{ client.first_name }}
										</template>
										<template v-else>
											{{ client.company_name }}
										</template>
									</h3>
								</div>
								<div class="mt-2">
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:envelope" class="w-4 h-4 mr-2 text-gray-400" />
										<span>{{ client.email || 'Non renseigné' }}</span>
									</div>
									<div class="flex items-center text-sm text-gray-600 mt-1">
										<Icon name="heroicons:phone" class="w-4 h-4 mr-2 text-gray-400" />
										<span>{{ client.phone || 'Non renseigné' }}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="flex justify-end mt-2">
								<button @click.stop="editClient(client)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full" title="Modifier">
									<Icon name="heroicons:pencil-square" class="w-5 h-5" />
								</button>
								<button @click.stop="viewClient(client)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full" title="Voir les détails">
									<Icon name="heroicons:eye" class="w-5 h-5" />
								</button>
								<button @click.stop="deleteClient(client)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full" title="Supprimer">
									<Icon name="heroicons:trash" class="w-5 h-5" />
								</button>
							</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="col-span-full">
					<EmptyState title="Aucun client trouvé" :description="noDataDescription" icon="heroicons:user-group"
						iconColor="text-indigo-400" @reload="fetchClients" :isLoading="isLoading"
						:searchQuery="searchQuery" />
				</div>
			</template>
		</div>

		<Paginator :totalItems="filteredClients.length" @range-changed="onRangeChanged" />

		<!-- Modal Client -->
		<div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
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

					<form @submit.prevent="handleSave">
						<!-- Contenu du formulaire -->
						<div class="px-6 py-4">
							<div class="space-y-6">
								<!-- Type de client -->
								<div>
									<label for="client-type" class="block text-sm font-medium text-gray-700 mb-1">Type de client</label>
									<select id="client-type" v-model="newClient.client_type"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border">
										<option value="">Sélectionnez un type de client</option>
										<option value="Physique">Particulier</option>
										<option value="Moral">Entreprise</option>
									</select>
									<InvalidInput :error="errors.client_type" />
								</div>

								<!-- Formulaire Client Physique -->
								<div v-if="newClient.client_type == 'Physique'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div class="space-y-1">
										<label class="block text-sm font-medium text-gray-700">Nom</label>
										<input v-model="newClient.last_name" type="text" name="last_name"
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
										<InvalidInput :error="errors.last_name" />
									</div>
									<div class="space-y-1">
										<label class="block text-sm font-medium text-gray-700">Prénom</label>
										<input v-model="newClient.first_name" type="text" name="first_name"
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
										<InvalidInput :error="errors.first_name" />
									</div>
								</div>

								<!-- Formulaire Client Moral -->
								<div v-if="newClient.client_type == 'Moral'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div class="space-y-1 sm:col-span-2">
										<label class="block text-sm font-medium text-gray-700">Raison Sociale</label>
										<input v-model="newClient.company_name" type="text" name="company_name"
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
										<InvalidInput :error="errors.company_name" />
									</div>
								</div>

								<!-- Formulaire Client Moral -->
								<div v-if="newClient.client_type !== ''" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div class="space-y-1">
										<label class="block text-sm font-medium text-gray-700">Email</label>
										<input v-model="newClient.email" type="email" name="email"
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
										<InvalidInput :error="errors.email" />
									</div>
									<div class="space-y-1">
										<label class="block text-sm font-medium text-gray-700">Téléphone</label>
										<input v-model="newClient.phone" type="tel" name="phone"
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
										<InvalidInput :error="errors.phone" />
									</div>
									<div class="space-y-1">
										<label class="block text-sm font-medium text-gray-700">Région</label>
										<input v-model="newClient.region" type="text" name="region"
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
										<InvalidInput :error="errors.region" />
									</div>
									<div class="space-y-1">
										<label class="block text-sm font-medium text-gray-700">Ville</label>
										<input v-model="newClient.city" type="text" name="city"
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
										<InvalidInput :error="errors.city" />
									</div>
									<div class="space-y-1 sm:col-span-2">
										<label class="block text-sm font-medium text-gray-700">Pays</label>
										<input v-model="newClient.country" type="text" name="country"
											class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
										<InvalidInput :error="errors.country" />
									</div>
								</div>
							</div>

							<!-- Pied de page du modal -->
							<div class="bg-gray-50 px-6 py-4 mt-4 sm:flex sm:flex-row-reverse sm:px-6">
								<button type="submit"
									class="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">
									{{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}
								</button>
								<button type="button" @click="showModal = false"
									class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
									Annuler
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Affichage Client -->
	<div v-if="showViewModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="bg-white p-6 rounded-lg w-96 shadow-lg">
			<h3 class="text-lg font-semibold mb-4">Informations Client</h3>

			<div class="space-y-2">
				<p><strong>Type :</strong> {{ selectedClient!.client_type || selectedClient!.client_type }}</p>
				<p v-if="selectedClient!.client_type === 'Physique' || selectedClient!.client_type === 'Physique'">
					<strong>Nom :</strong> {{ selectedClient!.last_name }}<br>
					<strong>Prénom :</strong> {{ selectedClient!.first_name }}
				</p>
				<p v-if="selectedClient!.client_type === 'Moral' || selectedClient!.client_type === 'Moral'">
					<strong>Raison Sociale :</strong> {{ selectedClient!.company_name || selectedClient!.company_name }}
				</p>
				<p><strong>Email :</strong> {{ selectedClient!.email }}</p>
				<p><strong>Téléphone :</strong> {{ selectedClient!.phone }}</p>
				<p><strong>Région :</strong> {{ selectedClient!.region }}</p>
				<p><strong>Ville :</strong> {{ selectedClient!.city }}</p>
				<p><strong>Pays :</strong> {{ selectedClient!.country }}</p>
			</div>

			<div class="flex justify-end mt-4">
				<button @click="showViewModal = false"
					class="px-4 py-2 bg-red-300 rounded-[15px] hover:bg-red-700 hover:text-white">Fermer</button>
			</div>
		</div>
	</div>

</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Swal from 'sweetalert2'
import { defaultClient, type Client } from '~/models/Client'
import { useClientStore } from '~/app/stores/ClientStore'
import InvalidInput from '~/app/components/partials/InvalidInput.vue';
import Paginator from '~/app/components/Paginator.vue';
import EmptyState from '~/app/components/EmptyState.vue';
// TODO: Ajouter un spinner aux bouton d'enregistrement
const clientStore = useClientStore();
const { clients, errors, isLoading, stat } = storeToRefs(clientStore);

const showModal = ref(false)
const isEditing = ref(false)
const clientId = ref<string | null>(null);
const error = ref<Error | null>(null);

const searchQuery = ref<string>('');
const noDataDescription = ref("Il n'y a actuellement aucune entreprise à afficher.");

const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const filteredClients = computed(() => {
	if (!searchQuery.value) {
		return clients.value
	}

	noDataDescription.value = ""
	return clients.value.filter(_ =>
		_.first_name?.toLowerCase().includes(searchQuery.value) ||
		_.last_name?.toLowerCase().includes(searchQuery.value) ||
		_.phone?.toLowerCase().includes(searchQuery.value) ||
		_.company_name?.toLowerCase().includes(searchQuery.value) ||
		_.city?.toString().toLowerCase().includes(searchQuery.value)
	)
});

const paginatedClients = computed(() => {
	return filteredClients.value.slice(range.start - 1, range.end)
});

// Référence pour le modal
const modalRef = ref(null)

const newClient = ref(defaultClient());

const fetchClients = async () => {
	try {
		await clientStore.fetchClients()
	} catch (e) {
		error.value = e as Error
		console.error("Erreur lors de la récupération des entreprises:", e)
	}
}


// Charger les clients au montage
onMounted(async () => {
	await fetchClients();
})

// Ouvrir modal pour créer un client
const openModalForCreate = async () => {
	resetForm()
	isEditing.value = false
	showModal.value = true
	// Forcer le re-rendu
	await nextTick()
	if (modalRef.value) {
		// @ts-ignore
		modalRef.value.focus()
	}
}

const selectedClient = ref<Client | null>(null)
const showViewModal = ref(false)

const viewClient = (client: Client) => {
	selectedClient.value = client
	showViewModal.value = true
}

// Créer ou mettre à jour selon le mode
const handleSave = async () => {
	// Validation du type
	if (!newClient.value.client_type) {
		Swal.fire({
			icon: 'warning',
			title: 'Attention',
			text: 'Le type de client est requis !'
		})
		return
	}

	// Validation selon le type
	if (newClient.value.client_type === 'Physique') {
		newClient.value.company_name = '';
		if (!newClient.value.first_name || !newClient.value.last_name) {
			Swal.fire({
				icon: 'warning',
				title: 'Attention',
				text: 'Le nom et prénom sont obligatoires pour un client physique.'
			})
			return
		}
	} else if (newClient.value.client_type === 'Moral') {
		newClient.value.first_name = '';
		newClient.value.last_name = '';
		if (!newClient.value.company_name) {
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
	Swal.fire({
		title: 'Ajouter le client ?',
		html: `Êtes-vous sûr de vouloir ajouter le client <b>${newClient.value.company_name || newClient.value.first_name + ' ' + newClient.value.last_name}</b> ?`,
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: 'Oui',
		cancelButtonText: 'Non',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		reverseButtons: true
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await clientStore.createClient(newClient.value);
				Swal.fire({ icon: 'success', title: 'Succès', text: 'Client enregistré avec succès', timer: 2000, showConfirmButton: false });
				await clientStore.fetchClients();
				// await clientStore.fetchStat();
				resetForm();
				showModal.value = false;
			} catch (error) {
				console.error(error)
				Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible d\'enregistrer le client' })
			}
		} else {
			resetForm();
		}
	});
}

// Préparer le formulaire pour édition
const editClient = (client: Client) => {
	isEditing.value = true
	showModal.value = true
	clientId.value = client.id
	// @ts-ignore
	newClient.value = {
		type: client.client_type || '',
		first_name: client.first_name || '',
		last_name: client.last_name || '',
		company_name: client.company_name || '',
		email: client.email || '',
		phone: client.phone || '',
		region: client.region || '',
		country: client.country || '',
		city: client.city || ''
	} as Client
}

// Mettre à jour un client existant
const updateClient = async () => {
	Swal.fire({
		title: 'Mettre à jour le client ?',
		html: `Êtes-vous sûr de vouloir mettre à jour le client <b>${newClient.value.company_name || newClient.value.first_name + ' ' + newClient.value.last_name}</b> ?`,
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: 'Oui',
		cancelButtonText: 'Non',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		reverseButtons: true
	}).then(async (result) => {
		if (result.isConfirmed) {
			try {
				await clientStore.updateClient(clientId.value!, newClient.value)
				Swal.fire({ icon: 'success', title: 'Succès', text: 'Client modifié avec succès', timer: 2000, showConfirmButton: false })
				await clientStore.fetchClients()
				// await clientStore.fetchStats()
				resetForm()
				showModal.value = false
			} catch (error) {
				Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de modifier le client' })
			}
		}
	});
}

// Supprimer un client existant
const deleteClient = async (client: Client) => {
	Swal.fire({
		title: 'Supprimer le client ?',
		html: `Êtes-vous sûr de vouloir supprimer le client <b>${client.company_name || client.first_name + ' ' + client.last_name}</b> ?`,
		icon: 'question',
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		cancelButtonColor: '#3085d6',
		confirmButtonColor: '#d33',
		confirmButtonText: 'Oui, supprimer !'
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await clientStore.deleteClient(client.id)
				Swal.fire({ icon: 'success', title: 'Succès', text: 'Client supprimé avec succès', showConfirmButton: false })
				await clientStore.fetchClients()
			} catch (error) {
				Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer le client' })
			}
		}
	})
};

// Réinitialiser le formulaire
const resetForm = () => {
	newClient.value = defaultClient();
	isEditing.value = false
	clientId.value = null
	// Ne pas modifier showModal ici, c'est géré par openModalForCreate
}
</script>
