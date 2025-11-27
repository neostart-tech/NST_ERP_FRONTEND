<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

		<!-- Cartes de statistiques -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Total Équipements -->
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-blue-900">Total Équipements</p>
						<p class="text-3xl font-bold text-blue-900 mt-2">{{ equipmentsCount }}</p>
					</div>
					<div class="p-3 rounded-lg bg-blue-500">
						<Icon name="heroicons:cube" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Équipements Réseau -->
			<div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-emerald-900">Équipements Réseau</p>
						<p class="text-3xl font-bold text-emerald-900 mt-2">{{ networkCount }}</p>
					</div>
					<div class="p-3 rounded-lg bg-emerald-500">
						<Icon name="heroicons:wifi" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- Hors Réseau -->
			<div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-amber-900">Hors Réseau</p>
						<p class="text-3xl font-bold text-amber-900 mt-2">{{ nonNetworkCount }}</p>
					</div>
					<div class="p-3 rounded-lg bg-amber-500">
						<Icon name="heroicons:shield-check" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>

			<!-- En Service -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-green-900">En Service</p>
						<p class="text-3xl font-bold text-green-900 mt-2">{{ equipmentsCount }}</p>
					</div>
					<div class="p-3 rounded-lg bg-green-500">
						<Icon name="heroicons:check-circle" class="w-6 h-6 text-white" />
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-lg font-semibold text-slate-800 flex items-center">
					<svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
					</svg>
					Filtres et Recherche
				</h3>
				<!-- Bouton de réinitialisation des filtres -->
				<button @click="resetFilters"
					class="text-sm text-slate-600 hover:text-blue-600 flex items-center transition-colors">
					<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					Réinitialiser
				</button>
			</div>

			<!-- Grille de filtres -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Filtre par type d'équipement -->
				<div>
					<label class="block text-sm font-medium text-slate-700 mb-2">Type d'équipement</label>
					<select v-model="filterType"
						class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
						<option value="">Tous les types</option>
						<option value="Réseau">Réseau</option>
						<option value="Non réseau">Non réseau</option>
					</select>
				</div>

				<!-- Filtre par marque -->
				<div>
					<label class="block text-sm font-medium text-slate-700 mb-2">Marque</label>
					<select v-model="filterBrand"
						class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
						<option value="">Toutes les marques</option>
						<option v-for="brand in uniqueBrands" :key="brand" :value="brand">{{ brand }}</option>
					</select>
				</div>

				<!-- Champ de recherche texte -->
				<div>
					<label class="block text-sm font-medium text-slate-700 mb-2">Recherche</label>
					<input v-model="searchQuery" type="text" placeholder="Modèle, série, fabricant..."
						class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200">
				</div>

				<!-- Bouton d'export -->
				<div class="flex items-end">
					<button @click="null"
						class="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						Exporter
					</button>
				</div>

			</div>
			<!-- En-tête avec titre et bouton d'ajout -->
			<div class="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 my-3">
				<button @click="openAddModal"
					class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
					<Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
					<span>Nouvel Équipement</span>
				</button>
			</div>
		</div>
		<!-- Loader -->
		<div v-if="loading" class="flex justify-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>

		<!-- Contenu principal -->
		<template v-else-if="filteredEquipments.length > 0">
			<!-- Vue Tableau (visible uniquement sur écrans lg et plus) -->
			<div class="hidden lg:block bg-white border p-4 rounded-lg shadow mt-6">
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gradient-to-r from-blue-500 to-emerald-500">
							<tr>
								<th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
									Photo</th>
								<th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
									Type</th>
								<th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
									Marque</th>
								<th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
									Modèle</th>
								<th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
									Actions</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr v-for="equipment in paginatedEquipments" :key="equipment.id"
								class="hover:bg-gray-50 transition-colors duration-150">
								<td class="px-6 py-4 whitespace-nowrap">
									<img v-if="equipment.photo" :src="`${equipment.photo}`"
										class="h-12 w-12 rounded-lg object-cover border-2 border-gray-200 cursor-pointer hover:border-blue-300"
										@click="openPhotoModal(`${equipment.photo}`)">
									<div v-else class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
										<Icon name="heroicons:photo" class="w-6 h-6 text-gray-400" />
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
										:class="equipment.type === 'Réseau' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'">
										{{ equipment.type }}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{{ equipment.brand }}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{{ equipment.model }}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button @click="viewEquipment(equipment)" class="text-gray-600 hover:text-gray-900 mr-3"
										title="Voir les détails">
										<Icon name="heroicons:eye" class="w-5 h-5" />
									</button>
									<button @click="editEquipment(equipment)" class="text-blue-600 hover:text-blue-900 mr-3"
										title="Modifier">
										<Icon name="heroicons:pencil-square" class="w-5 h-5" />
									</button>
									<button @click="generateEquipmentSheet(equipment)"
										class="text-emerald-600 hover:text-emerald-900 mr-3" title="Générer PDF">
										<Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
									</button>
									<button @click="confirmDelete(equipment)" class="text-red-600 hover:text-red-900" title="Supprimer">
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
				<div v-for="equipment in paginatedEquipments" :key="equipment.id"
					class="rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
					<div class="p-4">
						<div class="flex items-start space-x-3">
							<img v-if="equipment.photo" :src="`${equipment.photo}`"
								class="h-16 w-16 rounded-lg object-cover border-2 border-gray-200 cursor-pointer"
								@click="openPhotoModal(equipment.photo as string)">
							<div v-else class="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
								<Icon name="heroicons:photo" class="w-8 h-8 text-gray-400" />
							</div>
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900">{{ equipment.model }}</h3>
								<span class="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full"
									:class="equipment.type === 'Réseau' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'">
									{{ equipment.type }}
								</span>
							</div>
						</div>
						<div class="mt-3 space-y-2">
							<div class="flex items-center text-sm text-gray-600">
								<Icon name="heroicons:building-storefront" class="w-4 h-4 mr-2 text-gray-400" />
								<span>{{ equipment.brand }}</span>
							</div>
							<div class="flex items-center text-sm text-gray-600">
								<Icon name="heroicons:wrench-screwdriver" class="w-4 h-4 mr-2 text-gray-400" />
								<span>{{ equipment.manufacturer || 'Non renseigné' }}</span>
							</div>
							<div class="flex items-center text-sm text-gray-600">
								<Icon name="heroicons:hashtag" class="w-4 h-4 mr-2 text-gray-400" />
								<span class="font-mono">{{ equipment.serial_number }}</span>
							</div>
						</div>
						<div class="flex justify-end mt-4 space-x-2">
							<button @click.stop="viewEquipment(equipment)" class="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full"
								title="Voir les détails">
								<Icon name="heroicons:eye" class="w-5 h-5" />
							</button>
							<button @click.stop="editEquipment(equipment)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
								title="Modifier">
								<Icon name="heroicons:pencil-square" class="w-5 h-5" />
							</button>
							<button @click.stop="generateEquipmentSheet(equipment)"
								class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-full" title="Générer PDF">
								<Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
							</button>
							<button @click.stop="confirmDelete(equipment)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
								title="Supprimer">
								<Icon name="heroicons:trash" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>

		<!-- EmptyState -->
		<div v-else-if="loading || !EquipmentStore.equipments">
			<EmptyState title="Aucun équipement trouvé" description="Il n'y a actuellement aucun équipement à afficher."
				icon="heroicons:cpu-chip" iconColor="text-blue-400" @reload="EquipmentStore.fetchEquipments()"
				:isLoading="loading" :searchQuery="searchQuery" />
		</div>

		<!-- Pagination -->
		<div v-if="filteredEquipments.length > 0" class="mt-6">
			<Paginator :totalItems="filteredEquipments.length" @range-changed="onRangeChanged" />
		</div>
	</div>

	<!-- Modal Ajout/Modification -->
	<FormModal
		:isOpen="showModal"
		:isEditing="isEditing"
		:formData="formData"
		:showNetworkFields="showNetworkFields"
		:isSaving="isSaving"
		@close="closeModal"
		@submit="submitForm"
		@toggleNetworkFields="toggleNetworkFields"
		@photoClick="openPhotoModal"
		@photoUpload="handlePhotoUpload"
		@removePhoto="removePhoto"
	/>

	<!-- Modal Visualisation -->
	<DetailModal :isOpen="showViewModal" :equipment="viewedEquipment" @close="showViewModal = false"
		@photoClick="openPhotoModal" @export="generateEquipmentSheet" />

	<!-- Modal Photo -->
	<PhotoModal :isOpen="showPhotoModal" :photoUrl="selectedPhoto" @close="closePhotoModal" />

