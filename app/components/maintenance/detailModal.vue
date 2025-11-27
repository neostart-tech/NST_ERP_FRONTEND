<template>
	<!-- Modal Visualisation -->
	<div v-if="isOpen"
		class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
			<!-- En-tête -->
			<div class="bg-gradient-to-r from-blue-500 to-emerald-500 text-white p-6">
				<div class="flex justify-between items-start">
					<div>
						<h2 class="text-2xl font-bold">{{ equipment.company_name }}</h2>
						<p class="text-white/80 mt-1">{{ equipment.company_address }}</p>
						<p class="text-white/80">{{ equipment.company_zipCode }} {{ equipment.company_city }}</p>
					</div>
					<button @click="handleClose" class="text-white/80 hover:text-white transition-colors">
						<Icon name="heroicons:x-mark" class="w-8 h-8" />
					</button>
				</div>
			</div>

			<!-- Corps -->
			<div class="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Photo -->
					<div class="bg-gray-50 rounded-lg border-2 border-gray-200 p-6 h-64 flex items-center justify-center">
						<img v-if="equipment.photo" :src="equipment.photo as string"
							class="max-h-full max-w-full object-contain cursor-pointer"
							@click="handlePhotoClick(equipment.photo as string)">
						<div v-else class="text-center text-gray-400">
							<Icon name="heroicons:photo" class="h-16 w-16 mx-auto" />
							<p class="mt-3 text-sm font-medium">Aucune image disponible</p>
						</div>
					</div>

					<!-- Informations -->
					<div class="space-y-4">
						<div>
							<p class="text-xs font-semibold text-gray-500 uppercase">Type</p>
							<p class="mt-1 font-bold text-gray-900">{{ equipment.type }}</p>
						</div>
						<div>
							<p class="text-xs font-semibold text-gray-500 uppercase">N° de série</p>
							<p class="mt-1 font-mono font-bold text-gray-900">{{ equipment.serial_number }}</p>
						</div>
						<div>
							<p class="text-xs font-semibold text-gray-500 uppercase">Marque</p>
							<p class="mt-1 font-bold text-gray-900">{{ equipment.brand }}</p>
						</div>
						<div>
							<p class="text-xs font-semibold text-gray-500 uppercase">Modèle</p>
							<p class="mt-1 font-bold text-gray-900">{{ equipment.model }}</p>
						</div>
					</div>
				</div>

				<!-- Caractéristiques -->
				<div class="mt-6" v-if="equipment.characteristics">
					<h3 class="text-lg font-bold text-gray-900 mb-2">Caractéristiques Techniques</h3>
					<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
						<p class="text-sm text-gray-700 whitespace-pre-line">{{ equipment.characteristics }}</p>
					</div>
				</div>

				<!-- Commentaires -->
				<div class="mt-6" v-if="equipment.comment">
					<h3 class="text-lg font-bold text-gray-900 mb-2">Commentaires</h3>
					<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
						<p class="text-sm text-gray-700 whitespace-pre-line">{{ equipment.comment }}</p>
					</div>
				</div>
			</div>

			<!-- Pied -->
			<div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
				<button @click="handleExport"
					class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors">
					<Icon name="heroicons:arrow-down-tray" class="w-5 h-5 mr-2" />
					Exporter PDF
				</button>
				<button @click="handleClose"
					class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					Fermer
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Equipment } from '~/models/Equipment';
import { equipmentFormData } from '~/models/Equipment';

interface Props {
	isOpen: boolean;
	equipment: Equipment;
}

const props = withDefaults(defineProps<Props>(), {
	isOpen: false,
	equipment: () => equipmentFormData()
});

const emit = defineEmits<{
	close: [];
	photoClick: [url: string];
	export: [equipment: Equipment];
}>();

const handleClose = () => {
	emit('close');
};

const handlePhotoClick = (url: string) => {
	emit('photoClick', url);
};

const handleExport = () => {
	emit('export', props.equipment);
};
</script>
