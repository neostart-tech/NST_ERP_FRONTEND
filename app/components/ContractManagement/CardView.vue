<template>
	<div class="lg:hidden space-y-4">
		<div v-for="contract in filteredContracts" :key="contract.id" class="bg-white shadow rounded-lg p-4">
			<!-- En-tête de la carte -->
			<div class="flex justify-between items-start mb-3">
				<div>
					<h3 class="text-sm font-medium text-gray-900">{{ contract.reference_number }}</h3>
					<p class="text-sm text-gray-500">{{ getClientName(contract.client!) }}</p>
				</div>
				<span :class="getStatusClass(contract.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
					{{ getStatusText(contract.status) }}
				</span>
			</div>

			<!-- Informations du contrat -->
			<div class="space-y-2 text-sm text-gray-600">
				<div class="grid grid-cols-2 gap-2">
					<div>
						<p class="text-xs text-gray-500">Début</p>
						<p>{{ formatDate(contract.start_date) }}</p>
					</div>
					<div>
						<p class="text-xs text-gray-500">Fin</p>
						<p>{{ formatDate(contract.end_date) }}</p>
					</div>
				</div>
				<div>
					<p class="text-xs text-gray-500">Montant</p>
					<p>{{ contract.amount }}fcfa <span class="text-xs text-gray-400">({{
						contractStatusToString(contract.frequency) }})</span></p>
				</div>
			</div>

			<!-- Actions -->
			<div class="mt-4 pt-4 border-t border-gray-200">
				<div class="flex justify-between items-center">
					<div class="flex space-x-3">
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
							title="Calendrier">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</button>
					</div>
					<div class="flex space-x-3">
						<button @click="_generateContractPDF(contract)" class="text-orange-600 hover:text-orange-900" title="PDF">
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
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getClientName } from '~/models/Client';
import type { Contract } from '~/models/Contract';

defineProps<{
	filteredContracts: Contract[];
	getStatusClass: (status: string) => string;
	getStatusText: (status: string) => string;
	contractStatusToString: (status: string) => string;
	viewContract: (contract: Contract) => void;
	editContract: (contract: Contract) => void;
	generateCalendar: (contract: Contract) => Promise<void>;
	_generateContractPDF: (contract: Contract) => void;
	deleteContract: (contractId: string) => Promise<void>;
}>()
</script>
