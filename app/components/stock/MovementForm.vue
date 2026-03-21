<template>
	<form @submit.prevent="submitMovementForm">

		<!-- Header -->
		<div class="px-6 py-4 border-b">
			<h2 class="text-lg font-semibold text-gray-900">
				Ajouter un mouvement
			</h2>
		</div>

		<!-- Contenu -->
		<div class="px-6 py-6 grid grid-cols-1 gap-y-6 md:grid-cols-3">

			<div class="md:col-span-3 space-y-6">

				<!-- Produit -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700">Produit
						<RequiredField/>
					</label>
					<ProductComboBox
						v-model="currentMovement.product_id"
						:products="products"
						label="Sélectionner un produit"
						:show-price="true"
						:show-quantity="true"
					/>

					<InvalidInput :error="validationErrors.product_id"/>
				</div>

				<!-- Type + Quantité -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-700">Type de Mouvement
							<RequiredField/>
						</label>
						<select v-model="currentMovement.movement_type" name="movement_type" required
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border">
							<option value="" disabled>Sélectionner un type</option>
							<option value="entry">Entrée (Achat/Retour)</option>
							<option value="exit">Sortie (Vente/Perte)</option>
							<option value="adjustment_positive">Ajustement Positif</option>
							<option value="adjustment_negative">Ajustement Négatif</option>
						</select>
						<InvalidInput :error="validationErrors.movement_type"/>
					</div>

					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-700">Quantité
							<RequiredField/>
						</label>
						<input v-model.number="currentMovement.quantity" type="number" name="quantity" min="1" required
									 class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"/>
						<InvalidInput :error="validationErrors.quantity"/>
					</div>
				</div>

				<!-- Raison -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700">Raison (Optionnel)</label>
					<textarea v-model="currentMovement.reason" name="reason" rows="3"
										class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"></textarea>
					<InvalidInput :error="validationErrors.reason"/>
				</div>
			</div>

			<!-- FOOTER -->
			<div class="md:col-span-3 border-t pt-6 flex justify-end gap-3">
				<button type="button" @click="showMovementFormModal = false"
								class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					Annuler
				</button>

				<button type="submit" :disabled="isFormLoading"
								class="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50">
					<Spinner :is-loading="isFormLoading"/>
					<span class="ml-2">
						{{ isFormLoading ? 'Enregistrement en cours...' : 'Enregistrer Mouvement' }}
					</span>
				</button>
			</div>

		</div>
	</form>
</template>

<script setup lang="ts">
import InvalidInput from '../partials/InvalidInput.vue';
import RequiredField from '../partials/RequiredField.vue';
import Spinner from '../partials/Spinner.vue';
import ProductComboBox from "@/components/ui/ProductComboBox.vue";

defineProps<{
	products: any[];
	currentMovement: any;
	validationErrors: any;
	isFormLoading: boolean;
}>();

const showMovementFormModal = defineModel<boolean>('showMovementFormModal', {default: false});

const emit = defineEmits<{
	submit: [];
}>();

const submitMovementForm = () => {
	emit('submit');
};
</script>
