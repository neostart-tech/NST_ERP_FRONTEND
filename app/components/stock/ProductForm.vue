<template>
	<form @submit.prevent="submitProductForm">
		<!-- Contenu du formulaire -->
		<div class="px-6 py-4">
			<div class="space-y-6">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<!-- Nom du produit -->
					<div class="space-y-1">
						<label class="block text-sm font-medium text-gray-700">Nom du produit</label>
						<input v-model="currentProduct.name" type="text" name="name" required
							class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
						<InvalidInput :error="validationErrors.name" />
					</div>

					<!-- Référence -->
					<div class="space-y-1">
						<label class="block text-sm font-medium text-gray-700">Référence</label>
						<input v-model="currentProduct.reference" type="text" name="reference"
							class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
						<InvalidInput :error="validationErrors.reference" />
					</div>

					<!-- Description -->
					<div class="space-y-1 sm:col-span-2">
						<label class="block text-sm font-medium text-gray-700">Description</label>
						<textarea v-model="currentProduct.description" name="description" rows="3"
							class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"></textarea>
					</div>

					<!-- Prix d'achat -->
					<div class="space-y-1">
						<label class="block text-sm font-medium text-gray-700">Prix d'achat (FCFA)</label>
						<input v-model.number="currentProduct.unit_price_purchase" type="number" name="unit_price_purchase"
							min="0" step="0.01" required
							class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
						<InvalidInput :error="validationErrors.unit_price_purchase" />
					</div>

					<!-- Prix de vente -->
					<div class="space-y-1">
						<label class="block text-sm font-medium text-gray-700">Prix de vente (FCFA)</label>
						<input v-model.number="currentProduct.unit_price_sale" type="number" name="unit_price_sale"
							min="0" step="0.01" required
							class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
						<InvalidInput :error="validationErrors.unit_price_sale" />
					</div>

					<!-- Quantité en stock -->
					<div class="space-y-1">
						<label class="block text-sm font-medium text-gray-700">Quantité en stock</label>
						<input v-model.number="currentProduct.current_stock" type="number" name="current_stock"
							min="0" required
							class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
						<InvalidInput :error="validationErrors.current_stock" />
					</div>

					<!-- Unité de mesure -->
					<div class="space-y-1">
						<label class="block text-sm font-medium text-gray-700">Unité de mesure</label>
						<input v-model="currentProduct.unit" type="text" name="unit"
							placeholder="Ex: pièce, kg, L, etc."
							class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border" />
						<InvalidInput :error="validationErrors.unit" />
					</div>

					<!-- Statut -->
					<div class="space-y-1 sm:col-span-2">
						<label class="block text-sm font-medium text-gray-700">Statut</label>
						<div class="mt-2 flex gap-6">
							<div class="flex items-center">
								<input id="status-active" type="radio" name="is_active" :value="true"
									v-model="currentProduct.is_active"
									class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
								<label for="status-active" class="ml-2 text-sm text-gray-700 cursor-pointer">Actif</label>
							</div>
							<div class="flex items-center">
								<input id="status-inactive" type="radio" name="is_active" :value="false"
									v-model="currentProduct.is_active"
									class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
								<label for="status-inactive" class="ml-2 text-sm text-gray-700 cursor-pointer">Inactif</label>
							</div>
						</div>
						<InvalidInput :error="validationErrors.is_active" />
					</div>
				</div>
			</div>

			<!-- Pied de page du modal -->
			<div class="mt-4 sm:flex sm:flex-row-reverse">
				<button type="submit" :disabled="isFormLoading"
					class="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">
					<Spinner :is-loading="isFormLoading" />
					<span class="ml-3">{{ isFormLoading ? (editingProductId ? 'Mise à jour en cours...' : 'Enregistrement en cours...') : (editingProductId ? 'Mettre à jour' : 'Enregistrer') }}</span>
				</button>
				<button type="button" @click="showProductFormModal = false"
					class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
					Annuler
				</button>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">
defineProps<{
	editingProductId: string | null;
	submitProductForm: () => Promise<void>;
	currentProduct: { id: string; name: string; reference: string; description: string; category_id: string; unit_price_purchase: number; unit_price_sale: number; current_stock: number; unit: string; is_active: { valueOf: () => boolean; }; };
	validationErrors: globalThis.ValidationErrors;
	isFormLoading: boolean;
}>()
const showProductFormModal = defineModel<boolean>('showProductFormModal', { required: true })
</script>
