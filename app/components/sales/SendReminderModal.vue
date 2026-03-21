<template>
	<!-- Modal overlay -->
	<div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
			 aria-modal="true">
		<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
			<!-- Overlay background -->
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
					 @click="closeModal"></div>

			<!-- Center modal -->
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

			<!-- Modal panel -->
			<div
				class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
				<!-- Header -->
				<div class="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<div class="flex-shrink-0 bg-blue-500 bg-opacity-20 rounded-full p-2">
								<Icon name="heroicons-solid:bell" class="h-6 w-6 text-blue-600"/>
							</div>
							<h3 class="ml-3 text-lg font-semibold text-blue-900" id="modal-title">
								Envoyer une relance
							</h3>
						</div>
						<button @click="closeModal" type="button"
										class="bg-blue-500 bg-opacity-10 rounded-md p-1 text-blue-600 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-500">
							<Icon name="heroicons-solid:x-mark" class="h-5 w-5"/>
						</button>
					</div>
				</div>

				<!-- Body -->
				<div class="bg-white px-6 py-5 space-y-4">
					<!-- Info échéance -->
					<div class="bg-gray-50 rounded-lg p-4 border border-gray-200" v-if="schedule">
						<h4 class="text-sm font-semibold text-gray-700 mb-3">Informations de l'échéance</h4>
						<div class="space-y-2 text-sm">
							<div class="flex justify-between">
								<span class="text-gray-600">Facture :</span>
								<span class="font-medium text-gray-900">{{ schedule.invoice.reference }}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Client :</span>
								<span class="font-medium text-gray-900">{{ getClientName(schedule.invoice.client) }}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Montant :</span>
								<span class="font-medium text-gray-900">{{ formatCurrency(schedule.amount) }}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Date prévue :</span>
								<span class="font-medium text-gray-900">{{ formatDate(schedule.scheduledDate) }}</span>
							</div>
						</div>
					</div>

					<!-- Motif de la relance -->
					<div>
						<label for="reminder-reason" class="block text-sm font-medium text-gray-700 mb-2">
							Motif de la relance
						</label>
						<textarea
							id="reminder-reason"
							v-model="reminderReason"
							rows="4"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							:class="{'border-red-500': validationErrors?.motif}"
							placeholder="Saisissez le motif de la relance..."
						></textarea>
						<p v-if="validationErrors?.motif" class="mt-1 text-sm text-red-600">
							{{ validationErrors.motif[0] }}
						</p>
					</div>
				</div>

				<!-- Footer -->
				<div class="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
					<button
						@click="handleSubmit"
						type="button"
						:disabled="isSaving || !reminderReason.trim()"
						class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
					>
						<Icon v-if="isSaving" name="heroicons-solid:arrow-path" class="animate-spin -ml-1 mr-2 h-4 w-4"/>
						<Icon v-else name="heroicons-solid:paper-airplane" class="-ml-1 mr-2 h-4 w-4"/>
						{{ isSaving ? 'Envoi en cours...' : 'Envoyer la relance' }}
					</button>
					<button
						@click="closeModal"
						type="button"
						:disabled="isSaving"
						class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
					>
						Annuler
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import type {InvoiceSchedule} from '~/models/InvoiceSchedule';
import {getClientName} from '~/models/Client';
import {formatDate} from '@/utils/dateParser';
import {formatCurrency} from '@/utils/currency-parser';

interface Props {
	showModal: boolean;
	schedule: InvoiceSchedule | null;
	isSaving: boolean;
	validationErrors?: ValidationErrors;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	close: [];
	submit: [reason: string];
}>();

const reminderReason = ref('Merci de procéder au règlement dans les meilleurs délais afin d\'éviter tout retard.');

watch(() => props.showModal, (newVal) => {
	if (newVal) {
		// Réinitialiser avec le motif par défaut à chaque ouverture
		reminderReason.value = 'Merci de procéder au règlement dans les meilleurs délais afin d\'éviter tout retard.';
	}
});

const closeModal = () => {
	if (!props.isSaving) {
		emit('close');
	}
};

const handleSubmit = () => {
	if (reminderReason.value.trim()) {
		emit('submit', reminderReason.value);
	}
};
</script>

