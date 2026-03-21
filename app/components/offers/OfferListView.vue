<template>
	<div>
		<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
		<div class="hidden lg:block bg-white border rounded-lg shadow overflow-hidden">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gradient-to-r from-blue-50 to-green-50">
					<tr>
						<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
							Appel d'Offres
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
							Échéance
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
							Budget
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
							Statut
						</th>
						<th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-blue-800 tracking-wider">
							Actions
						</th>
					</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="offer in paginatedOffers" :key="offer.id + '-table'"
							class="hover:bg-gray-50 transition-colors duration-150">
						<td class="px-6 py-4">
							<div class="flex items-center">
								<div
									class="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center mr-3">
									<Icon name="heroicons:document-text" class="h-5 w-5 text-blue-600"/>
								</div>
								<div>
									<div class="text-sm font-medium text-gray-900">{{ offer.title }}</div>
									<div class="text-sm text-gray-500">{{ offer.enterprise?.name || 'Non spécifié' }}</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center text-sm text-gray-500">
								{{ formatDate(offer.submission_deadline) }}
							</div>
							<span :class="getDeadlineBadgeClass(offer.submission_deadline)"
										class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1">
													{{ getDaysUntilDeadline(offer.submission_deadline) }}
												</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ formatCurrency(offer.estimated_budget) }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
												<span :class="getStatusBadgeClass(offer.status)"
													class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
													{{ getStatusLabel(offer.status) }}
												</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_LOTS, offer.id)"
												class="text-amber-600 hover:text-amber-900 mr-3" title="Configurer les Lots">
								<Icon name="heroicons:puzzle-piece" class="w-5 h-5"/>
							</NuxtLink>
							<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_DOCUMENTS, offer.id)"
												class="text-emerald-600 hover:text-emerald-900 mr-3" title="Voir les documents">
								<Icon name="heroicons:document-text" class="w-5 h-5"/>
							</NuxtLink>
							<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_APPROVAL, offer.id)"
												class="text-gray-600 hover:text-gray-900 mr-3" title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5"/>
							</NuxtLink>
							<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_EDIT, offer.id)"
												class="text-blue-600 hover:text-blue-900 mr-3" title="Modifier">
								<Icon name="heroicons:pencil-square" class="w-5 h-5"/>
							</NuxtLink>
							<button @click.stop="confirmDelete(offer)" class="text-red-600 hover:text-red-900"
									title="Supprimer">
								<Icon name="heroicons:trash" class="w-5 h-5"/>
							</button>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
		<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
			<div v-for="offer in paginatedOffers" :key="offer.id + '-card'"
				class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
				<div class="p-4">
					<!-- Header avec titre et statut -->
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1">
							<h3 class="text-lg font-semibold text-gray-900">{{ offer.title }}</h3>
							<p class="text-sm text-gray-600 mt-1">{{ offer.enterprise?.name || 'Non spécifié' }}</p>
						</div>
						<span :class="getStatusBadgeClass(offer.status)" 
							class="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2">
							{{ getStatusLabel(offer.status) }}
						</span>
					</div>

					<!-- Détails -->
					<div class="mt-3 space-y-2">
						<div class="text-sm text-gray-600">
							<span class="font-medium">Échéance:</span> {{ formatDate(offer.submission_deadline) }}
							<span :class="getDeadlineBadgeClass(offer.submission_deadline)"
								class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ml-2">
								{{ getDaysUntilDeadline(offer.submission_deadline) }}
							</span>
						</div>
						<div class="text-sm text-gray-600">
							<span class="font-medium">Budget:</span> {{ formatCurrency(offer.estimated_budget) }}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex justify-between mt-4 pt-3 border-t border-gray-100">
						<div class="flex gap-2">
							<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_LOTS, offer.id)"
								class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-full" title="Configurer les Lots">
								<Icon name="heroicons:puzzle-piece" class="w-5 h-5"/>
							</NuxtLink>
							<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_DOCUMENTS, offer.id)"
								class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-full" title="Voir les documents">
								<Icon name="heroicons:document-text" class="w-5 h-5"/>
							</NuxtLink>
						</div>
						<div class="flex gap-2">
							<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_APPROVAL, offer.id)"
								class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full" title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5"/>
							</NuxtLink>
							<NuxtLink :to="AppUrl.parameterize(AppUrl.OFFERS_EDIT, offer.id)"
								class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full" title="Modifier">
								<Icon name="heroicons:pencil-square" class="w-5 h-5"/>
							</NuxtLink>
							<button @click.stop="confirmDelete(offer)" 
								class="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
								title="Supprimer">
								<Icon name="heroicons:trash" class="w-5 h-5"/>
							</button>
						</div>
					</div>
				</div>
			</div></div>
	</div>
</template>

<script setup lang="ts">
import type {Offer} from '~/models/Offer';
import {formatDate} from '@/utils/dateParser';
import {formatCurrency} from '@/utils/currency-parser';
import { AppUrl } from '@/composables/appUrl';

defineProps<{
	paginatedOffers: Offer[];
	getDeadlineBadgeClass: (deadline: string | Date) => string;
	getDaysUntilDeadline: (deadline: string) => string;
	getStatusBadgeClass: (status?: string) => string;
	getStatusLabel: (status?: string) => string;
	confirmDelete: (offer: Offer) => Promise<void>;
}>()
</script>
