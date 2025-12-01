<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<!-- Statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

			<!-- Total Techniciens -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Techniciens</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ technicians?.length || 0 }}</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:user-group" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Disponibles -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-green-900">Disponibles</p>
						<p class="text-3xl font-bold text-green-900 mt-2">{{ availableCount }}</p>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Expérience Moyenne -->
			<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-purple-900">Expérience Moyenne</p>
						<p class="text-3xl font-bold text-purple-900 mt-2">{{ averageExperience }} ans</p>
					</div>
					<div class="p-3 rounded-lg bg-purple-500">
						<Icon name="heroicons:clock" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Spécialités -->
			<div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-orange-900">Spécialités</p>
						<p class="text-3xl font-bold text-orange-900 mt-2">{{ specialtiesCount }}</p>
					</div>
					<div class="p-3 rounded-lg bg-orange-500">
						<Icon name="heroicons:wrench-screwdriver" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

		</div>

		<!-- En-tête avec recherche et actions -->
		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<h1 class="text-xl font-bold text-gray-900">Liste des techniciens</h1>
			<div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row gap-3">
				<!-- Champ de recherche -->
				<div class="relative flex-1 max-w-xs w-full md:w-auto">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400" />
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher..."
						class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400" />
				</div>

				<!-- Bouton Nouveau -->
				<button @click="openAddModal" class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600
					 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
					<Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
					Nouveau technicien
				</button>
			</div>
		</div>

		<!-- Loader -->
		<div v-if="loading" class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>

		<!-- Contenu principal -->
		<template v-else-if="!error && filteredTechniciens.length > 0">
			<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
			<div class="hidden lg:block bg-white border rounded-lg shadow mt-6 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gradient-to-r from-blue-50 to-green-50">
							<tr>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Photo
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Nom
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Spécialité
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Expérience
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Contact
								</th>
								<th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-blue-800 tracking-wider">
									Disponibilité
								</th>
								<th scope="col" class="px-6 py-3 text-right text-xs font-semibold text-blue-800 tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="technicien in filteredTechniciens" :key="technicien.id + '-table'"
								class="hover:bg-gray-50 transition-colors duration-150">
								<td class="px-6 py-4 whitespace-nowrap">
									<img
										:src="technicien.photo ? `${API_BASE_URL.replace('/api', '')}/storage/${technicien.photo}` : `https://ui-avatars.com/api/?name=${technicien.full_name.split(' ').join('+')}&background=random`"
										class="h-10 w-10 rounded-full object-cover border-2 border-gray-200">
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{{ technicien.full_name }}</div>
									<div class="text-sm text-gray-500">{{ technicien.email }}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
										{{ technicien.specialty }}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center text-sm text-gray-500">
										<Icon name="heroicons:star" class="w-4 h-4 mr-1 text-yellow-500" />
										{{ technicien.years_of_experience }} ans
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<div class="flex items-center">
										<Icon name="heroicons:phone" class="w-4 h-4 mr-2 text-gray-400" />
										{{ technicien.phone || 'Non renseigné' }}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
										:class="getAvailabilityClass(technicien.availability)">
										{{ technicien.availability }}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button @click="viewTechnicien(technicien)" class="text-gray-600 hover:text-gray-900 mr-3"
										title="Voir les détails">
										<Icon name="heroicons:eye" class="w-5 h-5" />
									</button>
									<button @click="editTechnicien(technicien)" class="text-blue-600 hover:text-blue-900 mr-3"
										title="Modifier">
										<Icon name="heroicons:pencil-square" class="w-5 h-5" />
									</button>
									<button @click="deleteTechnicien(technicien)" class="text-red-600 hover:text-red-900"
										title="Supprimer">
										<Icon name="heroicons:trash" class="w-5 h-5" />
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Vue Cartes (visible uniquement sur écrans md et moins) -->
			<div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
				<div v-for="technicien in filteredTechniciens" :key="technicien.id + '-card'"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
					<div class="p-4">
						<div class="flex items-start space-x-3">
							<img
								:src="technicien.photo ? `${API_BASE_URL.replace('/api', '')}/storage/${technicien.photo}` : `https://ui-avatars.com/api/?name=${technicien.full_name.split(' ').join('+')}&background=random`"
								class="h-16 w-16 rounded-full object-cover border-2 border-gray-200">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">{{ technicien.full_name }}</h3>
								<span class="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
									{{ technicien.specialty }}
								</span>
							</div>
						</div>
						<div class="mt-3 space-y-2">
							<div class="flex items-center text-sm text-gray-600">
								<Icon name="heroicons:star" class="w-4 h-4 mr-2 text-yellow-500" />
								<span>{{ technicien.years_of_experience }} ans d'expérience</span>
							</div>
							<div class="flex items-center text-sm text-gray-600">
								<Icon name="heroicons:envelope" class="w-4 h-4 mr-2 text-gray-400" />
								<span>{{ technicien.email || 'Non renseigné' }}</span>
							</div>
							<div class="flex items-center text-sm text-gray-600">
								<Icon name="heroicons:phone" class="w-4 h-4 mr-2 text-gray-400" />
								<span>{{ technicien.phone || 'Non renseigné' }}</span>
							</div>
							<div class="flex items-center">
								<span class="px-2 py-1 text-xs font-semibold rounded-full"
									:class="getAvailabilityClass(technicien.availability)">
									{{ technicien.availability }}
								</span>
							</div>
						</div>
						<div class="flex justify-end mt-4 space-x-2">
							<button @click.stop="viewTechnicien(technicien)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
								title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5" />
							</button>
							<button @click.stop="editTechnicien(technicien)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
								title="Modifier">
								<Icon name="heroicons:pencil-square" class="w-5 h-5" />
							</button>
							<button @click.stop="deleteTechnicien(technicien)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
								title="Supprimer">
								<Icon name="heroicons:trash" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<Paginator :totalItems="filteredTechniciens.length" @range-changed="onRangeChanged" />
		</template>

		<!-- EmptyState -->
		<div v-else-if="!loading && !error">
			<EmptyState title="Aucun technicien trouvé" description="Il n'y a actuellement aucun technicien à afficher."
				icon="heroicons:user-group" iconColor="text-indigo-400" @reload="fetchTechniciens" :isLoading="loading"
				:searchQuery="searchQuery" />
		</div>

		<!-- Modal pour ajouter ou modifier un technicien -->
		<div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex items-center justify-center min-h-screen pt-4 px-2 md:px-5 pb-20 text-center sm:block sm:p-0">
				<div class="fixed inset-0 transition-opacity" aria-hidden="true">
					<div class="absolute inset-0 bg-gray-600 opacity-60" @click="closeModal"></div>
				</div>

				<div
					class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
					<div class="px-6 py-5">
						<div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
							<h3 class="text-xl font-bold text-gray-900">
								{{ isEditing ? 'Modifier Technicien' : 'Nouveau Technicien' }}
							</h3>
							<button @click="closeModal" class="text-gray-400 hover:text-gray-600 focus:outline-none">
								<Icon name="heroicons:x-mark" class="h-6 w-6" />
							</button>
						</div>

						<form @submit.prevent="submitForm">
							<div class="mt-6 space-y-4">
								<!-- Photo de profil -->
								<div class="flex flex-col items-center mb-6">
									<div class="relative h-24 w-24 rounded-full border-4 border-gray-200 mb-3">
										<img
											:src="technicianForm.photoPreview || `https://ui-avatars.com/api/?name=${technicianForm.full_name.split(' ').join('+')}&size=128`"
											class="h-full w-full rounded-full object-cover">
										<label for="photo-upload"
											class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
											<Icon name="heroicons:camera" class="h-4 w-4" />
											<input id="photo-upload" type="file" @change="handlePhotoUpload" accept="image/*" class="hidden">
										</label>
									</div>
								</div>

								<!-- Grille des champs -->
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div class="sm:col-span-2">
										<label for="full_name" class="block text-sm font-medium text-gray-700 mb-1">Nom
											complet</label>
										<input v-model="technicianForm.full_name" type="text" id="full_name" required
											class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
										<InvalidInput :error="validationErrors.full_name" />
									</div>

									<div>
										<label for="specialty" class="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
										<input v-model="technicianForm.specialty" type="text" id="specialty" required
											class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
										<InvalidInput :error="validationErrors.specialty" />
									</div>

									<div>
										<label for="years_of_experience" class="block text-sm font-medium text-gray-700 mb-1">Expérience
											(ans)</label>
										<input v-model="technicianForm.years_of_experience" type="number" id="years_of_experience"
											class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
										<InvalidInput :error="validationErrors.years_of_experience" />
									</div>

									<div class="sm:col-span-2">
										<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
										<input v-model="technicianForm.email" type="email" id="email" required
											class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
										<InvalidInput :error="validationErrors.email" />
									</div>

									<div>
										<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
										<input v-model="technicianForm.phone" type="tel" id="phone" required
											class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
										<InvalidInput :error="validationErrors.phone" />
									</div>

									<div>
										<label for="availability" class="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
										<select v-model="technicianForm.availability" id="availability"
											class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
											<option value="Disponible">Disponible</option>
											<option value="Occupé">Occupé</option>
											<option value="En congé">En congé</option>
										</select>
										<InvalidInput :error="validationErrors.availability" />
									</div>

									<div class="sm:col-span-2">
										<label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
										<input v-model="technicianForm.address" type="text" id="address"
											class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
										<InvalidInput :error="validationErrors.address" />
									</div>
								</div>
							</div>

							<div class="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
								<button @click="closeModal" type="button"
									class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
									Annuler
								</button>
								<button type="submit" :disabled="submitting" class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600
					 text-white px-6 py-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
									{{ submitting ? 'Traitement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal de détails -->
		<div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div class="fixed inset-0 transition-opacity" aria-hidden="true">
					<div class="absolute inset-0 bg-gray-600 opacity-60" @click="showDetailModal = false"></div>
				</div>

				<div
					class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
					<div class="px-6 py-5">
						<div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
							<h3 class="text-xl font-bold text-gray-900">Détails du Technicien</h3>
							<button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600 focus:outline-none">
								<Icon name="heroicons:x-mark" class="h-6 w-6" />
							</button>
						</div>

						<div class="mt-4" v-if="selectedTechnicien">
							<div class="flex flex-col items-center mb-6">
								<img
									:src="selectedTechnicien.photo || `https://ui-avatars.com/api/?name=${selectedTechnicien.full_name?.split(' ').join('+')}&size=256`"
									class="h-32 w-32 rounded-full object-cover border-4 border-gray-200 mb-3">
								<h2 class="text-2xl font-bold text-gray-800">{{ selectedTechnicien.full_name }}</h2>
								<span class="mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
									{{ selectedTechnicien.specialty }}
								</span>
							</div>

							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div class="bg-gray-50 rounded-lg p-4">
									<p class="text-sm font-medium text-gray-500">Expérience</p>
									<p class="mt-1 text-lg font-semibold text-gray-900">{{ selectedTechnicien.years_of_experience }} ans
									</p>
								</div>
								<div class="bg-gray-50 rounded-lg p-4">
									<p class="text-sm font-medium text-gray-500">Disponibilité</p>
									<p class="mt-1 text-lg font-semibold text-gray-900">{{ selectedTechnicien.availability }}</p>
								</div>
								<div class="bg-gray-50 rounded-lg p-4">
									<p class="text-sm font-medium text-gray-500">Email</p>
									<p class="mt-1 text-lg font-semibold text-gray-900">{{ selectedTechnicien.email }}</p>
								</div>
								<div class="bg-gray-50 rounded-lg p-4">
									<p class="text-sm font-medium text-gray-500">Téléphone</p>
									<p class="mt-1 text-lg font-semibold text-gray-900">{{ selectedTechnicien.phone }}</p>
								</div>
								<div class="sm:col-span-2 bg-gray-50 rounded-lg p-4">
									<p class="text-sm font-medium text-gray-500">Adresse</p>
									<p class="mt-1 text-lg font-semibold text-gray-900">{{ selectedTechnicien.address || 'Non renseignée'
									}}</p>
								</div>
							</div>
						</div>

						<div class="mt-6 flex justify-end border-t border-gray-200 pt-4">
							<button @click="showDetailModal = false" type="button"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
								Fermer
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
useHead({ title: "Gestion des Techniciens" });
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { technicianFormDefaultValue, type Technician } from '~/models/Technician'
import { useTechnicianStore } from '@/stores/TechnicianStore'
import InvalidInput from '~/app/components/partials/InvalidInput.vue'
import EmptyState from '~/app/components/EmptyState.vue'
import Swal from 'sweetalert2'
import Paginator from '~/app/components/Paginator.vue'

const API_BASE_URL = 'http://192.168.210.157:8000/api'

const technicianStore = useTechnicianStore()
const { validationErrors, technicians, loading } = storeToRefs(technicianStore);

const range = reactive({ start: 0, end: 0 });

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

const error = ref('')
const submitting = ref(false)
const searchQuery = ref('')

const filteredTechniciens = computed(() => {
	return technicians.value.filter(tech => {
		const search = searchQuery.value.toLowerCase()
		return (
			tech.full_name.toLowerCase().includes(search) ||
			tech.specialty.toLowerCase().includes(search) ||
			(tech.email && tech.email.toLowerCase().includes(search)) ||
			(tech.phone && tech.phone.includes(search))
		)
	})
})

const availableCount = computed(() => {
	return technicians.value.filter(tech => tech.availability === 'Disponible').length
})

const averageExperience = computed(() => {
	if (technicians.value.length === 0) return 0
	const total = technicians.value.reduce((sum, tech) => sum + (parseInt(tech.years_of_experience) || 0), 0)
	return Math.round(total / technicians.value.length)
})

const specialtiesCount = computed(() => {
	const specialties = new Set(technicians.value.map(tech => tech.specialty))
	return specialties.size
})

const showModal = ref(false)
const showDetailModal = ref(false)
const isEditing = ref(false)
const selectedTechnicien = ref<Technician | null>(null)
const currentTechnicienId = ref<string | null>(null)
const technicianForm = ref(technicianFormDefaultValue())

const getAvailabilityClass = (availability) => {
	switch (availability) {
		case 'Disponible': return 'bg-green-100 text-green-700'
		case 'Occupé': return 'bg-orange-100 text-orange-700'
		case 'En congé': return 'bg-red-100 text-red-700'
		default: return 'bg-gray-100 text-gray-700'
	}
}

const resetForm = () => {
	technicianForm.value = technicianFormDefaultValue()
	isEditing.value = false
	currentTechnicienId.value = null
}

const fetchTechniciens = async () => {
	try {
		await technicianStore.fetchTechnicians()
	} catch (err) {
		error.value = 'Erreur lors du chargement'
	}
}

const handlePhotoUpload = (event) => {
	const file = event.target.files[0]
	if (file) {
		technicianForm.value.photo = file
		technicianForm.value.photoPreview = URL.createObjectURL(file)
	}
}

const openAddModal = () => {
	resetForm()
	showModal.value = true
}

const editTechnicien = (technicien: Technician) => {
	isEditing.value = true
	currentTechnicienId.value = technicien.id
	technicianForm.value = {
		photo: null,
		photoPreview: technicien.photo ? `${API_BASE_URL.replace('/api', '')}/storage/${technicien.photo}` : '',
		full_name: technicien.full_name,
		specialty: technicien.specialty,
		years_of_experience: technicien.years_of_experience,
		email: technicien.email,
		phone: technicien.phone,
		address: technicien.address,
		availability: technicien.availability,
		date_added: technicien.date_added ? technicien.date_added.split(' ')[0] : new Date().toISOString().split('T')[0]
	}
	showModal.value = true
}

const viewTechnicien = (technicien: Technician) => {
	selectedTechnicien.value = technicien
	showDetailModal.value = true
}

const deleteTechnicien = async (technician: Technician) => {
	Swal.fire({
		title: 'Supprimer le technicien ?',
		text: `Êtes-vous sûr de vouloir supprimer ${technician.full_name} ? Cette action est irréversible.`,
		icon: 'question',
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		cancelButtonColor: '#3085d6',
		confirmButtonColor: '#d33',
		confirmButtonText: 'Oui, supprimer !'
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await technicianStore.deleteTechnician(technician.id);
				Swal.fire({
					icon: 'success',
					title: 'Succès',
					text: 'Technicien supprimé avec succès',
					timer: 2000,
					showConfirmButton: false
				});
			} catch (err) {
				Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer le technicien' })
			}
		}
	})
}

const closeModal = () => {
	showModal.value = false
	resetForm()
}

const submitForm = async () => {
	submitting.value = true

	const formData = new FormData()
	formData.append('full_name', technicianForm.value.full_name)
	formData.append('specialty', technicianForm.value.specialty)
	formData.append('years_of_experience', technicianForm.value.years_of_experience)
	formData.append('email', technicianForm.value.email)
	formData.append('phone', technicianForm.value.phone)
	formData.append('address', technicianForm.value.address)
	formData.append('availability', technicianForm.value.availability)
	formData.append('date_added', technicianForm.value.date_added)

	if (technicianForm.value.photo) {
		formData.append('photo', technicianForm.value.photo)
	}

	try {
		if (isEditing.value && currentTechnicienId.value) {
			await technicianStore.updateTechnician(currentTechnicienId.value, formData)
		} else {
			await technicianStore.addTechnician(formData)
		}
		showModal.value = false
		await fetchTechniciens()
		resetForm()
	} catch (err) {
		console.error(err)
	} finally {
		submitting.value = false
	}
}

onMounted(() => {
	fetchTechniciens()
})
</script>
