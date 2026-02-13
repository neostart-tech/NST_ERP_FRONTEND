<template>
	<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
		<div v-for="offer in paginatedOffers" :key="offer.id + '-card'"
				 class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
			<div class="p-4">
				<div class="flex items-start space-x-3">
					<div class="h-12 w-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
						<Icon name="heroicons:document-text" class="h-6 w-6 text-blue-600"/>
					</div>
					<div class="flex-1">
						<h3 class="text-lg font-semibold text-gray-900">{{ offer.title }}</h3>
						<span :class="getStatusBadgeClass(offer.status)"
									class="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full">
											{{ getStatusLabel(offer.status) }}
										</span>
					</div>
				</div>
				<div class="mt-3 space-y-2">
					<div class="flex items-center text-sm text-gray-600">
						<Icon name="heroicons:building-office" class="w-4 h-4 mr-2 text-gray-400"/>
						<span>{{ offer.enterprise?.name || 'Non spécifié' }}</span>
					</div>
					<div class="flex items-center text-sm text-gray-600">
						<Icon name="heroicons:calendar" class="w-4 h-4 mr-2 text-gray-400"/>
						<span>{{ formatDate(offer.submission_deadline) }}</span>
					</div>
					<div class="flex items-center text-sm text-gray-600">
						<Icon name="heroicons:currency-dollar" class="w-4 h-4 mr-2 text-gray-400"/>
						<span>{{ formatCurrency(offer.estimated_budget) }}</span>
					</div>
					<div class="flex items-center">
										<span :class="getDeadlineBadgeClass(offer.submission_deadline)"
													class="px-2 py-1 text-xs font-semibold rounded-full">
											{{ getDaysUntilDeadline(offer.submission_deadline) }}
										</span>
					</div>
				</div>
				<div class="flex justify-end mt-4 space-x-2">
					<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_LOTS, offer.id)"
										class="p-1.5  text-amber-600 hover:text-amber-900 rounded-full" title="Configurer les Lots">
						<Icon name="heroicons:puzzle-piece" class="w-5 h-5"/>
					</NuxtLink>
					<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_DOCUMENTS, offer.id)"
										class="p-1.5  text-emerald-600 hover:text-emerald-900 rounded-full" title="Voir les documents">
						<Icon name="heroicons:document-text" class="w-5 h-5"/>
					</NuxtLink>
					<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_APPROVAL, offer.id)"
										class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full" title="Voir les détails">
						<Icon name="heroicons:eye" class="w-5 h-5"/>
					</NuxtLink>
					<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_EDIT, offer.id)"
										class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full" title="Modifier">
						<Icon name="heroicons:pencil-square" class="w-5 h-5"/>
					</NuxtLink>
					<button @click.stop="confirmDelete(offer)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
									title="Supprimer">
						<Icon name="heroicons:trash" class="w-5 h-5"/>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {Offer} from '~/models/Offer';
import {formatDate} from '@/utils/dateParser';
import {formatCurrency} from '@/utils/currency-parser';

defineProps<{
	paginatedOffers: Offer[];
	getStatusBadgeClass: (status?: string) => string;
	getStatusLabel: (status?: string) => string;
	getDeadlineBadgeClass: (deadline: string | Date) => string;
	getDaysUntilDeadline: (deadline: string) => string;
	confirmDelete: (offer: Offer) => Promise<void>;
}>()
</script>
