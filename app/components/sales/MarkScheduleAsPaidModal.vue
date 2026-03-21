<template>
	<div v-if="showModal"
			 class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-w-2xl p-6 relative">
			<button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
				<Icon name="heroicons-solid:x-mark" class="w-5 h-5"/>
			</button>

			<h2 class="text-2xl font-bold mb-6 text-green-700">
				<Icon name="heroicons-solid:check-circle" class="w-7 h-7 inline mr-2"/>
				Marquer l'échéance comme payée
			</h2>

			<!-- Informations de l'échéance -->
			<div v-if="schedule" class="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
					<div>
						<span class="font-semibold text-gray-700">Facture :</span>
						<span class="ml-2 text-gray-900">{{ schedule.invoice.reference }}</span>
					</div>
					<div>
						<span class="font-semibold text-gray-700">Client :</span>
						<span class="ml-2 text-gray-900">{{ getClientName(schedule.invoice.client) }}</span>
					</div>
					<div>
						<span class="font-semibold text-gray-700">Montant échéance :</span>
						<span class="ml-2 text-green-600 font-bold">{{ formatCurrency(schedule.amount) }}</span>
					</div>
					<div>
						<span class="font-semibold text-gray-700">Date prévue :</span>
						<span class="ml-2 text-gray-900">{{ formatDate(schedule.scheduledDate) }}</span>
					</div>
				</div>
			</div>

			<!-- Formulaire -->
			<form @submit.prevent="submitPayment" class="space-y-4">
				<!-- Montant -->
				<div>
					<label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
						Montant payé <span class="text-red-500">*</span>
					</label>
					<input
						id="amount"
						v-model.number="form.amount"
						type="number"
						step="0.01"
						min="0"
						:max="schedule?.amount"
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
						:class="{ 'border-red-500': validationErrors.amount }"
						required
					/>
					<p v-if="validationErrors.amount" class="text-red-500 text-xs mt-1">
						{{ validationErrors.amount[0] }}
					</p>
					<p class="text-xs text-gray-500 mt-1">
						Montant maximum : {{ formatCurrency(schedule?.amount || 0) }}
					</p>
				</div>

				<!-- Mode de paiement -->
				<div>
					<label for="modePayment" class="block text-sm font-medium text-gray-700 mb-2">
						Mode de paiement <span class="text-red-500">*</span>
					</label>
					<select
						id="modePayment"
						v-model="form.modePaymentId"
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
						:class="{ 'border-red-500': validationErrors.modePaymentId }"
						required
					>
						<option value="">-- Sélectionner un mode de paiement --</option>
						<option
							v-for="mode in modePayments"
							:key="mode.id"
							:value="mode.id"
						>
							{{ mode.label }}
						</option>
					</select>
					<p v-if="validationErrors.modePaymentId" class="text-red-500 text-xs mt-1">
						{{ validationErrors.modePaymentId[0] }}
					</p>
				</div>

				<!-- Date de paiement -->
				<div>
					<label for="date" class="block text-sm font-medium text-gray-700 mb-2">
						Date de paiement <span class="text-red-500">*</span>
					</label>
					<input
						id="date"
						v-model="form.date"
						type="date"
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
						:class="{ 'border-red-500': validationErrors.date }"
						required
					/>
					<p v-if="validationErrors.date" class="text-red-500 text-xs mt-1">
						{{ validationErrors.date[0] }}
					</p>
				</div>

				<!-- Boutons d'action -->
				<div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
					<button
						type="button"
						@click="closeModal"
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						:disabled="isSaving"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
						:disabled="isSaving"
					>
						<Icon v-if="isSaving" name="svg-spinners:ring-resize" class="w-4 h-4 inline mr-2"/>
						<Icon v-else name="heroicons-solid:check" class="w-4 h-4 inline mr-2"/>
						{{ isSaving ? 'Enregistrement...' : 'Confirmer le paiement' }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { InvoiceSchedule } from '~/models/InvoiceSchedule'
import type { ModePayment } from '~/models/ModePayment'
import { getClientName } from '~/models/Client'
import { formatCurrency } from '@/utils/currency-parser'
import { formatDate } from '@/utils/dateParser'

interface Props {
	showModal: boolean
	schedule: InvoiceSchedule | null
	modePayments: ModePayment[]
	isSaving: boolean
	validationErrors: ValidationErrors
}

const props = defineProps<Props>()

const emit = defineEmits<{
	close: []
	submit: [payload: { amount: number; modePaymentId: string; date: string }]
}>()

const form = ref({
	amount: 0,
	modePaymentId: '',
	date: new Date().toISOString().split('T')[0]
})

// Réinitialiser le formulaire quand une nouvelle échéance est sélectionnée
watch(() => props.schedule, (newSchedule) => {
	if (newSchedule) {
		form.value = {
			amount: newSchedule.amount,
			modePaymentId: '',
			date: new Date().toISOString().split('T')[0]
		}
	}
}, { immediate: true })

const closeModal = () => {
	emit('close')
}

const submitPayment = () => {
	const modePaymentId = form.value.modePaymentId;
	const date = form.value.date;

	if (!modePaymentId || !date) {
		return;
	}

	emit('submit', {
		amount: form.value.amount,
		modePaymentId: modePaymentId,
		date: date
	})
}
</script>