</template>

<script setup lang="ts">
useHead({ title: "Gestion des Équipements" });

import { ref, computed, onMounted } from 'vue';
import { useEquipmentStore } from '~/app/stores/Maintenance/EquipmentStore';
import { equipmentFormData } from '~/models/Equipment';
import type { Equipment } from '~/models/Equipment';
import Paginator from '~/app/components/Paginator.vue';
import EmptyState from '~/app/components/EmptyState.vue';
import DetailModal from '~/app/components/maintenance/detailModal.vue';
import FormModal from '~/app/components/maintenance/formModal.vue';
import PhotoModal from '~/app/components/PhotoModal.vue';
import Swal from 'sweetalert2';

const EquipmentStore = useEquipmentStore();
const generateEquipmentSheet = EquipmentStore.generateEquipmentSheet;
const { equipments, loading } = storeToRefs(EquipmentStore);

// États
const showModal = ref(false);
const showViewModal = ref(false);
const showPhotoModal = ref(false);
const isEditing = ref(false);
const isSaving = ref<boolean>(false);

// Filtres
const filterType = ref('');
const filterBrand = ref('');
const searchQuery = ref('');

// Données
const formData = ref<Equipment>(equipmentFormData());
const viewedEquipment = ref<Equipment>(equipmentFormData());
const selectedPhoto = ref('');
const equipmentToDelete = ref<Equipment | null>(null);
const showNetworkFields = ref(false);
const photoInput = ref(null);

