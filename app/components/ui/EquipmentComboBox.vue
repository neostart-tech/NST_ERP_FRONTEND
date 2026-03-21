<template>
	<div class="w-full">
		<!-- Label -->
		<label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
			{{ label }}
		</label>

		<!-- ComboBox Container -->
		<div class="relative">
			<!-- Input/Trigger Button -->
			<div
				class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 flex items-center justify-between gap-2"
			>
				<input
					ref="searchInput"
					v-model="searchQuery"
					@focus="isOpen = true"
					@input="isOpen = true"
					type="text"
					:placeholder="selectedEquipment ? getEquipmentDisplayInfo(selectedEquipment) : placeholder"
					class="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 w-full"
				/>

				<!-- Clear button when there's a search query -->
				<button
					v-if="searchQuery"
					@click.stop="clearSearch"
					type="button"
					class="text-gray-400 hover:text-gray-700 transition-colors"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>

				<!-- Chevron Icon -->
				<button
					@click="toggleDropdown"
					type="button"
					class="text-gray-400 hover:text-gray-700 transition-colors"
				>
					<svg
						class="w-5 h-5 transition-transform duration-200"
						:class="{ 'rotate-180': isOpen }"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
					</svg>
				</button>
			</div>

			<!-- Dropdown List -->
			<Transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<div
					v-if="isOpen"
					class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto"
				>
					<!-- No results message -->
					<div
						v-if="filteredEquipments.length === 0"
						class="px-4 py-6 text-center text-gray-500"
					>
						<svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
						</svg>
						<p>Aucun équipement trouvé</p>
					</div>

					<!-- Equipment Options -->
					<div
						v-for="equipment in filteredEquipments"
						:key="equipment.id"
						@click="selectEquipment(equipment)"
						class="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
						:class="{ 'bg-blue-50': selectedEquipment?.id === equipment.id }"
					>
						<!-- Equipment Info -->
						<div class="flex-1 min-w-0">
							<p class="text-gray-900 font-medium truncate">{{ getEquipmentName(equipment) }}</p>
							<div class="flex items-center gap-2 text-sm text-gray-500">
								<span v-if="showSerialNumber && equipment.serial_number" class="truncate">{{ equipment.serial_number }}</span>
								<span v-if="showManufacturer && equipment.manufacturer" class="truncate">{{ equipment.manufacturer }}</span>
								<span v-if="showType && equipment.type" class="text-xs bg-gray-200 px-2 py-0.5 rounded">{{ equipment.type }}</span>
								<span v-if="showWarranty && equipment.under_warranty !== undefined"
									class="text-xs px-2 py-0.5 rounded"
									:class="equipment.under_warranty ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
									{{ equipment.under_warranty ? 'Sous garantie' : 'Hors garantie' }}
								</span>
							</div>
						</div>

						<!-- Check icon for selected -->
						<svg
							v-if="selectedEquipment?.id === equipment.id"
							class="w-5 h-5 text-blue-500 flex-shrink-0"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"/>
						</svg>
					</div>
				</div>
			</Transition>
		</div>

		<!-- Click Outside Handler -->
		<div
			v-if="isOpen"
			@click="isOpen = false"
			class="fixed inset-0 z-40"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getEquipmentName, getEquipmentDisplayInfo, type Equipment } from "~/models/Equipment"

// Props
const props = withDefaults(defineProps<{
	equipments: Equipment[]
	modelValue?: string | Equipment | null
	label?: string
	placeholder?: string
	showSerialNumber?: boolean
	showManufacturer?: boolean
	showType?: boolean
	showWarranty?: boolean
	returnObject?: boolean,
	onUpdateModelValue?: (value: string | Equipment | null) => void
}>(), {
	modelValue: null,
	label: '',
	placeholder: 'Rechercher un équipement...',
	showSerialNumber: true,
	showManufacturer: false,
	showType: false,
	showWarranty: false,
	returnObject: false
})

// Emits
const emit = defineEmits<{
	(e: 'update:modelValue', value: string | Equipment | null): void
	(e: 'change', value: Equipment | null): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const selectedEquipment = ref<Equipment | null>(null)

// Computed property pour filtrer les équipements selon la recherche
const filteredEquipments = computed(() => {
	if (!searchQuery.value.trim()) {
		return props.equipments
	}

	const query = searchQuery.value.toLowerCase().trim()
	return props.equipments.filter((equipment: Equipment) => {
		const name = getEquipmentName(equipment).toLowerCase()
		const serialNumber = (equipment.serial_number || '').toLowerCase()
		const manufacturer = (equipment.manufacturer || '').toLowerCase()
		const brand = (equipment.brand || '').toLowerCase()
		const model = (equipment.model || '').toLowerCase()
		const type = (equipment.type || '').toLowerCase()

		return name.includes(query) ||
			   serialNumber.includes(query) ||
			   manufacturer.includes(query) ||
			   brand.includes(query) ||
			   model.includes(query) ||
			   type.includes(query)
	})
})

// Watch pour initialiser la sélection depuis modelValue
watch(() => props.modelValue, (newValue) => {
	if (newValue === null) {
		selectedEquipment.value = null
		return
	}

	if (typeof newValue === 'string') {
		// Si c'est un ID, trouver l'équipement correspondant
		const equipment = props.equipments.find(e => e.id === newValue)
		if (equipment) {
			selectedEquipment.value = equipment
		}
	} else if (typeof newValue === 'object') {
		selectedEquipment.value = newValue
	}
}, { immediate: true })

// Watch pour mettre à jour quand la liste des équipements change
watch(() => props.equipments, () => {
	if (props.modelValue && typeof props.modelValue === 'string') {
		const equipment = props.equipments.find(e => e.id === props.modelValue)
		if (equipment) {
			selectedEquipment.value = equipment
		}
	}
}, { immediate: true })

const toggleDropdown = () => {
	isOpen.value = !isOpen.value
	if (isOpen.value) {
		searchInput.value?.focus()
	}
}

const selectEquipment = (equipment: Equipment) => {
	selectedEquipment.value = equipment
	searchQuery.value = ''
	isOpen.value = false

	// Émettre la valeur selon le mode choisi
	const emittedValue = props.returnObject ? equipment : equipment.id
	emit('update:modelValue', emittedValue)
	emit('change', equipment)
}

const clearSearch = () => {
	searchQuery.value = ''
	searchInput.value?.focus()
}

// Handle escape key to close dropdown
const handleEscape = (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		isOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleEscape)
})
</script>
