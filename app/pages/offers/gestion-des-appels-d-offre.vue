<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" role="main">
		<!-- Affichage des erreurs avec animation -->
		<transition name="fade">
			<div v-if="error" class="mb-4 p-4 bg-red-50 border-l-4 border-red-600" role="alert" aria-live="assertive">
				<div class="flex">
					<div class="flex-shrink-0">
						<Icon name="heroicons:exclamation-circle" class="h-5 w-5 text-red-500" />
					</div>
					<div class="ml-3">
						<p class="text-sm text-red-700">
							Une erreur est survenue: {{ error.message }}
							<button @click="refreshData" class="ml-2 text-red-600 hover:text-red-500 underline">
								Réessayer
							</button>
						</p>
					</div>
				</div>
			</div>
		</transition>

		<!-- Metrics Grid avec animation d'entrée -->
		<transition-group name="fade-stagger" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
			role="region" aria-label="Métriques des appels d'offres">
			<!-- Carte Total -->
			<div key="total"
				class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 hover:shadow-md transition-shadow duration-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ metrics.totalOffers || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:document-text" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Soumission -->
			<div key="active"
				class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 hover:shadow-md transition-shadow duration-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-green-900">Soumis</p>
						<p class="text-3xl font-bold text-green-900 mt-2">{{ metrics.submittedOffers || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Valeur Totale -->
			<div key="submitted"
				class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6 hover:shadow-md transition-shadow duration-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-orange-900">Valeur Total (F CFA)</p>
						<p class="text-2xl font-bold text-orange-900 mt-2">{{ formatCurrency(metrics.totalValue || 0) }}</p>
					</div>
					<div class="p-3 rounded-lg bg-orange-500">
						<Icon name="heroicons:banknotes" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Carte Échéances 2 semaines -->
			<div key="upcoming"
				class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6 hover:shadow-md transition-shadow duration-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-purple-900">Échéances 2 semaines</p>
						<p class="text-3xl font-bold text-purple-900 mt-2">{{ metrics.upcomingDeadlines || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-purple-500">
						<Icon name="heroicons:calendar-days" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>
		</transition-group>

		<div class="bg-white/80 backdrop-blur-sm rounded-2xl mb-4 overflow-hidden">
			<!-- En-tête du collapse -->
			<button @click="isFiltersCollapsed = !isFiltersCollapsed"
				class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
				<h3 class="text-lg font-semibold text-slate-800 flex items-center">
					<svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
					</svg>
					Filtres et Recherche
				</h3>
				<svg class="w-5 h-5 text-slate-600 transition-transform duration-300"
					:class="{ 'rotate-180': !isFiltersCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			<!-- Contenu du collapse -->
			<div v-show="!isFiltersCollapsed" class="px-6 pb-6">
				<div class="flex items-center justify-end mb-4">
					<!-- Bouton de réinitialisation des filtres -->
					<button @click="resetFilters"
						class="text-sm text-slate-600 hover:text-blue-600 flex items-center transition-colors">
						<Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2" />
						Réinitialiser
					</button>
				</div>

				<!-- Grille de filtres -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">

					<!-- Champ de recherche texte -->
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Recherche</label>
						<input v-model="searchQuery" type="text" placeholder="Modèle, série, fabricant..."
							class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
					</div>

					<!-- Filtre par statut -->
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Statut</label>
						<select v-model="filterStatus"
							class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
							<option value="" selected>Tous les statuts</option>
							<option value="draft">Brouillon</option>
							<option value="active">Actif</option>
							<option value="submitted">Soumis</option>
							<option value="evaluation">En évaluation</option>
							<option value="won">Gagné</option>
							<option value="lost">Perdu</option>
						</select>
					</div>

					<!-- Filtre par type d'équipement -->
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Trier par</label>
						<select v-model="filterType"
							class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
							<option value="date" selected>Date de publication</option>
							<option value="title">Titre</option>
							<option value="budget">Budget</option>
						</select>
					</div>

					<!-- Filtre par ordre -->
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Ordre</label>
						<select v-model="filterOrder"
							class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
							<option value="date" selected>Croissant</option>
							<option value="title">Décroissant</option>
						</select>

					</div>

				</div>
			</div>
		</div>

		<!-- En-tête avec titre et bouton d'ajout -->
		<div class="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 my-3">
			<button @click="navigateTo(AppUrl.OFFERS_NEW)" class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600
			text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
				<Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
				<span>Nouvel Appel d'Offre</span>
			</button>
		</div>

		<!-- Recent Offers -->
		<div class="mt-5">
			<template v-if="recentOffers.length > 0">
				<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
				<OfferListView :paginatedOffers="paginatedOffers" :getDeadlineBadgeClass="getDeadlineBadgeClass"
					:getDaysUntilDeadline="getDaysUntilDeadline" :getStatusBadgeClass="getStatusBadgeClass"
					:getStatusLabel="getStatusLabel" :confirmDelete="confirmDelete" />

				<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
				<OfferCardView :paginatedOffers="paginatedOffers" :getStatusBadgeClass="getStatusBadgeClass"
					:getStatusLabel="getStatusLabel"
					:getDeadlineBadgeClass="getDeadlineBadgeClass" :getDaysUntilDeadline="getDaysUntilDeadline"
					:confirmDelete="confirmDelete" />
			</template>

			<!-- EmptyState -->
			<div v-else-if="isLoading || !offers || filteredOffers.length">
				<EmptyState title="Aucun équipement trouvé" description="Il n'y a actuellement aucun équipement à afficher."
					icon="heroicons:cpu-chip" iconColor="text-blue-400" @reload="refreshData" :isLoading="isLoading"
					:searchQuery="searchQuery" />
			</div>

			<!-- Pagination -->
			<div v-if="filteredOffers.length > 0" class="mt-6">
				<Paginator :totalItems="filteredOffers.length" @range-changed="onRangeChanged" />
			</div>

		</div>

	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, shallowRef } from 'vue'
import { navigateTo } from '#app'
import { useOfferStore } from '@/stores/offerStore'
import { useNow } from '@vueuse/core'
import type { Offer } from '~/models/Offer'
import { NuxtLink } from '#components'
import Swal from 'sweetalert2'
import { formatDate } from '@/utils/dateParser'
import Paginator from '~/app/components/Paginator.vue'
import OfferListView from '../../components/offers/OfferListView.vue'
import OfferCardView from './OfferCardView.vue'
import {formatCurrency} from "@/utils/currency-parser";

const isFiltersCollapsed = ref(true);
const filterType = ref('date');
const filterStatus = ref('');
const searchQuery = ref('');
const filterOrder = ref('date');


const offerStore = useOfferStore();
const { isLoading, offers } = storeToRefs(offerStore)
const error = shallowRef<Error | null>(null)

// Utilisation de VueUse pour la date actuelle réactive
const now = useNow()

// Fonction utilitaire pour filtrer et trier les offres
const filterAndSortOffers = (rawOffers: any[]): any[] => {
	try {
		// Vérifier si les offres sont valides
		if (!Array.isArray(rawOffers)) {
			console.warn('filterAndSortOffers: offers is not an array', rawOffers)
			return []
		}

		// Créer une copie profonde des offres pour éviter de modifier l'original
		const offers = JSON.parse(JSON.stringify(rawOffers))

		// Appliquer les filtres
		let result = offers.filter((offer: Offer) => {
			// Filtre par statut
			if (filterStatus.value && offer.status !== filterStatus.value) {
				return false
			}

			// Filtre par recherche
			if (searchQuery.value) {
				const searchLower = searchQuery.value.toLowerCase()
				const title = String(offer?.title || '').toLowerCase()
				const description = String(offer?.description || '').toLowerCase()

				if (!title.includes(searchLower) && !description.includes(searchLower)) {
					return false
				}
			}

			return true
		})

		// Appliquer le tri
		result.sort((a: any, b: any) => {
			let comparison = 0

			switch (filterType.value) {
				case 'date': {
					const dateA = new Date(a.publication_date || a.submission_deadline || 0).getTime()
					const dateB = new Date(b.publication_date || b.submission_deadline || 0).getTime()
					comparison = dateA - dateB
					break
				}
				case 'title':
					comparison = String(a.title || '').localeCompare(String(b.title || ''))
					break
				case 'budget':
					comparison = (Number(a.estimated_budget) || 0) - (Number(b.estimated_budget) || 0)
					break
			}

			return filterOrder.value === 'desc' ? -comparison : comparison
		})

		return result
	} catch (error) {
		console.error('Error in filterAndSortOffers:', error)
		return []
	}
}

// Offres filtrées et triées
const filteredOffers = computed<Offer[]>(() => {
	if (!offers.value) return []
	return filterAndSortOffers(offers.value)
})

// Fonctions utilitaires pour les métriques
const countOffersByStatus = (status: string): number => {
	return filteredOffers.value.filter((o: any) => o.status === status).length
}

const sumBudgetByStatus = (status: string): number => {
	return filteredOffers.value
		.filter((o: any) => o.status === status)
		.reduce((sum: number, o: any) => sum + (Number(o.estimated_budget) || 0), 0)
}

// Métriques basées sur les offres filtrées
const activeOffers = computed(() => countOffersByStatus('active'))
const submittedOffers = computed(() => countOffersByStatus('submitted'))
const wonOffers = computed(() => countOffersByStatus('won'))
const lostOffers = computed(() => countOffersByStatus('lost'))
const totalOffers = computed(() => filteredOffers.value.length)
const totalBudget = computed(() =>
	filteredOffers.value.reduce((sum: number, o: any) => sum + (Number(o.estimated_budget) || 0), 0)
)
const wonBudget = computed(() => sumBudgetByStatus('won'))

// Calculate upcoming deadlines in the next 2 weeks
const upcomingDeadlinesCount = computed(() => {
	const today = new Date()
	const twoWeeksFromNow = new Date()
	twoWeeksFromNow.setDate(today.getDate() + 14)

	return filteredOffers.value.filter((offer) => {
		if (!offer.submission_deadline) return false
		try {
			const deadline = new Date(offer.submission_deadline)
			return deadline >= today && deadline <= twoWeeksFromNow
		} catch (e) {
			return false
		}
	}).length
})

// Réinitialise tous les filtres
const resetFilters = () => {
	filterType.value = 'date';
	filterStatus.value = '';
	searchQuery.value = ''
		; filterOrder.value = 'date'
}

// Reactive metrics object
const metrics = computed(() => ({
	totalOffers: totalOffers.value,
	activeOffers: activeOffers.value,
	submittedOffers: submittedOffers.value,
	wonOffers: wonOffers.value,
	lostOffers: lostOffers.value,
	upcomingDeadlines: upcomingDeadlinesCount.value,
	totalValue: totalBudget.value,
	wonValue: wonBudget.value,
	pendingValue: offers.value
		.filter((o: Offer) => ['submitted', 'evaluation'].includes(o.status))
		.reduce((sum: number, o: Offer) => sum + (o.estimated_budget || 0), 0),
}))

// Pagination
const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const recentOffers = computed<Offer[]>(() => {
	return [...filteredOffers.value].sort((a, b) => {
		const bTime = new Date(b.publication_date || b.submission_deadline || '').getTime()
		const aTime = new Date(a.publication_date || a.submission_deadline || '').getTime()
		return bTime - aTime
	})
})

const paginatedOffers = computed<Offer[]>(() => {
	return filteredOffers.value.slice(range.start - 1, range.end)
})

// Methods
const refreshData = async (): Promise<void> => {
	try {
		await offerStore.fetchOffers()
	} catch (err) {
		Swal.fire({
			icon: "error",
			title: "Impossible de charger les données",
			text: "Une erreur est survenue lors du chargement des appels d'offre",
			confirmButtonText: "Réessayer"
		}).then(_ => {
			if (_.isConfirmed) {
				refreshData();
			}
		});
	}
}

// Confirmation de suppression d'une offre
const confirmDelete = async (offer: Offer): Promise<void> => {
	Swal.fire({
		title: 'Supprimer l\'appel d\'offres',
		html: `Êtes-vous sûr de vouloir supprimer l\'appel d\'offres <b>"${offer.title}"</b> ?`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Oui, supprimer',
		cancelButtonText: 'Annuler'
	}).then(async (result) => {
		if (result.isConfirmed) {
			try {
				await offerStore.deleteOffer(offer.id)
				await refreshData()
				useAlert().showAlert('Offre supprimée avec succès', 'success')
			} catch (error) {
				console.error('Erreur lors de la suppression de l\'offre :', error)
				useAlert().showAlert('Erreur lors de la suppression de l\'offre', 'error')
			}
		}
	})
}

// Status and urgency helpers
const getStatusLabel = (status: string = 'draft'): string => {
	const labels: Record<string, string> = {
		draft: 'Brouillon',
		active: 'Actif',
		submitted: 'Soumis',
		evaluation: 'En évaluation',
		won: 'Gagné',
		lost: 'Perdu',
		cancelled: 'Annulé'
	}
	return labels[status] || status
}

const getStatusBadgeClass = (status: string = 'draft'): string => {
	const classes: Record<string, string> = {
		draft: 'bg-gray-100 text-gray-800',
		active: 'bg-blue-100 text-blue-800',
		submitted: 'bg-yellow-100 text-yellow-800',
		evaluation: 'bg-purple-100 text-purple-800',
		won: 'bg-green-100 text-green-800',
		lost: 'bg-red-100 text-red-800',
		cancelled: 'bg-gray-100 text-gray-800'
	}
	return classes[status] || 'bg-gray-100 text-gray-800'
}

const getDeadlineBadgeClass = (deadline: string | Date): string => {
	if (!deadline) return 'bg-gray-100 text-gray-800'

	const deadlineDate = new Date(deadline)
	const diffTime = deadlineDate.getTime() - now.value.getTime()
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	if (diffDays < 0) return 'bg-red-100 text-red-800'
	if (diffDays <= 3) return 'bg-yellow-100 text-yellow-800'
	return 'bg-green-100 text-green-800'
}

const getDaysUntilDeadline = (deadline: string): string => {
	const deadlineDate = new Date(deadline)
	const diffDays = Math.ceil((deadlineDate.getTime() - now.value.getTime()) / (1000 * 60 * 60 * 24))

	if (diffDays === 0) return "Aujourd'hui"
	if (diffDays === 1) return 'Demain'
	if (diffDays < 0) return 'En retard'
	return `${diffDays}j`
}


const formatRelativeDate = (dateString: string): string => {
	const date = new Date(dateString)
	const diffDays = Math.floor((now.value.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

	if (diffDays === 0) return "Aujourd'hui"
	if (diffDays === 1) return 'Hier'
	if (diffDays < 7) return `${diffDays}j`
	if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`
	return `${Math.floor(diffDays / 30)}mois`
}

// Lifecycle hooks
onMounted(() => {
	refreshData()
})
</script>
