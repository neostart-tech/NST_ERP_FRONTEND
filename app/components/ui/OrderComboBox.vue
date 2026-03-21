<template>
	<div class="w-full">
		<label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
		<div class="relative">
			<div class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 flex items-center justify-between gap-2">
				<input ref="searchInput" v-model="searchQuery" @focus="isOpen = true" @input="isOpen = true" type="text"
					:placeholder="selectedOrder ? getOrderDisplayName(selectedOrder) : placeholder"
					class="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 w-full" />
				<button v-if="searchQuery" @click.stop="clearSearch" type="button" class="text-gray-400 hover:text-gray-700 transition-colors">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
				<button @click="toggleDropdown" type="button" class="text-gray-400 hover:text-gray-700 transition-colors">
					<svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
					</svg>
				</button>
			</div>
			<Transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
				<div v-if="isOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
					<div v-if="filteredOrders.length === 0" class="px-4 py-6 text-center text-gray-500">
						<svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
						</svg>
						<p>Aucune commande trouvée</p>
					</div>
					<div v-for="order in filteredOrders" :key="order.id" @click="selectOrder(order)"
						class="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
						:class="{ 'bg-blue-50': selectedOrder?.id === order.id }">
						<div class="flex-1 min-w-0">
							<p class="text-gray-900 font-medium truncate">Commande n° {{ order.reference }}</p>
							<div class="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
								<span v-if="showDate && order.created_at" class="truncate">{{ formatDate(order.created_at) }}</span>
								<span v-if="showClient && order.client" class="truncate">• {{ getClientName(order.client) }}</span>
								<span v-if="showStatus" class="text-xs px-2 py-0.5 rounded" :class="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
							</div>
							<div v-if="showTotal" class="text-sm font-semibold text-blue-600 mt-1">{{ formatCurrency(order.total_ttc) }}</div>
						</div>
						<svg v-if="selectedOrder?.id === order.id" class="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
						</svg>
					</div>
				</div>
			</Transition>
		</div>
		<div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getClientName } from "~/models/Client"
import type { Order } from "~/models/Invoice"

const props = withDefaults(defineProps<{
	orders: Order[]
	modelValue?: string | Order | null
	label?: string
	placeholder?: string
	showDate?: boolean
	showClient?: boolean
	showStatus?: boolean
	showTotal?: boolean
	returnObject?: boolean
}>(), {
	modelValue: null,
	label: '',
	placeholder: 'Rechercher une commande...',
	showDate: true,
	showClient: true,
	showStatus: true,
	showTotal: false,
	returnObject: false
})

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | Order | null): void
	(e: 'change', value: Order | null): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const selectedOrder = ref<Order | null>(null)

const getOrderDisplayName = (order: Order): string => {
	let display = `Commande n° ${order.reference}`
	if (order.created_at) display += ` - ${formatDate(order.created_at)}`
	return display
}

const formatDate = (dateStr: string): string => {
	return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
}

const getStatusClass = (status: string): string => {
	switch (status) {
		case 'delivered': return 'bg-green-100 text-green-800'
		case 'pending': return 'bg-yellow-100 text-yellow-800'
		case 'canceled': return 'bg-red-100 text-red-800'
		default: return 'bg-gray-100 text-gray-800'
	}
}

const getStatusLabel = (status: string): string => {
	switch (status) {
		case 'delivered': return 'Livrée'
		case 'pending': return 'En attente'
		case 'canceled': return 'Annulée'
		default: return status
	}
}

const filteredOrders = computed(() => {
	if (!searchQuery.value.trim()) return props.orders
	const query = searchQuery.value.toLowerCase().trim()
	return props.orders.filter((order: Order) => {
		const reference = (order.reference || '').toLowerCase()
		const clientName = order.client ? getClientName(order.client).toLowerCase() : ''
		const date = order.created_at ? formatDate(order.created_at).toLowerCase() : ''
		return reference.includes(query) || clientName.includes(query) || date.includes(query)
	})
})

watch(() => props.modelValue, (newValue) => {
	if (newValue === null) { selectedOrder.value = null; return }
	if (typeof newValue === 'string') {
		const order = props.orders.find(o => o.id === newValue)
		if (order) selectedOrder.value = order
	} else if (typeof newValue === 'object') {
		selectedOrder.value = newValue
	}
}, { immediate: true })

watch(() => props.orders, () => {
	if (props.modelValue && typeof props.modelValue === 'string') {
		const order = props.orders.find(o => o.id === props.modelValue)
		if (order) selectedOrder.value = order
	}
}, { immediate: true })

const toggleDropdown = () => {
	isOpen.value = !isOpen.value
	if (isOpen.value) searchInput.value?.focus()
}

const selectOrder = (order: Order) => {
	selectedOrder.value = order
	searchQuery.value = ''
	isOpen.value = false
	const emittedValue = props.returnObject ? order : order.id
	emit('update:modelValue', emittedValue)
	emit('change', order)
}

const clearSearch = () => {
	searchQuery.value = ''
	searchInput.value?.focus()
}

const handleEscape = (event: KeyboardEvent) => {
	if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => document.addEventListener('keydown', handleEscape))
onUnmounted(() => document.removeEventListener('keydown', handleEscape))
</script>

