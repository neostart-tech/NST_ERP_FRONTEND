<template>
	<div class="w-full">
		<!-- Label -->
		<label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
			{{ label }}
		</label>

		<!-- ComboBox Container -->
		<div ref="comboContainer" class="relative">
			<!-- Input/Trigger Button -->
			<div
				class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-600 hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 flex items-center justify-between gap-2"
			>
				<input
					ref="searchInput"
					v-model="searchQuery"
					@focus="openDropdown"
					@input="openDropdown"
					type="text"
					:placeholder="selectedProduct ? selectedProduct.name : placeholder"
					class="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 w-full"
				/>

				<!-- Clear button when there's a search query -->
				<button
					v-if="searchQuery"
					@click.stop="clearSearch"
					type="button"
					class="text-gray-400 hover:text-gray-600 transition-colors"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<!-- Chevron Icon -->
				<button
					@click="toggleDropdown"
					type="button"
					class="text-gray-400 hover:text-gray-600 transition-colors"
				>
					<svg
						class="w-5 h-5 transition-transform duration-200"
						:class="{ 'rotate-180': isOpen }"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
			</div>

			<!-- Dropdown List using Teleport -->
			<Teleport to="body">
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
						class="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto"
						:style="{
							width: comboContainer?.offsetWidth + 'px',
							left: comboContainer?.getBoundingClientRect().left + 'px',
							top: dropUp
								? comboContainer?.getBoundingClientRect().top - 280 + 'px'
								: comboContainer?.getBoundingClientRect().bottom + 8 + 'px',
						}"
					>
						<!-- No results message -->
						<div
							v-if="filteredProducts.length === 0"
							class="px-4 py-6 text-center text-gray-500"
						>
							<svg
								class="w-8 h-8 mx-auto mb-2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<p>Aucun produit trouvé</p>
						</div>

						<!-- Product Options -->
						<div
							v-for="product in filteredProducts"
							:key="product.id"
							@click="selectProduct(product)"
							class="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
							:class="{ 'bg-blue-50': isSelected(product) }"
						>
							<!-- Product Info -->
							<div class="flex-1 min-w-0">
								<p class="text-gray-900 font-medium truncate">
									{{ product.name }}
								</p>
								<div class="flex items-center gap-2 text-sm">
									<span v-if="showQuantity" class="text-gray-500 truncate">
										Stock: {{ product.current_stock }} {{ product.unit }}
									</span>
									<span v-if="showQuantity && showPrice" class="text-gray-300"
										>•</span
									>
									<span v-if="showPrice" class="text-green-600 truncate">
										{{ formatCurrency(product.unit_price_sale) }}
									</span>
								</div>
							</div>

							<!-- Check icon for selected -->
							<svg
								v-if="isSelected(product)"
								class="w-5 h-5 text-blue-500 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</Transition>
			</Teleport>
			<!-- Click Outside Handler -->
			<div
				v-if="isOpen"
				@click="isOpen = false"
				class="fixed inset-0 z-40"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { type Product, formatCurrency } from "~/models/Product";

// Props
const props = withDefaults(
	defineProps<{
		products: Product[];
		modelValue?: Product | string | number | null;
		label?: string;
		placeholder?: string;
		showPrice?: boolean;
		showQuantity?: boolean;
		returnId?: boolean;
		onUpdateModelValue?: (value: Product | string | number) => void;
	}>(),
	{
		label: "",
		placeholder: "Rechercher un produit...",
		showPrice: true,
		showQuantity: true,
		returnId: true,
	},
);

// Emits
const emit = defineEmits<{
	"update:modelValue": [value: Product | string | number];
}>();

const isOpen = ref(false);
const searchQuery = ref("");
const searchInput = ref<HTMLInputElement | null>(null);
const dropUp = ref(false);
const comboContainer = ref<HTMLElement | null>(null);

// Calcule si le dropdown doit s'ouvrir vers le haut
const checkDropDirection = () => {
	if (!comboContainer.value) return;
	const rect = comboContainer.value.getBoundingClientRect();
	const spaceBelow = window.innerHeight - rect.bottom;
	// Si moins de 280px en dessous, ouvrir vers le haut
	dropUp.value = spaceBelow < 280;
};

// Computed pour obtenir le produit sélectionné (que ce soit un objet ou un id)
const selectedProduct = computed(() => {
	if (!props.modelValue) return null;

	if (typeof props.modelValue === "object") {
		return props.modelValue as Product;
	}

	// Si c'est un id, on cherche le produit correspondant
	return props.products.find((p) => p.id === props.modelValue) || null;
});

// Vérifie si un produit est sélectionné
const isSelected = (product: Product): boolean => {
	if (!props.modelValue) return false;

	if (typeof props.modelValue === "object") {
		return (props.modelValue as Product).id === product.id;
	}

	return props.modelValue === product.id;
};

// Computed property pour filtrer les produits selon la recherche
const filteredProducts = computed(() => {
	if (!searchQuery.value.trim()) {
		return props.products;
	}

	const query = searchQuery.value.toLowerCase().trim();
	return props.products.filter((product: Product) => {
		const name = product.name.toLowerCase();
		const reference = (product.reference || "").toLowerCase();
		return name.includes(query) || reference.includes(query);
	});
});

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
	if (isOpen.value) {
		nextTick(() => {
			checkDropDirection();
			searchInput.value?.focus();
		});
	}
};

const openDropdown = () => {
	isOpen.value = true;
	nextTick(() => {
		checkDropDirection();
	});
};

const selectProduct = (product: Product) => {
	if (props.returnId) {
		emit("update:modelValue", product.id);
	} else {
		emit("update:modelValue", product);
	}
	searchQuery.value = "";
	isOpen.value = false;
};

const clearSearch = () => {
	searchQuery.value = "";
	searchInput.value?.focus();
};

// Handle escape key to close dropdown
const handleEscape = (event: KeyboardEvent) => {
	if (event.key === "Escape") {
		isOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleEscape);
});
</script>
