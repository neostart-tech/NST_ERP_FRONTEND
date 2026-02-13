<template>
	<div class="bg-white shadow overflow-hidden sm:rounded-lg hidden lg:block">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<!-- En-tête du tableau -->
				<thead class="bg-gray-50">
					<tr>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Référence
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Client
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Dates
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Montant
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Statut
						</th>
						<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>

				<!-- Corps du tableau -->
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="contract in filteredContracts" :key="contract.id" class="hover:bg-gray-50">
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
							{{ contract.reference_number }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ getClientName(contract.client!) }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							<div>Début: {{ formatDate(contract.start_date) }}</div>
							<div>Fin: {{ formatDate(contract.end_date) }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{{ contract.amount }}fcfa
							<div class="text-xs text-gray-400">{{ contractStatusToString(contract.frequency) }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span :class="getStatusClass(contract.status)"
								class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
								{{ getStatusText(contract.status) }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex space-x-2">
								<button @click="viewContract(contract)" class="text-blue-600 hover:text-blue-900" title="Voir">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								</button>
								<button @click="editContract(contract)" class="text-green-600 hover:text-green-900" title="Modifier">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</button>
								<button @click="generateCalendar(contract)" class="text-purple-600 hover:text-purple-900"
									title="Générer calendrier">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</button>
								<button @click="_generateContractPDF(contract)" class="text-orange-600 hover:text-orange-900"
									title="Générer PDF">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</button>
								<button @click="deleteContract(contract.id)" class="text-red-600 hover:text-red-900" title="Supprimer">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
										stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getClientName } from '~/models/Client';
import type { Contract } from '~/models/Contract';

defineProps<{
	filteredContracts: Contract[];
	formatDate: (dateString: string) => string;
	contractStatusToString: (status: string) => string;
	getStatusClass: (status: string) => string;
	getStatusText: (status: string) => string;
	viewContract: (contract: Contract) => void;
	editContract: (contract: Contract) => void;
	generateCalendar: (contract: Contract) => Promise<void>;
	_generateContractPDF: (contract: Contract) => void;
	deleteContract: (contractId: string) => Promise<void>;
}>()
</script>
