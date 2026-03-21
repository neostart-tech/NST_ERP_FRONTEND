<template>
	<div class="relative w-full">
		<label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
			{{ label }}
		</label>
		<div class="relative">
			<button type="button" @click="toggleDropdown"
				class="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-2.5 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
				<span v-if="selectedInvoice" class="block truncate">
					{{ selectedInvoice.reference }} - {{ getClientName(selectedInvoice.client)}}
				</span>
				<span v-else class="block truncate text-gray-400">
					{{ placeholder }}
				</span>
				<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
					<Icon name="heroicons:chevron-up-down" class="h-5 w-5 text-gray-400" />
				</span>
			</button>

			<!-- Dropdown -->
			<transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
				leave-to-class="opacity-0">
				<div v-show="isOpen"
					class="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
					<!-- Champ de recherche -->
					<div class="sticky top-0 z-10 bg-white px-2 py-2 border-b border-gray-200">
						<div class="relative">
							<Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input v-model="searchQuery" type="text" @click.stop
								class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								:placeholder="searchPlaceholder" />
						</div>
					</div>

					<!-- Liste des factures -->
					<ul class="py-1">
						<li v-for="invoice in filteredInvoices" :key="invoice.id" @click="selectInvoice(invoice)"
							class="cursor-pointer select-none relative py-3 px-3 hover:bg-indigo-50 transition-colors">
							<div class="flex items-center justify-between">
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-gray-900 truncate">
										{{ invoice.reference }}
									</p>
									<p class="text-sm text-gray-500 truncate">
										{{ getClientName(invoice.client) }}
									</p>
									<div class="flex items-center gap-2 mt-1">
										<span class="text-xs text-gray-600">
											{{ formatCurrency(invoice.total) }}
										</span>
										<span v-if="showRemaining" class="text-xs text-orange-600 font-medium">
											Reste: {{ formatCurrency(invoice.total - invoice.payed) }}
										</span>
									</div>
								</div>
								<Icon v-if="isSelected(invoice)" name="heroicons:check" class="h-5 w-5 text-indigo-600 flex-shrink-0 ml-2" />
							</div>
						</li>
						<li v-if="filteredInvoices.length === 0" class="px-3 py-3 text-sm text-gray-500 text-center">
							Aucune facture trouvée
						</li>
					</ul>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { Invoice } from '~/models/Invoice';
import {getClientName} from "~/models/Client";

interface Props {
	invoices: Invoice[];
	modelValue?: Invoice | string | null;
	label?: string;
	placeholder?: string;
	searchPlaceholder?: string;
	returnObject?: boolean;
	showRemaining?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	placeholder: 'Sélectionner une facture',
	searchPlaceholder: 'Rechercher une facture...',
	returnObject: true,
	showRemaining: false,
});

const emit = defineEmits<{
	'update:modelValue': [value: Invoice | string | null];
}>();

const isOpen = ref(false);
const searchQuery = ref('');

const selectedInvoice = computed(() => {
	if (props.returnObject) {
		return props.modelValue as Invoice | null;
	} else {
		return props.invoices.find(inv => inv.id === props.modelValue) || null;
	}
});

const filteredInvoices = computed(() => {
	if (!searchQuery.value) return props.invoices;

	const query = searchQuery.value.toLowerCase();
	return props.invoices.filter(invoice => {
		const reference = invoice.reference?.toLowerCase() || '';
		const total = invoice.total?.toString() || '';

		return (
			reference.includes(query) ||
			getClientName(invoice.client).includes(query) ||
			total.includes(query)
		);
	});
});

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
	if (isOpen.value) {
		searchQuery.value = '';
	}
};

const selectInvoice = (invoice: Invoice) => {
	if (props.returnObject) {
		emit('update:modelValue', invoice);
	} else {
		emit('update:modelValue', invoice.id);
	}
	isOpen.value = false;
	searchQuery.value = '';
};

const isSelected = (invoice: Invoice) => {
	return selectedInvoice.value?.id === invoice.id;
};

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'XOF',
	}).format(amount);
};

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	if (isOpen.value && !target.closest('.relative')) {
		isOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>

