<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Total Appels d'Offres -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Appels d'Offres</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ totalOffers }}</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:document-text" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Échéances urgentes -->
			<div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-orange-900">Échéances urgentes</p>
						<p class="text-3xl font-bold text-orange-900 mt-2">{{ urgentDeadlines }}</p>
					</div>
					<div class="p-3 rounded-lg bg-orange-500">
						<Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Tâches en attente -->
			<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-purple-900">Tâches en attente</p>
						<p class="text-3xl font-bold text-purple-900 mt-2">{{ pendingTasks }}</p>
					</div>
					<div class="p-3 rounded-lg bg-purple-500">
						<Icon name="heroicons:clock" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Soumissions -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-green-900">Soumissions</p>
						<p class="text-3xl font-bold text-green-900 mt-2">{{ submissionsCount }}</p>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<Icon name="heroicons:paper-airplane" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>
		</div>

		<!-- En-tête avec recherche et actions -->
		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-xl font-bold text-gray-900">Actions Rapides</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs w-full md:w-auto">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input v-model="searchQuery" @input="performSearch" type="text" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400" />
				</div>

				<!-- Bouton Nouveau -->
				<button @click="createNewoffer" class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600
					text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
					<Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
					Nouvel Appel d'Offres
				</button>
			</div>
		</div>

		<!-- Loader -->
		<div v-if="loading" class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>

		<!-- Contenu principal -->
		<template v-else-if="!loading && filteredActions.length > 0">
			<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
			<div class="hidden lg:block bg-white border rounded-lg shadow mt-6 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gradient-to-r from-blue-50 to-green-50">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Action
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Description
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Catégorie
								</th>
								<th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-blue-800 tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="action in paginatedActions" :key="action.id + '-table'"
								class="hover:bg-gray-50 transition-colors duration-150">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div :class="action.iconBg" class="p-2 rounded-lg">
											<Icon :name="action.icon" class="w-5 h-5 text-white" />
										</div>
										<div class="ml-3">
											<div class="text-sm font-medium text-gray-900">{{ action.title }}</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="text-sm text-gray-500">{{ action.description }}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span :class="action.badgeClass"
										class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
										{{ action.category }}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button @click="executeAction(action)" class="text-blue-600 hover:text-blue-900" title="Exécuter">
										<Icon name="heroicons:arrow-right-circle" class="w-5 h-5" />
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
			<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
				<div v-for="action in paginatedActions" :key="action.id + '-card'" :class="getActionCardClass(action.category)"
					class="rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow duration-200">
					<div class="p-4">
						<div class="flex items-start space-x-3">
							<div :class="action.iconBg" class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center">
								<Icon :name="action.icon" class="w-6 h-6 text-white" />
							</div>
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">{{ action.title }}</h3>
								<span :class="action.badgeClass" class="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full">
									{{ action.category }}
								</span>
							</div>
						</div>
						<div class="mt-3">
							<p class="text-sm text-gray-700">{{ action.description }}</p>
						</div>
						<div class="flex justify-end mt-4">
							<button @click="executeAction(action)" class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600
								text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
								Exécuter
								<Icon name="heroicons:arrow-right" class="ml-2 h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<Paginator :totalItems="filteredActions.length" @range-changed="onRangeChanged" />
		</template>

		<!-- EmptyState -->
		<div v-else-if="!loading">
			<EmptyState title="Aucune action disponible" description="Il n'y a actuellement aucune action à afficher."
				icon="heroicons:wrench-screwdriver" iconColor="text-indigo-400" :searchQuery="searchQuery" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useoffersStore } from '@/stores/offers'
// import { offersService } from '@/services/offersService'
import type { Offer, OfferStatus } from '~/models/Offer'
import EmptyState from '~/app/components/EmptyState.vue'
import Paginator from '~/app/components/Paginator.vue'

const router = useRouter()
const offersStore = useoffersStore()

// Reactive state
const searchQuery = ref('')
const loading = ref(false)

// Interface pour les actions
interface QuickAction {
	id: string
	title: string
	description: string
	category: string
	icon: string
	iconBg: string
	badgeClass: string
	action: () => void
}

