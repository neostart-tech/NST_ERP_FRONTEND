<template>
	<div class="block lg:hidden space-y-4">
		<div v-for="documentType in filtered" :key="documentType.id" class="bg-white border rounded-lg shadow p-4">
			<div class="flex justify-between items-start">
				<div class="flex items-start gap-3 flex-1">
					<img v-if="documentType.file?.path" :src="storageUrl(documentType.file.path)" :alt="documentType.name"
							 class="h-12 w-12 rounded-md object-cover border border-gray-200 flex-shrink-0"/>
					<div v-else class="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
						<Icon name="heroicons:photo" class="h-6 w-6 text-gray-400"/>
					</div>
					<div>
						<h3 class="text-md font-semibold text-gray-900">{{ documentType.name }}</h3>
						<p class="text-sm text-gray-500 mt-1">{{ documentType.description ?? '-' }}</p>
						<div class="mt-3 flex flex-wrap items-center gap-3 text-sm">
						<span :class="documentType.isAvailable ? 'text-emerald-600' : 'text-red-600'">{{
								documentType.isAvailable ? 'Disponible' : 'Non disponible'
							}}</span>
						<span class="text-gray-400">•</span>
						<span :class="documentType.required ? 'text-emerald-600' : 'text-gray-600'">{{
								documentType.required ? 'Obligatoire' : 'Optionnel'
							}}</span>
						<span class="text-gray-400">•</span>
						<span class="text-gray-700">{{ readableStatus(documentType.status) }}</span>
						</div>
					</div>
				</div><!-- end flex items-start -->
				<div class="flex items-center ml-4 space-x-2">
					<button @click="edit(documentType)" class="text-blue-600 hover:text-blue-900 p-2" title="Modifier">
						<Icon name="heroicons:pencil-square" class="w-5 h-5"/>
					</button>
					<button @click="toggleAvailability(documentType.id)" class="text-amber-600 hover:text-amber-900 p-2"
									title="Basculer disponibilité">
						<Icon name="heroicons:arrows-right-left" class="w-5 h-5"/>
					</button>
					<button @click="confirmDelete(documentType)" class="text-red-600 hover:text-red-900 p-2" title="Supprimer">
						<Icon name="heroicons:trash" class="w-5 h-5"/>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {DocumentType} from '~/models/DocumentType';

const storageUrl = (path: string) => {
	const base = import.meta.env.VITE_API_URL_BASE || 'http://localhost:8000';
	return `${base}/storage/${path}`;
};

defineProps<{
	confirmDelete: (dt: DocumentType) => void,
	edit: (dt: DocumentType) => void,
	filtered: DocumentType[],
	readableStatus: (s?: string) => ("Disponible" | "Manquant" | "En cours" | string),
	toggleAvailability: (id: string) => Promise<void>,
}>();
</script>
