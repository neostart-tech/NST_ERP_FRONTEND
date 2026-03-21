<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" role="main">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Configuration des lots</h1>
				<p class="text-sm text-gray-600 mt-1">Sélectionnez un appel d'offre pour configurer ses lots.</p>
			</div>
			<NuxtLink :to="AppUrl.OFFERS" class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
				Retour aux appels d'offres
			</NuxtLink>
		</div>

		<div v-if="isLoading" class="py-10 flex justify-center">
			<Loader />
		</div>

		<div v-else-if="sortedOffers.length === 0" class="py-10">
			<EmptyState
				title="Aucun appel d'offre trouvé"
				description="Aucun appel d'offre disponible pour configurer des lots."
				icon="heroicons:puzzle-piece"
				iconColor="text-amber-400"
				:isLoading="false"
			/>
		</div>

		<div v-else class="overflow-x-auto border border-gray-200 rounded-lg">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Référence</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Titre</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entreprise</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Échéance</th>
						<th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="offer in sortedOffers" :key="offer.id" class="hover:bg-gray-50">
						<td class="px-6 py-4 text-sm text-gray-800">{{ offer.number || '-' }}</td>
						<td class="px-6 py-4 text-sm font-medium text-gray-900">{{ offer.title }}</td>
						<td class="px-6 py-4 text-sm text-gray-600">{{ offer.enterprise?.name || '-' }}</td>
						<td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(offer.submission_deadline) }}</td>
						<td class="px-6 py-4 text-right">
							<NuxtLink
								:to="AppUrl.parameterize(AppUrl.OFFERS_LOTS, offer.id)"
								class="inline-flex items-center px-3 py-2 rounded-md text-sm text-white bg-amber-600 hover:bg-amber-700"
							>
								Configurer
							</NuxtLink>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOfferStore } from '@/stores/offerStore'
import { AppUrl } from '@/composables/appUrl'
import { formatDate } from '@/utils/dateParser'
import Loader from '@/components/Loader.vue'
import EmptyState from '@/components/EmptyState.vue'

const offerStore = useOfferStore()
const { offers: offerItems, isLoading } = storeToRefs(offerStore)

const sortedOffers = computed(() => {
	return [...offerItems.value].sort((a, b) => {
		const aTime = new Date(a.submission_deadline || '').getTime()
		const bTime = new Date(b.submission_deadline || '').getTime()
		return bTime - aTime
	})
})

onMounted(async () => {
	if (!offerItems.value.length) {
		await offerStore.fetchOffers()
	}
})
</script>