// Propriétés calculées
const filteredEquipments = computed(() => {
	return equipments.value.filter(equipment => {
		const matchesType = filterType.value ? equipment.type === filterType.value : true;
		const matchesBrand = filterBrand.value ? equipment.brand === filterBrand.value : true;
		const matchesSearch = searchQuery.value ?
			Object.values(equipment).some(value =>
				value && value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
			) : true;

		return matchesType && matchesBrand && matchesSearch;
	});
});

const paginatedEquipments = computed(() => {
	return filteredEquipments.value.slice(range.start - 1, range.end)
});

const equipmentsCount = computed(() => equipments.value?.length || 0);
const networkCount = computed(() => equipments.value?.filter(e => e.type === 'Réseau').length || 0);
const nonNetworkCount = computed(() => equipments.value?.filter(e => e.type === 'Non réseau').length || 0);

const uniqueBrands = computed(() => {
	const brands = [...new Set(equipments.value?.map(e => e.brand).filter(Boolean) || [])];
	return brands.sort();
});


// Pagination
const range = reactive({ start: 0, end: 0 })

const onRangeChanged = ({ start, end }: { start: number, end: number }) => {
	range.start = start;
	range.end = end;
};

// Méthodes
const openAddModal = () => {
	resetForm();
	isEditing.value = false;
	showModal.value = true;
};

