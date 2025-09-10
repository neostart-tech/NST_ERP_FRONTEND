<template>
	<div class="empty-state">
		<div class="empty-state-content">
			<div class="empty-state-icon">
				<slot name="icon">
					<Icon :name="icon" class="h-12 w-12" :class="iconColor"/>
				</slot>
			</div>

			<div class="empty-state-text">
				<slot name="text">
					<h3 class="empty-state-title">{{ title }}</h3>
					<p v-if="description" class="empty-state-description">{{ description }}</p>
					<p v-if="searchQuery" class="empty-state-description text-sm">
						Aucun résultat trouve pour <strong>"{{ searchQuery }}"</strong>
					</p>
				</slot>
			</div>

			<div v-if="showReload" class="empty-state-actions">
				<button
						@click="handleReload"
						class="reload-button"
						:disabled="isLoading"
				>
          <span v-if="isLoading" class="flex items-center justify-center">
            <Icon name="heroicons:arrow-path" class="animate-spin h-4 w-4 mr-2"/>
            Chargement...
          </span>
					<span v-else class="flex items-center">
            <Icon name="heroicons:arrow-path" class="h-4 w-4 mr-2"/>
            {{ reloadText }}
          </span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: 'Aucune donnée disponible'
	},
	description: {
		type: String,
		default: ''
	},
	icon: {
		type: String,
		default: 'heroicons:folder-open'
	},
	iconColor: {
		type: String,
		default: 'text-gray-400'
	},
	showReload: {
		type: Boolean,
		default: true
	},
	reloadText: {
		type: String,
		default: 'Recharger les données'
	},
	searchQuery: {
		type: String,
		default: '',
		required: false
	},
	isLoading: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['reload'])

const handleReload = () => {
	emit('reload')
}
</script>

<style scoped>
.empty-state {
	@apply flex items-center justify-center p-8;
}

.empty-state-content {
	@apply text-center max-w-md w-full;
}

.empty-state-icon {
	@apply mx-auto mb-4;
}

.empty-state-text {
	@apply mb-6;
}

.empty-state-title {
	@apply text-lg font-medium text-gray-900 mb-2;
}

.empty-state-description {
	@apply text-sm text-gray-500;
}

.empty-state-actions {
	@apply mt-6;
}

.reload-button {
	@apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>