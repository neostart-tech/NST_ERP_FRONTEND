<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" role="main">

		<!-- Affichage des erreurs avec animation -->
		<!-- <transition name="fade">
			<div v-if="!error" class="mb-4 p-4 bg-red-50 border-l-4 border-red-600" role="alert" aria-live="assertive">
				<div class="flex">
					<div class="flex-shrink-0">
						<Icon name="heroicons:exclamation-circle" class="h-5 w-5 text-red-500" />
					</div>
					<div class="ml-3">
						<p class="text-sm text-red-700">
							Une erreur est survenue: {{ "error.message" }}
							<button @click="refreshData" class="ml-2 text-red-600 hover:text-red-500 underline">
								Réessayer
							</button>
						</p>
					</div>
				</div>
			</div>
		</transition> -->

		<div class="flex justify-end items-center mb-6">
			<NuxtLink :to="AppUrl.OFFERS_NEW"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full md:w-auto"
				aria-label="Créer un nouvel appel d'offres">
				<Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
				Nouvel appel d'offre
			</NuxtLink>
		</div>

		<!-- Barre de filtres -->
		<div class="mb-6 bg-gray-50 p-4 rounded-lg shadow-md">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Champ de recherche -->
				<div class="space-y-1">
					<label for="search" class="block text-sm font-medium text-gray-700">Recherche</label>
					<input id="search" v-model="filters.search" type="text"
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						placeholder="Titre, référence..." @keyup.enter="currentPage = 1">
				</div>

				<!-- Filtre par statut -->
				<div class="space-y-1">
					<label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
					<select id="status" v-model="filters.status"
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						@change="currentPage = 1">
						<option value="">Tous les statuts</option>
						<option value="draft">Brouillon</option>
						<option value="active">Actif</option>
						<option value="submitted">Soumis</option>
						<option value="evaluation">En évaluation</option>
						<option value="won">Gagné</option>
						<option value="lost">Perdu</option>
					</select>
				</div>

				<!-- Tri par -->
				<div class="space-y-1">
					<label for="sort-by" class="block text-sm font-medium text-gray-700">Trier par</label>
					<select id="sort-by" v-model="filters.sortBy"
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						@change="currentPage = 1">
						<option value="date">Date de publication</option>
						<option value="title">Titre</option>
						<option value="budget">Budget</option>
					</select>
				</div>

				<!-- Ordre de tri -->
				<div class="space-y-1">
					<label for="sort-order" class="block text-sm font-medium text-gray-700">Ordre</label>
					<select id="sort-order" v-model="filters.sortOrder"
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
						@change="currentPage = 1">
						<option value="asc">Croissant</option>
						<option value="desc">Décroissant</option>
					</select>
				</div>
			</div>

			<!-- Bouton de réinitialisation -->
			<div class="mt-3 flex justify-end">
				<button type="button" @click="resetFilters" class="text-sm text-blue-600 hover:text-blue-800 font-medium"
					:disabled="!hasActiveFilters" :class="{ 'opacity-50 cursor-not-allowed': !hasActiveFilters }">
					Réinitialiser les filtres
				</button>
			</div>
		</div>

		<!-- Liste des soumissions (à implémenter) -->
		<div class="bg-white shadow overflow-hidden sm:rounded-lg">
			<div class="px-4 py-5 sm:px-6">
				<h3 class="text-lg leading-6 font-medium text-gray-900">
					Liste des soumissions
				</h3>
				<p class="mt-1 max-w-2xl text-sm text-gray-500">
					Voici la liste de toutes vos soumissions d'offres.
				</p>
			</div>
			<div class="border-t border-gray-200 px-4 py-5 sm:p-0">
				<!-- Contenu de la liste à implémenter -->
				<div class="py-12 text-center text-gray-500">
					<p>Utilisez le bouton "Nouvelle soumission" pour commencer.</p>
				</div>
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AppUrl } from '@/composables/appUrl';

definePageMeta({
	layout: 'default',
});

// État pour les filtres
const filters = ref({
	status: '',
	search: '',
	sortBy: 'date',
	sortOrder: 'desc'
});

// Réinitialise tous les filtres
const resetFilters = () => {
	filters.value = {
		status: '',
		search: '',
		sortBy: 'date',
		sortOrder: 'desc'
	}
	currentPage.value = 1
};

// Vérifie s'il y a des filtres actifs
const hasActiveFilters = computed(() => {
	console.log("Called");

	return filters.value.status !== '' ||
		filters.value.search !== '' ||
		filters.value.sortBy !== 'date' ||
		filters.value.sortOrder !== 'desc'
}
);

const currentPage = ref(1);
const itemsPerPage = ref(5);

const error = shallowRef<Error | null>(null);
const isLoading = ref(false);

const offerStore = useOfferStore();

// Methods
const refreshData = async (): Promise<void> => {
	if (isLoading.value) return

	isLoading.value = true
	error.value = null

	try {
		await offerStore.fetchOffers();
		useAlert().showAlert("Données mise à jour", "info");
	} catch (err) {
		console.error('Erreur lors du chargement des offres:', err)
		error.value = err instanceof Error
			? err
			: new Error('Une erreur est survenue lors du chargement des données')
	} finally {
		isLoading.value = false
	}
}
</script>
