<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- En-tête avec recherche et actions -->
		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-2xl font-bold text-gray-900">Liste des appels d'offres</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400" />
				</div>

				<!-- Bouton Nouveau -->
				<NuxtLink :to="AppUrl.OFFERS_NEW"
					class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
					<Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
					Nouvel appel d'offre
				</NuxtLink>
			</div>
		</div>

		<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
		<div class="hidden lg:block bg-white border p-4 rounded-lg shadow mt-6">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Titre
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Référence
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Entreprise
							</th>
							<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date limite
							</th>
							<th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="offer in paginatedOffers" :key="offer.id + '-table'"
							class="hover:bg-gray-50 transition-colors duration-150">
							<td class="px-6 py-4">
								<div class="text-sm font-medium text-gray-900">{{ offer.title }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ offer.reference || '-' }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ offer.enterprise?.name || '-' }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{{ formatDate(offer.deadline_date) }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<button @click="viewOffer(offer.id)" class="text-gray-600 hover:text-gray-900 mr-3"
									title="Voir les détails">
									<Icon name="heroicons:eye" class="w-5 h-5" />
								</button>
								<button @click="editOffer(offer.id)" class="text-blue-600 hover:text-blue-900 mr-3" title="Modifier">
									<Icon name="heroicons:pencil-square" class="w-5 h-5" />
								</button>
								<button @click="deleteOffer(offer.id)" class="text-red-600 hover:text-red-900" title="Supprimer">
									<Icon name="heroicons:trash" class="w-5 h-5" />
								</button>
							</td>
						</tr>
						<tr v-if="filteredOffers.length === 0">
							<td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
								<EmptyState title="Aucun appel d'offre trouvé" :description="noDataDescription"
									icon="heroicons:document-text" iconColor="text-indigo-400" @reload="loadOffers"
									:isLoading="isLoading" :searchQuery="searchQuery" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
		<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<template v-if="filteredOffers.length > 0">
				<div v-for="offer in paginatedOffers" :key="offer.id + '-card'"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
					<div class="p-4">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">
									{{ offer.title }}
								</h3>
								<div class="mt-2 space-y-2">
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:hashtag" class="w-4 h-4 mr-2 text-gray-400" />
										<span>{{ offer.reference || 'N/A' }}</span>
									</div>
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:building-office" class="w-4 h-4 mr-2 text-gray-400" />
										<span>{{ offer.enterprise?.name || 'N/A' }}</span>
									</div>
									<div class="flex items-center text-sm text-gray-600">
										<Icon name="heroicons:calendar" class="w-4 h-4 mr-2 text-gray-400" />
										<span>{{ formatDate(offer.deadline_date) }}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="flex justify-end mt-4 space-x-2">
							<button @click.stop="viewOffer(offer.id)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
								title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5" />
							</button>
							<button @click.stop="editOffer(offer.id)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
								title="Modifier">
								<Icon name="heroicons:pencil-square" class="w-5 h-5" />
							</button>
							<button @click.stop="deleteOffer(offer.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
								title="Supprimer">
								<Icon name="heroicons:trash" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="col-span-full">
					<EmptyState title="Aucun appel d'offre trouvé" :description="noDataDescription"
						icon="heroicons:document-text" iconColor="text-indigo-400" @reload="loadOffers"
						:isLoading="isLoading" :searchQuery="searchQuery" />
				</div>
			</template>
		</div>

		<Paginator :totalItems="filteredOffers.length" @range-changed="onRangeChanged" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppUrl } from '@/composables/appUrl'
import Paginator from '~/app/components/Paginator.vue'
import EmptyState from '~/app/components/EmptyState.vue'
import Swal from 'sweetalert2'

definePageMeta({
	layout: 'default',
})

const offerStore = useOfferStore()
const router = useRouter()
const isLoading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const noDataDescription = ref("Il n'y a actuellement aucun appel d'offre à afficher.")

const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number; end: number }) => {
	range.start = start
	range.end = end
}

// Filtrage des offres
const filteredOffers = computed(() => {
	const offers = offerStore.offers || []
	if (!searchQuery.value) {
		noDataDescription.value = "Il n'y a actuellement aucun appel d'offre à afficher."
		return offers
	}

	noDataDescription.value = ""
	const term = searchQuery.value.toLowerCase()
	return offers.filter(offer =>
		offer.title?.toLowerCase().includes(term) ||
		offer.reference?.toLowerCase().includes(term) ||
		offer.enterprise?.name?.toLowerCase().includes(term)
	)
})

// Offres paginées
const paginatedOffers = computed(() => {
	return filteredOffers.value.slice(range.start - 1, range.end)
})

// Charger les offres
const loadOffers = async () => {
	isLoading.value = true
	error.value = null
	try {
		await offerStore.fetchOffers()
	} catch (err) {
		error.value = err
		console.error('Erreur:', err)
	} finally {
		isLoading.value = false
	}
}

// Formatter la date
const formatDate = (date: string) => {
	if (!date) return '-'
	return new Date(date).toLocaleDateString('fr-FR')
}

// Fonction pour voir une offre
const viewOffer = (offerId: string) => {
	router.push(`/offers/${offerId}`)
}

// Fonction pour éditer une offre
const editOffer = (offerId: string) => {
	router.push(`/offers/${offerId}/modifier`)
}

// Fonction pour supprimer une offre
const deleteOffer = async (offerId: string) => {
	Swal.fire({
		title: 'Supprimer l\'appel d\'offre ?',
		text: 'Êtes-vous sûr de vouloir supprimer cet appel d\'offre ? Cette action est irréversible.',
		icon: 'question',
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		cancelButtonColor: '#3085d6',
		confirmButtonColor: '#d33',
		confirmButtonText: 'Oui, supprimer !'
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await offerStore.deleteOffer(offerId)
				Swal.fire({ icon: 'success', title: 'Succès', text: 'Appel d\'offre supprimé avec succès', timer: 2000, showConfirmButton: false })
				await offerStore.fetchOffers()
			} catch (error) {
				Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer l\'appel d\'offre' })
			}
		}
	})
}

// Charger les données au montage
onMounted(() => {
	loadOffers()
})
</script>
