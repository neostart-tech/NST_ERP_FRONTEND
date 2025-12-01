<template>
	<div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
			<div class="p-6">
				<div class="flex justify-between items-center border-b pb-4">
					<h2 class="text-2xl font-bold text-gray-800">
						{{ editing ? 'Modifier le signalement' : 'Nouveau signalement' }}
					</h2>
					<button @click="close" class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
					<!-- Equipment and Client Selection -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Sélectionner l'équipement <span class="text-red-500">*</span>
							</label>
							<select v-model="localForm.equipement_id" @change="onEquipmentChange"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Sélectionner un équipement</option>
								<option v-for="equip in equipments" :key="equip.id" :value="equip.id">
									{{ equip.brand }} {{ equip.model }} ({{ equip.serial_number }})
								</option>
							</select>
							<InvalidInput :error="validationErrors.equipement_id" />
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Sélectionner le client <span class="text-red-500">*</span>
							</label>
							<select v-model="localForm.client_id" @change="onClientChange"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Sélectionner un client</option>
								<option v-for="client in clients" :key="client.id" :value="client.id">
									{{ client.client_type === 'company' ? client.company_name : client.first_name + ' ' + client.last_name
									}}
								</option>
							</select>
							<InvalidInput :error="validationErrors.client_id" />
						</div>
					</div>

					<!-- Equipment Details -->
					<div v-if="selectedEquipment" class="bg-blue-50 p-4 rounded-lg border border-blue-100">
						<h3 class="font-medium text-gray-800 mb-2 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd"
									d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
									clip-rule="evenodd" />
							</svg>
							Détails de l'équipement
						</h3>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<p class="text-xs text-gray-600">Nom</p>
								<p class="font-medium">{{ selectedEquipment.brand }} {{ selectedEquipment.model }}</p>
							</div>
							<div>
								<p class="text-xs text-gray-600">Numéro de série</p>
								<p class="font-medium">{{ selectedEquipment.serial_number }}</p>
							</div>
							<div>
								<p class="text-xs text-gray-600">Fabricant</p>
								<p class="font-medium">{{ selectedEquipment.manufacturer }}</p>
							</div>
							<div>
								<p class="text-xs text-gray-600">Modèle</p>
								<p class="font-medium">{{ selectedEquipment.model }}</p>
							</div>
							<div>
								<p class="text-xs text-gray-600">Sous garantie</p>
								<p class="font-medium" :class="selectedEquipment.under_warranty ? 'text-green-600' : 'text-red-600'">
									{{ selectedEquipment.under_warranty ? 'Oui' : 'Non' }}
								</p>
							</div>
						</div>
					</div>

					<!-- Client Information -->
					<div v-if="selectedClient" class="bg-green-50 p-4 rounded-lg border border-green-100">
						<h3 class="font-medium text-gray-800 mb-2 flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none"
								viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
							Informations client
						</h3>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<p class="text-xs text-gray-600">Type de client</p>
								<p class="font-medium">
									{{ selectedClient.client_type === 'company' ? 'Client moral (entreprise)' : 'Client physique' }}
								</p>
							</div>
							<div>
								<p class="text-xs text-gray-600">
									{{ selectedClient.client_type === 'company' ? 'Nom de l\'entreprise' : 'Nom du client' }}
								</p>
								<p class="font-medium">
									{{ selectedClient.client_type === 'company' ? selectedClient.company_name :
										selectedClient.first_name + ' ' + selectedClient.last_name }}
								</p>
							</div>
							<div>
								<p class="text-xs text-gray-600">Téléphone</p>
								<p class="font-medium">{{ selectedClient.phone }}</p>
							</div>
							<div>
								<p class="text-xs text-gray-600">Email</p>
								<p class="font-medium">{{ selectedClient.email }}</p>
							</div>
						</div>
					</div>

					<!-- Problem Description -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">
							Défaut constaté <span class="text-red-500">*</span>
						</label>
						<textarea v-model="localForm.problem_description" rows="3"
							class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
						<InvalidInput :error="validationErrors.problem_description" />
					</div>

					<!-- Technician Assignment -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Technicien assigné <span class="text-red-500">*</span>
							</label>
							<select v-model="localForm.technician_id"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Sélectionner un technicien</option>
								<option v-for="technician in technicians" :key="technician.id" :value="technician.id">
									{{ technician.full_name }}
								</option>
							</select>
							<InvalidInput :error="validationErrors.technician_id" />
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Date du signalement <span class="text-red-500">*</span>
							</label>
							<input v-model="localForm.report_date" type="datetime-local"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							<InvalidInput :error="validationErrors.report_date" />
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Heure de contact</label>
							<input v-model="localForm.contact_time" type="time"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							<InvalidInput :error="validationErrors.contact_time" />
						</div>
					</div>

					<!-- Status and Checkboxes -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								Statut <span class="text-red-500">*</span>
							</label>
							<select v-model="localForm.status"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="new">Nouveau</option>
								<option value="diagnostic">En diagnostic</option>
								<option value="quotation">Validation du devis en cours</option>
								<option value="repair">En réparation</option>
								<option value="waiting">En attente de pièces</option>
								<option value="finished">Terminé</option>
								<option value="delivered">Livré</option>
							</select>
							<InvalidInput :error="validationErrors.status" />
						</div>
						<div class="space-y-3">
							<div class="flex items-center">
								<input v-model="localForm.is_tested_certified" type="checkbox"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
								<label class="ml-2 block text-sm text-gray-700">L'objet testé certifié en état de marche</label>
							</div>
							<div class="flex items-center">
								<input v-model="localForm.is_sent_for_maintenance" type="checkbox"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
								<label class="ml-2 block text-sm text-gray-700">L'objet envoyé pour suite de maintenance</label>
							</div>
							<div v-if="localForm.is_sent_for_maintenance" class="flex items-center ml-6">
								<input v-model="localForm.needs_delivery" type="checkbox"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
								<label class="ml-2 block text-sm text-gray-700">Le client souhaite être livré</label>
							</div>
							<div v-if="localForm.needs_delivery" class="ml-6">
								<label class="block text-sm font-medium text-gray-700 mb-1">Prix de livraison</label>
								<div class="relative rounded-md shadow-sm">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<span class="text-gray-500 sm:text-sm">FCFA</span>
									</div>
									<input v-model="localForm.delivery_price" type="number"
										class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-lg px-4 py-2">
								</div>
							</div>
							<div class="flex items-center">
								<input v-model="localForm.under_contract" type="checkbox"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
								<label class="ml-2 block text-sm text-gray-700">Client sous contrat</label>
							</div>
						</div>
					</div>

					<!-- Repair Dates -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Date début réparation</label>
							<input v-model="localForm.repair_start_date" type="datetime-local"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Date fin réparation</label>
							<input v-model="localForm.repair_end_date" type="datetime-local"
								class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Durée de réparation</label>
							<input v-model="localForm.repair_duration" type="text" readonly
								class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
						</div>
					</div>

					<!-- Technician Findings -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Défaut constaté par le technicien</label>
						<textarea v-model="localForm.technician_findings" rows="3"
							class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
						<InvalidInput :error="validationErrors.technician_findings" />
					</div>

					<!-- Form Actions -->
					<div class="flex justify-end space-x-4 pt-6 border-t">
						<button type="button" @click="close"
							class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors">
							Annuler
						</button>
						<button type="submit"
							class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
							{{ editing ? 'Mettre à jour' : 'Enregistrer' }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useInterventionStore } from '~/app/stores/Maintenance/InterventionStore';
