<template>
	<div class="pagination-container">
		<!-- Conteneur principal en grille responsive -->
		<div class="pagination-content grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
			<!-- 1) Affichage de la plage (colonne gauche en md+) -->
			<div v-if="totalItems > 0"
				class="range-display justify-self-center md:justify-self-start w-full text-center md:text-left">
				Affichage de {{ startItem }} à {{ endItem }} éléments sur {{ totalItems }}
			</div>

			<!-- 2) Sélecteur d'éléments par page (centre en md+) -->
			<div class="per-page-selector text-center md:text-left justify-self-center w-full md:w-auto" v-if="showItemsPerPage">
				<select :value="itemsPerPage" @change="handleItemsPerPageChange($event)" class="page-select w-full md:w-auto">
					<option v-for="num in [10, 25, 50, 100]" :value="num" :key="`perpage-${num}`">
						{{ num }} / page
					</option>
				</select>
			</div>

			<!-- 3) Navigation (droite en md+) -->
			<nav class="pagination-nav justify-self-center md:justify-self-end whitespace-nowrap" aria-label="Pagination">
				<button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button prev-next">
					&larr; Précédent
				</button>

				<template v-for="page in pages" :key="page">
					<button v-if="page === '...'" disabled class="pagination-ellipsis">
						{{ page }}
					</button>
					<button v-else @click="goToPage(page as number)" :class="['pagination-page', { active: page === currentPage }]">
						{{ page }}
					</button>
				</template>

				<button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
					class="pagination-button prev-next">
					Suivant &rarr;
				</button>
			</nav>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	totalItems: { type: Number, required: true },
	maxVisiblePages: { type: Number, default: 5 },
	showItemsPerPage: { type: Boolean, default: true },
});

const itemsPerPage = ref(10);
const currentPage = ref(1);

const emit = defineEmits([
	'page-changed',
	'range-changed'
])

const totalPages = computed(() => Math.ceil(props.totalItems / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
	const end = currentPage.value * itemsPerPage.value
	return end > props.totalItems ? props.totalItems : end
})

const pages = computed(() => {
	const range: Array<number | string> = []
	const half = Math.floor(props.maxVisiblePages / 2)
	let start = Math.max(currentPage.value - half, 1)
	let end = Math.min(start + props.maxVisiblePages - 1, totalPages.value)

	if (end - start + 1 < props.maxVisiblePages) {
		start = Math.max(end - props.maxVisiblePages + 1, 1)
	}

	if (start > 1) {
		range.push(1)
		if (start > 2) range.push('...')
	}

	for (let i = start; i <= end; i++) range.push(i)

	if (end < totalPages.value) {
		if (end < totalPages.value - 1) range.push('...')
		range.push(totalPages.value)
	}

	return range
});

watch([startItem, endItem], ([start, end]) => {
	emit('range-changed', { start, end })
}, { immediate: true });

const goToPage = (page: number) => {
	if (page < 1 || page > totalPages.value || page === currentPage.value) return
	currentPage.value = page;
	emit('page-changed', page)
}

const handleItemsPerPageChange = (event: Event) => {
	itemsPerPage.value = Number((event.target as HTMLSelectElement).value);
	currentPage.value = 1;
}
</script>
