<template>
	<div>
		<!-- Header -->
		<div class="px-6 py-4 border-b">
			<h2 class="text-lg font-semibold text-gray-900">
				Détails du mouvement
			</h2>
		</div>

		<!-- Contenu -->
		<div class="px-6 py-6 grid grid-cols-1 gap-y-6 md:grid-cols-3">

			<div class="md:col-span-3 space-y-6">

				<!-- Produit -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700">Produit</label>
					<div class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900">
						{{ getProductName(movement.product_id) }}
					</div>
				</div>

				<!-- Type + Quantité -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-700">Type de Mouvement</label>
						<div class="flex items-center space-x-2">
							<span :class="getMovementTypeLabel(movement.movement_type).class">
								<Icon :name="getMovementTypeLabel(movement.movement_type).icon" class="h-3.5 w-3.5 mr-1" />
								{{ getMovementTypeLabel(movement.movement_type).text }}
							</span>
						</div>
					</div>

					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-700">Quantité</label>
						<div :class="[
							'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 font-semibold',
							movement.movement_type === 'entry' || movement.movement_type === 'adjustment_positive'
								? 'text-green-700'
								: 'text-red-600',
						]">
							{{ movement.movement_type === 'entry' || movement.movement_type === 'adjustment_positive' ? '+' : '-' }}
							{{ movement.quantity }}
						</div>
					</div>
				</div>

				<!-- Date -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700">Date du mouvement</label>
					<div class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900">
						{{ formatDate(movement.created_at) }}
					</div>
				</div>

				<!-- Raison -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700">Raison</label>
					<div class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 min-h-[80px]">
						{{ movement.reason || 'Aucune raison spécifiée' }}
					</div>
				</div>
			</div>

			<!-- FOOTER -->
			<div class="md:col-span-3 border-t pt-6 flex justify-end gap-3">
				<button type="button" @click="showDetailModal = false"
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
					Fermer
				</button>
			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	movement: any;
	products: any[];
}>();

const showDetailModal = defineModel<boolean>('showDetailModal', { default: false });

const getProductName = (productId: number | string) => {
	const id = String(productId);
	const product = props.products.find((p) => p.id === id);
	return product ? product.name : 'Produit inconnu';
};

const getMovementTypeLabel = (type: string) => {
	const labels: Record<string, { text: string; icon: string; color: string }> = {
		'entry': { text: 'Entrée (Achat/Retour)', icon: 'heroicons:arrow-down-tray', color: 'green' },
		'exit': { text: 'Sortie (Vente/Perte)', icon: 'heroicons:arrow-up-tray', color: 'red' },
		'adjustment_positive': { text: 'Ajustement Positif', icon: 'heroicons:plus-circle', color: 'blue' },
		'adjustment_negative': { text: 'Ajustement Négatif', icon: 'heroicons:minus-circle', color: 'orange' }
	};

	const movement = labels[type] || { text: type, icon: 'heroicons:question-mark-circle', color: 'gray' };

	return {
		...movement,
		class: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${movement.color}-100 text-${movement.color}-800`
	};
};

const formatDate = (dateString: string) => {
	if (!dateString) return 'Date invalide';
	const date = new Date(dateString);
	if (isNaN(date.getTime())) return 'Date invalide';
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	};
	return date.toLocaleDateString('fr-FR', options);
};
</script>
