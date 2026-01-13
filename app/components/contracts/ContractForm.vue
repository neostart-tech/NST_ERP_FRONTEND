<template>
	<div v-if="showContractForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
			<div class="p-6">
				<!-- En-tête du formulaire -->
				<div class="flex justify-between items-center border-b pb-4">
					<h2 class="text-2xl font-bold text-gray-800">
						{{ isEditing ? 'Modifier le contrat' : 'Nouveau contrat de maintenance' }}
					</h2>
					<!-- Bouton de fermeture -->
					<button @click="closeContractForm"
						class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Formulaire -->
				<form @submit.prevent="submitContractForm" class="mt-6 space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Sélection du client -->
						<div>
							<label for="client" class="block text-sm font-medium text-gray-700 mb-1">Client
								<RequiredField />
							</label>
							<select id="client" v-model="newContract.client_id"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Sélectionnez un client</option>
								<option v-for="client in clients" :key="client.id" :value="client.id">
									{{ getClientName(client) }}
								</option>
							</select>
							<InvalidInput :error="validationErrors.client_id" />
						</div>

						<!-- Sélection de la formule -->
						<!-- <div>
							<label for="formula" class="block text-sm font-medium text-gray-700 mb-1">Formule
								<RequiredField />
							</label>
							<select id="formula" v-model="newContract.formula"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Sélectionnez une formule</option>
								<option value="basique">Basique</option>
								<option value="standard">Standard</option>
								<option value="premium">Premium</option>
								<option value="promotion">Promotion</option>
								<option value="personnalise">Personnalisé</option>
							</select>
							<InvalidInput :error="validationErrors.formula" />
						</div> -->

						<!-- Date de début -->
						<div>
							<label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Date de début
								<RequiredField />
							</label>
							<input type="date" id="startDate" v-model="newContract.start_date"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							<InvalidInput :error="validationErrors.start_date" />
						</div>

						<!-- Date d'expiration -->
						<div>
							<label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Date d'expiration
								<RequiredField />
							</label>
							<input type="date" id="endDate" v-model="newContract.end_date"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							<InvalidInput :error="validationErrors.end_date" />
						</div>

						<!-- Montant -->
						<div>
							<label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Montant (F cfa)
								<RequiredField />
							</label>
							<input type="number" id="amount" v-model="newContract.amount"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							<InvalidInput :error="validationErrors.amount" />
						</div>

						<!-- Fréquence d'intervention -->
						<div>
							<label for="frequency" class="block text-sm font-medium text-gray-700 mb-1">Fréquence d'intervention
								<RequiredField />
							</label>
							<select id="frequency" v-model="newContract.frequency"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="monthly">Mensuel</option>
								<option value="quarterly">Trimestriel</option>
								<option value="one-time">Semestriel</option>
								<option value="annually">Annuel</option>
							</select>
							<InvalidInput :error="validationErrors.frequency" />
						</div>

						<!-- Status du contrat -->
						<div>
							<label for="frequency" class="block text-sm font-medium text-gray-700 mb-1">
								Statut du contrat <RequiredField />
							</label>
							<select id="frequency" v-model="newContract.status"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="active" selected	>Actif</option>
								<option value="pending">En attente</option>
								<option value="expired">Expiré</option>
								<option value="inactive">Inactif</option>
							</select>
							<InvalidInput :error="validationErrors.status" />
						</div>

						<!-- Statut (uniquement en mode édition) -->
						<div v-if="isEditing">
							<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
							<select id="status" v-model="newContract.status"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="pending">En attente</option>
								<option value="actif">Actif</option>
								<option value="refuse">Refusé</option>
								<option value="resilie">Résilié</option>
								<option value="expired">Expiré</option>
							</select>
							<InvalidInput :error="validationErrors.status" />
						</div>

						<!-- Type de maintenance -->
						<div>
							<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Type de maintenance</label>
							<select id="status" v-model="newContract.contract_type"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="preventive">Préventive</option>
								<option value="corrective">Corrective</option>
							</select>
							<InvalidInput :error="validationErrors.contract_type" />
						</div>

						<!-- Origine de la demande -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Origine de la demande</label>
							<div class="mt-2 space-y-2">
								<div class="flex items-center">
									<input id="origin-client" name="origin" type="radio" v-model="newContract.origin" value="client"
										class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
									<label for="origin-client" class="ml-2 block text-sm text-gray-700">Demande client</label>
								</div>
								<div class="flex items-center">
									<input id="origin-internal" name="origin" type="radio" v-model="newContract.origin" value="internal"
										class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
									<label for="origin-internal" class="ml-2 block text-sm text-gray-700">Initiative interne</label>
								</div>
							</div>
						</div>
						<InvalidInput :error="validationErrors.origin" />
					</div>

					<!-- Prestations incluses -->
					<div>
						<label for="services" class="block text-sm font-medium text-gray-700 mb-1">Prestations incluses</label>
						<textarea id="services" v-model="newContract.services" rows="3"
							class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
						<InvalidInput :error="validationErrors.services" />
					</div>

					<!-- Notes supplémentaires -->
					<div>
						<label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes supplémentaires</label>
						<textarea id="notes" v-model="newContract.notes" rows="2"
							class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
						<InvalidInput :error="validationErrors.notes" />
					</div>

					<!-- Boutons d'action du formulaire -->
					<div class="flex justify-end space-x-4 pt-6 border-t">
						<button type="button" @click="closeContractForm"
							class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors">
							Annuler
						</button>
						<button type="submit" :disabled="loading"
							class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50">
							<Spinner :is-loading="isPersisting" text="Enregistrement en cours" />
							<span v-if="!isPersisting">{{ isEditing ? 'Modifier' : 'Enregistrer' }} le contrat</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {  getClientName, type Client } from '~/models/Client';
import type { Contract } from '~/models/Contract';
import Spinner from '../partials/Spinner.vue';
import { useContractStore } from '~/app/stores/Maintenance/ContractStore';
import { useClientStore } from '~/app/stores/clientStore';
import RequiredField from '../partials/RequiredField.vue';
import InvalidInput from '../partials/InvalidInput.vue';

const clientStore = useClientStore();

const { isPersisting, validationErrors } = storeToRefs(useContractStore());
const { clients } = storeToRefs(clientStore);

onMounted(() => {
	clientStore.fetchAll();
})

defineProps<{
	showContractForm: boolean;
	isEditing: boolean;
	closeContractForm: () => void;
	submitContractForm: () => Promise<void>;
	newContract: Contract;
}>()
</script>
