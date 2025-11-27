<template>
	<!-- Modal Ajout/Modification -->
	<div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
			<!-- En-tête du modal -->
			<div class="bg-gradient-to-r from-blue-500 to-emerald-500 p-6">
				<div class="flex justify-between items-center">
					<div>
						<h2 class="text-2xl font-bold text-white">
							{{ isEditing ? 'Modifier l\'équipement' : 'Nouvel Équipement' }}
						</h2>
						<p class="text-white/80 mt-1">
							{{
								isEditing ? 'Mettez à jour les informations de l\'équipement' : "Ajoutez un nouvel équipement à votre parc"
							}}
						</p>
					</div>
					<button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors">
						<Icon name="heroicons:x-mark" class="w-8 h-8" />
					</button>
				</div>
			</div>

			<!-- Corps du formulaire -->
			<div class="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
				<form @submit.prevent="$emit('submit')" class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Type d'équipement -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Type d'équipement
								<RequiredField />
							</label>
							<select v-model="formData.type" @change="$emit('toggleNetworkFields')" required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Sélectionnez un type</option>
								<option value="Réseau">Réseau</option>
								<option value="Non réseau">Non réseau</option>
							</select>
						</div>

						<!-- Marque -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Marque
								<RequiredField />
							</label>
							<input v-model="formData.brand" type="text" required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>

						<!-- Fabricant -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Fabricant</label>
							<input v-model="formData.manufacturer" type="text"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>

						<!-- Modèle -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Modèle
								<RequiredField />
							</label>
							<input v-model="formData.model" type="text" required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>

						<!-- Numéro de série -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Numéro de série
								<RequiredField />
							</label>
							<input v-model="formData.serial_number" type="text" required
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>

						<!-- Prix du diagnostic -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Prix du diagnostic (FCFA)</label>
							<input v-model="formData.diagnostic_price" type="number" step="0.01"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>

						<!-- Champs spécifiques réseau -->
						<template v-if="showNetworkFields">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
								<input v-model="formData.role" type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Adresse MAC</label>
								<input v-model="formData.mac_address" type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Adresse IP</label>
								<input v-model="formData.ip_address" type="text"
									class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
							</div>
						</template>

						<!-- Champs spécifiques non-réseau -->
						<div v-if="!showNetworkFields">
							<label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
							<input v-model="formData.name" type="text"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>

						<!-- Caractéristiques -->
						<div class="md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-2">Caractéristiques</label>
							<textarea v-model="formData.characteristics" rows="3"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
						</div>

						<!-- Informations de la société -->
						<div class="md:col-span-2">
							<h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
								<Icon name="heroicons:building-office" class="w-5 h-5 mr-2 text-blue-500" />
								Informations de la société
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-2">Nom de la société
										<RequiredField />
									</label>
									<input v-model="formData.company_name" type="text" required
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-2">Adresse
										<RequiredField />
									</label>
									<input v-model="formData.company_address" type="text" required
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-2">Code postal
										<RequiredField />
									</label>
									<input v-model="formData.company_zipCode" type="text" required
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								</div>
								<div>
									<label class="block text-sm font-medium text-gray-700 mb-2">Ville
										<RequiredField />
									</label>
									<input v-model="formData.company_city" type="text" required
										class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								</div>
							</div>
						</div>

						<!-- Upload de photo -->
						<div class="md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-2">Photo de l'équipement</label>
							<div class="mt-2 flex items-center">
								<img v-if="formData.photoPreview" :src="formData.photoPreview"
									class="h-24 w-24 object-cover rounded-lg border-2 border-gray-200 mr-4 cursor-pointer"
									@click="$emit('photoClick', formData.photoPreview)">
								<input type="file" ref="photoInput" @change="$emit('photoUpload', $event)" accept="image/*" class="hidden">
								<button type="button" @click="$refs.photoInput.click()"
									class="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors">
									{{ formData.photoPreview ? 'Changer la photo' : 'Ajouter une photo' }}
								</button>
								<button v-if="formData.photoPreview" type="button" @click="$emit('removePhoto')"
									class="ml-4 text-red-600 hover:text-red-800 text-sm font-medium">
									Supprimer
								</button>
							</div>
						</div>

						<!-- Commentaires -->
						<div class="md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
							<textarea v-model="formData.comment" rows="3"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
						</div>
					</div>

					<!-- Boutons d'action -->
					<div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
						<button type="button" @click="$emit('close')"
							class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
							Annuler
						</button>

						<button type="submit" :disabled="isSaving"
							class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
							<Spinner :isLoading="isSaving" />
							{{ isSaving ? 'Enregistrement en cours...' : isEditing ? 'Mettre à jour' : 'Enregistrer' }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import type { Equipment } from '~/models/Equipment';
import RequiredField from '~/app/components/partials/RequiredField.vue';
import Spinner from '~/app/components/partials/Spinner.vue';

defineProps<{
	isOpen: boolean;
	isEditing: boolean;
	formData: Equipment;
	showNetworkFields: boolean;
	isSaving: boolean;
}>();

defineEmits<{
	close: [];
	submit: [];
	toggleNetworkFields: [];
	photoClick: [photoUrl: string];
	photoUpload: [event: Event];
	removePhoto: [];
}>();
</script>