const editEquipment = (equipment: Equipment) => {
	formData.value = {
		...equipment,
		photo: null,
		photoPreview: equipment.photo ? equipment.photo : ''
	};
	isEditing.value = true;
	showNetworkFields.value = equipment.type === 'Réseau';
	showModal.value = true;
};

const viewEquipment = (equipment: Equipment) => {
	viewedEquipment.value = equipment;
	showViewModal.value = true;
};

const confirmDelete = (equipment: Equipment) => {

	Swal.fire({
		title: 'Supprimer le client ?',
		html: `Êtes-vous sûr de vouloir supprimer l'équipement <b>${equipment.type}</b> <b>${equipment.brand}</b> <b>${equipment.model}</b> <b>${equipment.serial_number}</b> ?`,
		icon: 'question',
		showCancelButton: true,
		cancelButtonText: 'Annuler',
		cancelButtonColor: '#3085d6',
		confirmButtonColor: '#d33',
		confirmButtonText: 'Oui, supprimer !'
	}).then(async result => {
		if (result.isConfirmed) {
			try {
				await EquipmentStore.deleteEquipment(equipment.id)
				Swal.fire({ icon: 'success', title: 'Succès', text: 'Client supprimé avec succès', showConfirmButton: false });
				equipmentToDelete.value = null;
				await EquipmentStore.fetchEquipments()
			} catch (error) {
				Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer le client' })
			}
		}
	});
};

const closeModal = () => {
	showModal.value = false;
	resetForm();
};

const closePhotoModal = () => {
	showPhotoModal.value = false;
};

const resetForm = () => {
	formData.value = equipmentFormData();
	showNetworkFields.value = false;
};

const toggleNetworkFields = () => {
	showNetworkFields.value = formData.value.type === 'Réseau';
};

const handlePhotoUpload = (event) => {
	const file = event.target.files[0];
	if (file) {
		formData.value.photo = file;
		const reader = new FileReader();
		reader.onload = (e) => {
			formData.value.photoPreview = e.target.result;
		};
		reader.readAsDataURL(file);
	}
};

const removePhoto = () => {
	formData.value.photoPreview = '';
	formData.value.photo = null;
	if (photoInput.value) {
		photoInput.value.value = '';
	}
};

const openPhotoModal = (photoUrl: string) => {
	selectedPhoto.value = photoUrl;
	showPhotoModal.value = true;
};

const buildFormData = () => {
	const data = new FormData();
	data.append("type", formData.value.type);
	data.append("brand", formData.value.brand);
	data.append("manufacturer", formData.value.manufacturer);
	data.append("model", formData.value.model);
	data.append("serial_number", formData.value.serial_number);
	data.append("diagnostic_price", formData.value.diagnostic_price || '');
	data.append("name", formData.value.name);
	data.append("role", formData.value.role);
	data.append("mac_address", formData.value.mac_address);
	data.append("ip_address", formData.value.ip_address);
	data.append("characteristics", formData.value.characteristics);
	data.append("company_name", formData.value.company_name);
	data.append("company_address", formData.value.company_address);
	data.append("company_zipCode", formData.value.company_zipCode);
	data.append("company_city", formData.value.company_city);
	data.append("comment", formData.value.comment);

	if (formData.value.photo instanceof File) {
		data.append("photo", formData.value.photo);
	}

	if (isEditing.value) {
		data.append('_method', 'PUT');
	}

	return data;
};

const submitForm = async () => {
	try {
		const data = buildFormData();
		isSaving.value = true;

		if (isEditing.value) {
			await EquipmentStore.updateEquipment(formData.value.id, data);
		} else {
			await EquipmentStore.addEquipment(data);
		}
		closeModal();
	} catch (err) {
		console.error("Erreur lors de l'enregistrement :", err);
	} finally {
		isSaving.value = false;
	}
};

const resetFilters = () => {
	filterType.value = '';
	filterBrand.value = '';
	searchQuery.value = '';
};

onMounted(() => {
	EquipmentStore.fetchEquipments();
});
</script>
