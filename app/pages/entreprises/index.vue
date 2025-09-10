<template>

	<!-- En-tête de la page -->
	<div class="sm:flex sm:items-center sm:justify-between mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Liste des Entreprises</h1>
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
			<div class="flex items-center space-x-3">
				<button @click="navigateTo('/entreprises/ajouter')"
					class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
					<Icon name="heroicons:plus-20-solid" class="-ml-1 mr-2 h-5 w-5" />
					Ajouter une entreprise
				</button>
			</div>
		</div>
	</div>

	<Loader v-if="isLoading" message="Chargement des entreprises..." />
	<EmptyState v-else-if="filteredEnterprises.length === 0" title="Aucun utilisateur trouvé"
		:description="noDataDescription" icon="heroicons:user-group" iconColor="text-indigo-400" @reload="fetchEnterprises"
		:isLoading="isLoading" :searchQuery="searchQuery" />

	<!-- État d'erreur -->
	<div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4">
		<p class="text-red-700">Une erreur est survenue: {{ error!.message }}</p>
	</div>

	<!-- Contenu principal -->
	<template v-else>
		<!-- Vue en cartes pour les écrans < lg -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
			<div v-for="entreprise in paginatedEnterprises" :key="entreprise.id"
				class="bg-white overflow-hidden shadow rounded-lg border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
				<div class="p-5 flex-grow">
					<h3 class="text-lg font-medium text-gray-900 truncate">
						<a href="#" @click.prevent="viewEntreprise(entreprise.id)" class="hover:text-blue-600">{{
							entreprise.name
						}}</a>
					</h3>
					<div class="mt-2 text-sm text-gray-500 space-y-2">
						<!-- Email - Bleu -->
						<p class="flex items-center">
							<Icon name="heroicons:envelope" class="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-500" />
							<span class="truncate">{{ entreprise.email }}</span>
						</p>

						<!-- Téléphone - Vert -->
						<p class="flex items-center">
							<Icon name="heroicons:phone" class="flex-shrink-0 mr-1.5 h-5 w-5 text-emerald-500" />
							<span>{{ entreprise.phone }}</span>
						</p>

						<!-- Adresse - Violet -->
						<p class="flex items-start pt-1">
							<Icon name="heroicons:map-pin" class="flex-shrink-0 mr-1.5 h-5 w-5 text-purple-500 mt-0.5" />
							<span>{{ entreprise.address }}</span>
						</p>

						<!-- Offres - Orange -->
						<p class="flex items-center" title="Nombre d'offres">
							<Icon name="heroicons:document-text" class="flex-shrink-0 mr-1.5 h-5 w-5 text-amber-500" />
							<span>{{ entreprise.offersCount }}</span>
						</p>
					</div>
				</div>
				<div class="border-t border-gray-200 px-5 py-3 bg-gray-50 flex justify-end space-x-3">
					<!-- Bouton Détails -->
					<button @click="viewEntreprise(entreprise.id)" class="text-sm font-medium text-blue-600 hover:text-blue-800">
						Détails
					</button>

					<button @click="editEntreprise(entreprise.id)" class="text-sm font-medium text-gray-700 hover:text-blue-600">
						Modifier
					</button>

					<button @click="deleteEntreprise(entreprise.id)" class="text-sm font-medium text-red-600 hover:text-red-800">
						Supprimer
					</button>
				</div>
			</div>
		</div>

		<!-- Vue en liste pour les écrans >= lg -->
		<div class="hidden lg:block">
			<div class="bg-white shadow overflow-hidden sm:rounded-md">
				<ul role="list" class="divide-y divide-gray-200">
					<li v-for="entreprise in paginatedEnterprises" :key="entreprise.id"
						class="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
						<div class="flex-1 min-w-0 cursor-pointer" @click="viewEntreprise(entreprise.id)">
							<p class="text-sm font-medium text-blue-600 truncate">
								{{ entreprise.name }}
							</p>
							<div class="mt-2 flex items-center text-sm text-gray-500">
								<!-- Email - Bleu -->
								<Icon name="heroicons:envelope" class="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-500" />
								<span class="truncate">{{ entreprise.email }}</span>
								<span class="mx-2 text-gray-300">|</span>

								<!-- Téléphone - Vert -->
								<Icon name="heroicons:phone" class="flex-shrink-0 mr-1.5 h-5 w-5 text-emerald-500" />
								<span>{{ entreprise.phone }}</span>
								<span class="mx-2 text-gray-300">|</span>

								<!-- Adresse - Violet -->
								<Icon name="heroicons:map-pin" class="flex-shrink-0 mr-1.5 h-5 w-5 text-purple-500" />
								<span>{{ entreprise.address }}</span>
								<span class="mx-2 text-gray-300">|</span>

								<!-- Offres - Orange -->
								<Icon name="heroicons:document-text" class="flex-shrink-0 mr-1.5 h-5 w-5 text-amber-500" />
								<span>{{ entreprise.offersCount }}</span>
							</div>
						</div>
						<div class="ml-5 flex-shrink-0 flex items-center space-x-2">
							<button @click="editEntreprise(entreprise.id)"
								class="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100" aria-label="Modifier">
								<Icon name="heroicons:pencil-square-20-solid" class="h-5 w-5" />
							</button>
							<button @click="deleteEntreprise(entreprise.id)"
								class="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-gray-100" aria-label="Supprimer">
								<Icon name="heroicons:trash-20-solid" class="h-5 w-5" />
							</button>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<Paginator :totalItems="filteredEnterprises.length" @range-changed="onRangeChanged" />
	</template>

	<div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg p-6 max-w-md w-full">
			<EnterpriseModal action="delete" :enterprise="currentEnterprise!" @cancel="showDeleteModal = false"
				@confirm="handleDeleteEnterprise" />
		</div>
	</div>

</template>

<script setup lang="ts">
useHead({ title: "Liste des Entreprises" });
import { onMounted, ref } from 'vue'
import { useEnterpriseStore } from '@/stores/EnterpriseStore'
import { navigateTo } from '#app'
import type { Entreprise } from '~/models/Enterprise';
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

const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const { enterprises, isLoading } = storeToRefs(enterpriseStore);

console.log("enterprises:", enterprises.value);


const fetchEnterprises = async () => {
	error.value = null
	try {
		await enterpriseStore.fetchEnterprises()
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
	return enterprises.value.filter(entreprise =>
		entreprise.name.toLowerCase().includes(searchQuery.value) ||
		entreprise.email.toLowerCase().includes(searchQuery.value) ||
		entreprise.phone.toLowerCase().includes(searchQuery.value) ||
		entreprise.address.toLowerCase().includes(searchQuery.value) ||
		entreprise.offersCount.toString().toLowerCase().includes(searchQuery.value)
	)
});

const viewEntreprise = (id: string) => navigateTo(AppUrl.parameterize(AppUrl.ENTREPRISE_SHOW, id))

const editEntreprise = (id: string) => navigateTo(AppUrl.parameterize(AppUrl.ENTREPRISE_EDIT, id))

const deleteEntreprise = async (id: string) => {
	console.log("id:", id)
	if (!id) {
		useAlert().showAlert("Erreur de sélection", 'error');
		return;
	}
	showDeleteModal.value = true;
	currentEnterprise.value = enterprises.value.find(entreprise => entreprise.id === id)!
}

onMounted(() => {
	fetchEnterprises()
});

const paginatedEnterprises = computed(() => {
	return filteredEnterprises.value.slice(range.start - 1, range.end)
});
</script>