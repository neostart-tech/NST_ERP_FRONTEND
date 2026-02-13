<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Statistiques (ajoutées) -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<!-- Carte Total Entreprises -->
			<div class="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-sky-900">Total Entreprises</p>
						<p class="text-3xl font-bold text-sky-900 mt-2">{{ stat.total }}</p>
					</div>
					<div class="p-3 rounded-lg bg-sky-500">
						<Icon name="heroicons:building-office" class="w-6 h-6 text-white"/>
					</div>
				</div>
			</div>

			<!-- Carte Entreprises avec offres -->
			<div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-emerald-900">Avec offres</p>
						<p class="text-3xl font-bold text-emerald-900 mt-2">{{ stat.withOffers }}</p>
					</div>
					<div class="p-3 rounded-lg bg-emerald-500">
						<Icon name="heroicons:document-text" class="w-6 h-6 text-white"/>
					</div>
				</div>
			</div>

			<!-- Carte Entreprises sans offres -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-amber-900">Top Entreprise</p>
						<p class="text-xl font-bold text-amber-900 mt-2">{{ stat.topEnterpriseName }}</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:building-library" class="w-6 h-6 text-white"/>
					</div>
				</div>
			</div>
		</div>

		<!-- En-tête de la page -->
		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-2xl font-bold text-gray-900">Liste des Entreprises</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400"/>
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher..."
								 class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"/>
				</div>

				<!-- Boutons d'action (style mis à jour) -->
				<div class="flex items-center space-x-3">
					<button @click="navigateTo('/entreprises/ajouter')"
									class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
						<Icon name="heroicons:plus" class="h-5 w-5 mr-2"/>
						Ajouter une entreprise
					</button>
				</div>
			</div>
		</div>

		<Loader v-if="isLoading" message="Chargement des entreprises..."/>
		<EmptyState v-else-if="filteredEnterprises.length === 0" title="Aucun utilisateur trouvé"
								:description="noDataDescription" icon="heroicons:user-group" iconColor="text-indigo-400"
								@reload="fetchEnterprises"
								:isLoading="isLoading" :searchQuery="searchQuery"/>

		<!-- État d'erreur -->
		<div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4">
			<p class="text-red-700">Une erreur est survenue: {{ error!.message }}</p>
		</div>

		<!-- Contenu principal -->
		<template v-else>
			<!-- Vue en cartes pour les écrans < lg -->
			<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
				<div v-for="entreprise in paginatedEnterprises" :key="entreprise.id + '-card'"
						 class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
					<div class="p-4">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900 mb-2 truncate">
									{{ entreprise.name }}
								</h3>
								<div class="mt-2 space-y-2">
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:envelope" class="w-4 h-4 mr-2 text-blue-500"/>
										<span class="truncate">{{ entreprise.email }}</span>
									</div>
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:phone" class="w-4 h-4 mr-2 text-emerald-500"/>
										<span>{{ entreprise.phone }}</span>
									</div>
									<div class="flex items-start text-sm text-gray-600">
										<Icon name="heroicons:map-pin" class="w-4 h-4 mr-2 text-purple-500 mt-0.5"/>
										<span>{{ entreprise.address }}</span>
									</div>
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:document-text" class="w-4 h-4 mr-2 text-amber-500"/>
										<span>{{ entreprise.offersCount }} offre(s)</span>
									</div>
								</div>
							</div>
						</div>
						<div class="flex justify-end mt-4 space-x-2">
							<button @click.stop="viewEntreprise(entreprise.id)"
											class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full" title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5"/>
							</button>
							<button @click.stop="editEntreprise(entreprise.id)"
											class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full" title="Modifier">
								<Icon name="heroicons:pencil-square" class="w-5 h-5"/>
							</button>
							<button @click.stop="deleteEntreprise(entreprise.id)"
											class="p-1.5 text-red-600 hover:bg-red-50 rounded-full" title="Supprimer">
								<Icon name="heroicons:trash" class="w-5 h-5"/>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
			<div class="hidden lg:block bg-white border p-4 rounded-lg shadow mt-6">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
						<tr>
							<th scope="col"
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Nom
							</th>
							<th scope="col"
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th scope="col"
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Téléphone
							</th>
							<th scope="col"
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Adresse
							</th>
							<th scope="col"
									class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Offres
							</th>
							<th scope="col"
									class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="entreprise in paginatedEnterprises" :key="entreprise.id + '-table'"
								class="hover:bg-gray-50 transition-colors duration-150">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{{ entreprise.name }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500 flex items-center">
									<Icon name="heroicons:envelope" class="w-4 h-4 mr-2 text-blue-500"/>
									{{ entreprise.email }}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500 flex items-center">
									<Icon name="heroicons:phone" class="w-4 h-4 mr-2 text-emerald-500"/>
									{{ entreprise.phone }}
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-500 flex items-start">
									<Icon name="heroicons:map-pin" class="w-4 h-4 mr-2 text-purple-500 mt-0.5"/>
									<span class="line-clamp-2">{{ entreprise.address }}</span>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500 flex items-center">
									<Icon name="heroicons:document-text" class="w-4 h-4 mr-2 text-amber-500"/>
									{{ entreprise.offersCount }}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button @click="viewEntreprise(entreprise.id)" class="text-gray-600 hover:text-gray-900 mr-3"
												title="Voir les détails">
									<Icon name="heroicons:eye" class="w-5 h-5"/>
								</button>
								<button @click="editEntreprise(entreprise.id)" class="text-blue-600 hover:text-blue-900 mr-3"
												title="Modifier">
									<Icon name="heroicons:pencil-square" class="w-5 h-5"/>
								</button>
								<button @click="deleteEntreprise(entreprise.id)" class="text-red-600 hover:text-red-900"
												title="Supprimer">
									<Icon name="heroicons:trash" class="w-5 h-5"/>
								</button>
							</td>
						</tr>
						<tr v-if="filteredEnterprises.length === 0">
							<td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
								<EmptyState title="Aucune entreprise trouvée" :description="noDataDescription"
														icon="heroicons:building-office" iconColor="text-indigo-400" @reload="fetchEnterprises"
														:isLoading="isLoading" :searchQuery="searchQuery"/>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>

			<Paginator :totalItems="filteredEnterprises.length" @range-changed="onRangeChanged"/>
		</template>

		<div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg p-6 max-w-md w-full">
				<EnterpriseModal action="delete" :enterprise="currentEnterprise!" @cancel="showDeleteModal = false"
												 @confirm="handleDeleteEnterprise"/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
useHead({title: "Liste des Entreprises"});
import {onMounted, ref, computed, reactive} from 'vue'
import {storeToRefs} from 'pinia'
import {useEnterpriseStore} from '@/stores/EnterpriseStore'
import {navigateTo} from '#app'
import type {Entreprise} from '~/models/Enterprise';
import EnterpriseModal from '~/app/components/EnterpriseModal.vue';
import Paginator from '~/app/components/Paginator.vue';
import EmptyState from '~/app/components/EmptyState.vue';
import Loader from '~/app/components/Loader.vue';

const enterpriseStore = useEnterpriseStore();
const error = ref<Error | null>(null)
const searchQuery = ref<string>('');
const noDataDescription = ref("Il n'y a actuellement aucune entreprise à afficher.");

const showDeleteModal = ref(false);
const currentEnterprise = ref<Entreprise | null>(null);
const handleDeleteEnterprise = async (isDeleting: Ref<boolean>) => {
	try {
		await enterpriseStore.deleteEnterprise(currentEnterprise.value!.id)
		useAlert().showAlert("Entreprise supprimée avec succès", "success")
		showDeleteModal.value = false;
		currentEnterprise.value = null;
	} catch (e) {
		useAlert().showAlert("Erreur lors de la suppression de l'entreprise", "error")
		console.error("Erreur lors de la suppression:", e)
	} finally {
		isDeleting.value = false;
	}
}

const range = reactive({start: 0, end: 0})

const onRangeChanged = ({start, end}: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const {enterprises, isLoading} = storeToRefs(enterpriseStore);

const stat = computed(() => {
	const total = enterprises.value.length;
	const withOffers = enterprises.value.filter(e => (e.offersCount || 0) > 0).length;

	let topEnterpriseName = "";
	if (total > 0) {
		const top = enterprises.value.reduce((acc, e) =>
				(e.offersCount || 0) > (acc.offersCount || 0) ? e : acc,
			enterprises.value[0]
		);
		topEnterpriseName = top?.name ?? "";
	}

	return { total, withOffers, topEnterpriseName };
});

const fetchEnterprises = async () => {
	error.value = null
	try {
		await enterpriseStore.fetchAll()
	} catch (e) {
		error.value = e as Error
		console.error("Erreur lors de la récupération des entreprises:", e)
	}
}

const filteredEnterprises = computed(() => {
	if (!searchQuery.value) {
		return enterprises.value
	}

	noDataDescription.value = ""
	const q = searchQuery.value.toLowerCase()
	return enterprises.value.filter(entreprise =>
		entreprise.name.toLowerCase().includes(q) ||
		entreprise.email.toLowerCase().includes(q) ||
		entreprise.phone.toLowerCase().includes(q) ||
		entreprise.address.toLowerCase().includes(q) ||
		entreprise.offersCount.toString().toLowerCase().includes(q)
	)
});

const viewEntreprise = (id: string) => navigateTo(AppUrl.parameterize(AppUrl.ENTREPRISE_SHOW, id))

const editEntreprise = (id: string) => navigateTo(AppUrl.parameterize(AppUrl.ENTREPRISE_EDIT, id))

const deleteEntreprise = async (id: string) => {
	if (!id) {
		useAlert().showAlert("Erreur de sélection", 'error');
		return;
	}
	showDeleteModal.value = true;
	currentEntreprise.value = enterprises.value.find(entreprise => entreprise.id === id)!
}

onMounted(() => {
	fetchEnterprises()
});

const paginatedEnterprises = computed(() => {
	return filteredEnterprises.value.slice(range.start - 1, range.end)
});
</script>
