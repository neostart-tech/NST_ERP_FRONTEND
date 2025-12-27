<template>
	<div v-if="selectedContract" class="fixed inset-0 overflow-y-auto z-50">
		<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
			<!-- Overlay de fond -->
			<div class="fixed inset-0 transition-opacity" aria-hidden="true">
				<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

			<!-- Contenu du modal -->
			<div
				class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
				<!-- En-tête amélioré avec dégradé -->
				<div class="bg-gradient-to-r from-blue-600 to-green-500 px-6 py-4 text-white">
					<div class="flex justify-between items-center">
						<div>
							<h3 class="text-xl font-bold">Contrat #{{ selectedContract.reference_number }}</h3>
							<p class="text-blue-100 text-sm mt-1">{{ getClientDisplayName(selectedContract.client!) }}</p>
						</div>
						<div class="text-right">
							<!-- Badge de statut -->
							<span :class="getStatusClass(selectedContract.status) + ' text-sm font-medium px-3 py-1 rounded-full'">
								{{ getStatusText(selectedContract.status) }}
							</span>
							<p class="text-blue-100 text-sm mt-1">{{ formatDate(selectedContract.created_at) }}</p>
						</div>
					</div>
				</div>

				<!-- Corps du modal -->
				<div class="bg-white px-6 py-6">
					<!-- Grille d'informations améliorée -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<!-- Informations client -->
						<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
							<h4 class="font-semibold text-gray-900 mb-3 flex items-center">
								<svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								Informations Client
							</h4>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-600">Origine:</span>
									<span class="font-medium text-gray-900 capitalize">{{ selectedContract.origin === 'client' ?
										'Demande client' : 'Initiative interne' }}</span>
								</div>
							</div>
						</div>

						<!-- Détails du contrat -->
						<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
							<h4 class="font-semibold text-gray-900 mb-3 flex items-center">
								<svg class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								Détails du Contrat
							</h4>
							<div class="space-y-2 text-sm">
								<div class="flex justify-between">
									<span class="text-gray-600">Formule:</span>
									<span class="font-medium text-gray-900 capitalize">{{ selectedContract.formula }}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Montant:</span>
									<span class="font-medium text-gray-900">{{ selectedContract.amount }}FCFA({{
										selectedContract.frequency }})</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Période:</span>
									<span class="font-medium text-gray-900">{{ formatDate(selectedContract.start_date) }} - {{
										formatDate(selectedContract.end_date) }}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Prestations incluses -->
					<div class="mb-6">
						<h4 class="font-semibold text-gray-900 mb-3 flex items-center">
							<svg class="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
							Prestations Incluses
						</h4>
						<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
							<p class="text-sm text-gray-700 whitespace-pre-line">{{ selectedContract.services }}</p>
						</div>
					</div>

					<!-- Notes (si présentes) -->
					<div class="mb-6" v-if="selectedContract.notes">
						<h4 class="font-semibold text-gray-900 mb-3 flex items-center">
							<svg class="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							Notes
						</h4>
						<div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
							<p class="text-sm text-yellow-800 whitespace-pre-line">{{ selectedContract.notes }}</p>
						</div>
					</div>

					<!-- Calendrier des interventions -->
					<div class="border-t border-gray-200 pt-6">
						<div class="flex justify-between items-center mb-4">
							<h4 class="font-semibold text-gray-900 flex items-center">
								<svg class="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								Calendrier des Interventions
							</h4>
							<div class="flex space-x-2">
								<!-- Bouton Générer Calendrier -->
								<button @click="generateCalendar(selectedContract)"
									class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
									<svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
									</svg>
									Générer Calendrier
								</button>

								<!-- Bouton Générer PDF -->
								<button @click="_generateContractPDF(selectedContract)"
									class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
									<svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									Générer PDF
								</button>
							</div>
						</div>

						<!-- Tableau des interventions -->
						<div v-if="selectedContract.interventions && selectedContract.interventions.length > 0"
							class="bg-white border border-gray-200 rounded-lg overflow-hidden">
							<div class="overflow-x-auto">
								<table class="min-w-full divide-y divide-gray-200">
									<thead class="bg-gray-50">
										<tr>
											<th scope="col"
												class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date
											</th>
											<th scope="col"
												class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type
											</th>
											<th scope="col"
												class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Description</th>
											<th scope="col"
												class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut
											</th>
										</tr>
									</thead>
									<tbody class="bg-white divide-y divide-gray-200">
										<!-- Je boucle sur chaque intervention -->
										<tr v-for="intervention in selectedContract.interventions" :key="intervention.id"
											class="hover:bg-gray-50 transition-colors duration-150">
											<td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
												{{ formatDate(intervention.date) }}
											</td>
											<td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
												{{ intervention.type }}
											</td>
											<td class="px-4 py-3 text-sm text-gray-500">
												{{ intervention.description }}
											</td>
											<td class="px-4 py-3 whitespace-nowrap">
												<!-- Badge de statut d'intervention -->
												<span :class="getInterventionStatusClass(intervention.status)"
													class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
													{{ getInterventionStatusText(intervention.status) }}
												</span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<!-- Message si aucune intervention -->
						<div v-else class="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
							<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<h3 class="mt-2 text-sm font-medium text-gray-900">Aucune intervention</h3>
							<p class="mt-1 text-sm text-gray-500">Aucune intervention programmée pour ce contrat.</p>
							<div class="mt-4">
								<button @click="generateCalendar(selectedContract)"
									class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
									Générer le calendrier
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Pied de page du modal -->
				<div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
					<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
						<!-- Boutons d'action selon le statut -->
						<div class="flex space-x-3">
							<!-- Bouton Activer si en attente -->
							<button v-if="selectedContract.status === 'en_attente'"
								@click="updateContractStatus(selectedContract.id, 'actif')" type="button"
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
								<svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
								Activer le contrat
							</button>

							<!-- Bouton Résilier si actif -->
							<button v-if="selectedContract.status === 'actif'"
								@click="updateContractStatus(selectedContract.id, 'resilie')" type="button"
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
								<svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
								Résilier le contrat
							</button>
						</div>

						<!-- Bouton Fermer -->
						<div class="flex space-x-3">
							<button @click="selectedContract = null" type="button"
								class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								<svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
								Fermer
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getClientDisplayName } from '~/models/Client';
import { type Contract } from '~/models/Contract';

defineProps<{
	getClientName: (clientId: string) => string;
	getStatusClass: (status: string) => string;
	getStatusText: (status: string) => string;
	formatDate: (dateString: string) => string;
	generateCalendar: (contract: Contract) => Promise<void>;
	_generateContractPDF: (contract: Contract) => void;
	getInterventionStatusClass: (status: string) => string;
	getInterventionStatusText: (status: string) => string;
	updateContractStatus: (contractId: string, newStatus: string) => Promise<void>;
}>()
const selectedContract = defineModel<Contract | null>('selectedContract', { required: true })
</script>