// Liste des actions rapides
const actions = ref<QuickAction[]>([
	{
		id: 'new-offer',
		title: 'Nouvel Appel d\'Offres',
		description: 'Créer un nouveau dossier',
		category: 'Création',
		icon: 'heroicons:plus',
		iconBg: 'bg-green-500',
		badgeClass: 'bg-green-100 text-green-800',
		action: () => router.push('/offers?action=create')
	},
	{
		id: 'view-all',
		title: 'Voir Tous les AO',
		description: 'Liste complète et filtrage',
		category: 'Navigation',
		icon: 'heroicons:document-text',
		iconBg: 'bg-blue-500',
		badgeClass: 'bg-blue-100 text-blue-800',
		action: () => router.push('/offers')
	},
	{
		id: 'submissions',
		title: 'Soumissions',
		description: 'Gérer les propositions',
		category: 'Navigation',
		icon: 'heroicons:paper-airplane',
		iconBg: 'bg-yellow-500',
		badgeClass: 'bg-yellow-100 text-yellow-800',
		action: () => router.push('/offers/submissions')
	},
	{
		id: 'projects',
		title: 'Pilotage Projets',
		description: 'Tâches et planning',
		category: 'Navigation',
		icon: 'heroicons:clipboard-document-check',
		iconBg: 'bg-purple-500',
		badgeClass: 'bg-purple-100 text-purple-800',
		action: () => router.push('/offers/projects')
	},
	{
		id: 'export',
		title: 'Exporter les données',
		description: 'Télécharger un fichier Excel',
		category: 'Export',
		icon: 'heroicons:arrow-down-tray',
		iconBg: 'bg-indigo-500',
		badgeClass: 'bg-indigo-100 text-indigo-800',
		action: () => { }
		// action: exportData
	},
	{
		id: 'template-submission',
		title: 'Modèle de soumission',
		description: 'Télécharger le template',
		category: 'Modèles',
		icon: 'heroicons:document-arrow-down',
		iconBg: 'bg-cyan-500',
		badgeClass: 'bg-cyan-100 text-cyan-800',
		action: () => downloadTemplate('submission')
	},
	{
		id: 'template-financial',
		title: 'Modèle financier',
		description: 'Télécharger le template',
		category: 'Modèles',
		icon: 'heroicons:currency-dollar',
		iconBg: 'bg-emerald-500',
		badgeClass: 'bg-emerald-100 text-emerald-800',
		action: () => downloadTemplate('financial')
	},
	{
		id: 'template-technical',
		title: 'Modèle technique',
		description: 'Télécharger le template',
		category: 'Modèles',
		icon: 'heroicons:wrench-screwdriver',
		iconBg: 'bg-orange-500',
		badgeClass: 'bg-orange-100 text-orange-800',
		action: () => downloadTemplate('technical')
	}
])

// Pagination
const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start
	range.end = end
}

// Computed values
const totalOffers = computed(() => {
	return offersStore.getoffers().length
})

const urgentDeadlines = computed(() => {
	const now = new Date()
	const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

	return offersStore.getoffers().filter(offer => {
		const deadline = new Date(offer.deadline)
		return deadline <= threeDaysFromNow && deadline > now && offer.status === 'Validé'
	}).length
})

const pendingTasks = computed(() => {
	return offersStore.getAllTasks().filter(task =>
		task.status === 'todo' || task.status === 'in_progress'
	).length
})

const submissionsCount = computed(() => {
	return offersStore.getoffers().filter(offer => offer.status === 'Soumis').length
})

const filteredActions = computed(() => {
	if (!searchQuery.value) {
		return actions.value
	}
	const search = searchQuery.value.toLowerCase()
	return actions.value.filter(action =>
		action.title.toLowerCase().includes(search) ||
		action.description.toLowerCase().includes(search) ||
		action.category.toLowerCase().includes(search)
	)
})

const paginatedActions = computed(() => {
	// Si la pagination n'est pas initialisée, retourner toutes les actions
	if (range.end === 0 || range.start === 0 && range.end === 0) {
		return filteredActions.value
	}
	return filteredActions.value.slice(range.start, range.end)
})

// Methods
const createNewoffer = () => {
	router.push('/offers?action=create')
}

const performSearch = () => {
	// La recherche est gérée par le computed filteredActions
}

const executeAction = (action: QuickAction) => {
	action.action()
}

const getActionCardClass = (category: string): string => {
	const cardClasses: Record<string, string> = {
		'Création': 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
		'Navigation': 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
		'Export': 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200',
		'Modèles': 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
	}
	return cardClasses[category] || 'bg-white border-gray-100'
}

const exportData = async () => {
	loading.value = true
	try {
		// const blob = await offersService.exportoffersReport('excel')
		// const url = window.URL.createObjectURL(blob)
		const url = "";
		const link = document.createElement('a')
		link.href = url
		link.download = `appels-offres-${new Date().toISOString().split('T')[0]}.xlsx`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)
	} catch (error) {
		console.error('Error exporting data:', error)
	} finally {
		loading.value = false
	}
}

const downloadTemplate = async (templateType: 'submission' | 'financial' | 'technical') => {
	try {
		const blob = await offersService.downloadTemplate(templateType)
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `modele-${templateType}.xlsx`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)
	} catch (error) {
		console.error('Error downloading template:', error)
	}
}

// Initialize component
onMounted(() => {
	// Any initialization logic here
})
</script>