import type { Client } from '~/models/Client'
import type { Equipment } from '~/models/Equipment'
import type { Intervention } from '~/models/Intervention'
import type { Technician } from '~/models/Technician';
import InvalidInput from '../partials/InvalidInput.vue';
import { useEquipmentStore } from '~/app/stores/Maintenance/EquipmentStore';

const { validationErrors } = storeToRefs(useInterventionStore());

interface Props {
	modelValue: boolean
	formData: Intervention
	editing?: boolean
}

const clientStore = useClientStore()
const technicianStore = useTechnicianStore();
const equipmentStore = useEquipmentStore();

const { equipments } = storeToRefs(equipmentStore);
const { clients } = storeToRefs(clientStore);
const { technicians } = storeToRefs(technicianStore);

const props = withDefaults(defineProps<Props>(), {
	editing: false
});

const emit = defineEmits<{
	'close': []
	'submit': [formData: Intervention]
	'equipment-change': [equipmentId: string | number]
	// 'client-change': [clientId: string | number]
}>()

const localForm = ref<Intervention>({ ...props.formData })

const selectedEquipment = ref<Equipment | null>(null)
const selectedClient = ref<Client | null>(null)

watch(() => props.formData, (newData) => {
	localForm.value = { ...newData }
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
	if (newValue) {
		localForm.value = { ...props.formData }
	}
});

const onEquipmentChange = () => {
	const equipment = equipments.value.find(e => e.id === localForm.value.equipement_id)
	selectedEquipment.value = equipment || null
	emit('equipment-change', localForm.value.equipement_id)
}

const onClientChange = () => {
	const client = clients.value.find(c => c.id === localForm.value.client_id)
	selectedClient.value = client || null
}

const close = () => {
	emit('close')
}

const handleSubmit = () => {
	emit('submit', localForm.value)
}

onMounted(() => {
	loadEquipments();
	loadClients();
	loadTechnicians();
})

const loadEquipments = async () => {
	try {
		await equipmentStore.fetchEquipments()
	} catch (error) {
		useAlert().showAlert('Impossible de charger la liste des équipements', 'error', 5000)
	}
};

const loadClients = async () => {
	try {
		await clientStore.fetchClients();
	} catch (error) {
		useAlert().showAlert('Impossible de charger la liste des clients', 'error', 5000);
	}
};

const loadTechnicians = async () => {
	try {
		await technicianStore.fetchTechnicians()
	} catch (error) {
		useAlert().showAlert('Impossible de charger la liste des techniciens', 'error', 5000)
	}
};
</script>
