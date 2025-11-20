<template>
	<!-- Modal Affichage Client -->
	<div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-3">
		<div class="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg">
			<!-- En-tête -->
			<div class="flex items-center justify-between mb-6">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
						<Icon name="heroicons:user-circle" class="w-6 h-6 text-blue-600" />
					</div>
					<h3 class="text-lg font-semibold text-gray-900">Informations Client</h3>
				</div>
				<button @click="closeModal" class="text-gray-400 hover:text-gray-600">
					<Icon name="heroicons:x-mark" class="w-6 h-6" />
				</button>
			</div>

			<!-- Contenu -->
			<div class="space-y-4 mb-6">
				<!-- Type de client -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Type de client</label>
					<input type="text" readonly
						:value="client?.client_type === 'Physique' ? 'Particulier' : 'Entreprise'"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
				</div>

				<!-- Informations Client Physique -->
				<template v-if="client?.client_type === 'Physique'">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
							<input type="text" readonly
								:value="client?.last_name || ''"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
							<input type="text" readonly
								:value="client?.first_name || ''"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
						</div>
					</div>
				</template>

				<!-- Informations Client Moral -->
				<template v-else-if="client?.client_type === 'Moral'">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Raison Sociale</label>
						<input type="text" readonly
							:value="client?.company_name || ''"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
					</div>
				</template>

				<!-- Informations communes -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input type="email" readonly
							:value="client?.email || ''"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
						<input type="tel" readonly
							:value="client?.phone || ''"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Région</label>
						<input type="text" readonly
							:value="client?.region || ''"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
						<input type="text" readonly
							:value="client?.city || ''"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
					</div>
					<div class="sm:col-span-2">
						<label class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
						<input type="text" readonly
							:value="client?.country || ''"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 cursor-not-allowed" />
					</div>
				</div>
			</div>

			<!-- Bouton Fermer -->
			<div class="flex justify-end">
				<button @click="closeModal"
					class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
					Fermer
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Client } from '~/models/Client'

interface Props {
	isOpen: boolean
	client?: Client | null
}

interface Emits {
	(e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
	client: null
})

const emit = defineEmits<Emits>()

const showModal = computed(() => props.isOpen)
const client = computed(() => props.client)

const closeModal = () => {
	emit('close')
}
</script>
