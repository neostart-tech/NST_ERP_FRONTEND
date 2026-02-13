<template>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<div class="sm:flex sm:items-center sm:justify-between mb-6">
			<!--			<h1 class="text-2xl font-bold text-gray-900">Gestion des types de documents</h1>-->
			<div class="mt-4 sm:mt-0 sm:ml-4 flex items-end gap-3">
				<div class="relative">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400"/>
					</div>
					<input v-model="searchQuery" type="text" placeholder="Rechercher..."
								 class="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
				</div>
				<button @click="openCreate"
								class="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg shadow-md">
					<Icon name="heroicons:plus" class="h-4 w-4 mr-2"/>
					Ajouter
				</button>
			</div>
		</div>

		<Loader v-if="isLoading" message="Chargement des types de document..."/>

		<EmptyState v-else-if="filtered.length === 0" title="Aucun type de document"
								:description="'Aucun type trouvé.'"
								icon="heroicons:document-text" iconColor="text-indigo-400"
								@reload="loadDocuments" :isLoading="isLoading" :searchQuery="searchQuery"
		/>

		<div v-else class="mt-4">
			<!-- Table: visible sur écrans >= lg -->
			<DocumentTypeListView
				:confirm-delete="confirmDelete" :edit="edit" :filtered="filtered"
				:readable-status="readableStatus" :toggle-availability="toggleAvailability"
			/>

			<!-- Cards: visible sur écrans < lg -->
			<DocumentTypeCardView
				:confirm-delete="confirmDelete" :edit="edit" :filtered="filtered"
				:readable-status="readableStatus" :toggle-availability="toggleAvailability"
			/>
		</div>

		<!-- Modal create / edit -->
		<div v-if="showFormModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg p-6 max-w-lg w-full">
				<h2 class="text-lg font-semibold mb-4">{{ isEditing ? 'Modifier' : 'Ajouter' }} un type de document</h2>
				<form @submit.prevent="submitForm" class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700">Nom</label>
						<input v-model="form.name" type="text" class="mt-1 block w-full border rounded-md px-3 py-2"/>
						<p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name[0] }}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Description</label>
						<textarea v-model="form.description" class="mt-1 block w-full border rounded-md px-3 py-2" rows="3"/>
						<p v-if="errors.description" class="text-sm text-red-600 mt-1">{{ errors.description[0] }}</p>
					</div>
					<div class="flex items-center gap-3">
						<input id="available" type="checkbox" v-model="form.isAvailable" class="h-4 w-4"/>
						<label for="available" class="text-sm text-gray-700">Disponible</label>
					</div>
					<div class="flex items-center gap-3">
						<input id="required" type="checkbox" v-model="form.required" class="h-4 w-4"/>
						<label for="required" class="text-sm text-gray-700">Obligatoire</label>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Statut</label>
						<select v-model="form.status" class="mt-1 block w-full border rounded-md px-3 py-2">
							<option :value="DocumentStatus.AVAILABLE">Disponible</option>
							<option :value="DocumentStatus.MISSING">Manquant</option>
							<option :value="DocumentStatus.IN_PROGRESS">En cours</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700">Image</label>
						<div v-if="imagePreview || (isEditing && form.file?.path)" class="mt-2 mb-2">
							<img
								:src="imagePreview ?? storageUrl(form.file!.path)"
								alt="Aperçu"
								class="h-32 w-32 object-cover rounded-lg border border-gray-200"
							/>
						</div>
						<input type="file" accept="image/*" @change="onFileChange" class="mt-1 block w-full text-sm text-gray-500
							file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
							file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
							hover:file:bg-blue-100"/>
						<p v-if="errors.file" class="text-sm text-red-600 mt-1">{{ errors.file[0] }}</p>
					</div>
					<div class="flex justify-end gap-3 mt-4">
						<button type="button" @click="closeForm" class="px-4 py-2 rounded-md border">Annuler</button>
						<button type="submit" class="px-4 py-2 rounded-md bg-blue-600 text-white" :disabled="isSaving">
							<span v-if="isSaving">Enregistrement...</span>
							<span v-else>Enregistrer</span>
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Modal delete -->
		<div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div class="bg-white rounded-lg p-6 max-w-md w-full">
				<h3 class="text-lg font-semibold mb-4">Confirmer la suppression</h3>
				<p class="text-sm text-gray-600 mb-4">Voulez-vous vraiment supprimer <strong>{{
						currentToDelete?.name
					}}</strong> ?</p>
				<div class="flex justify-end gap-3">
					<button @click="showDeleteModal = false" class="px-4 py-2 rounded-md border">Annuler</button>
					<button @click="deleteConfirmed" class="px-4 py-2 rounded-md bg-red-600 text-white" :disabled="isSaving">
						<span v-if="isSaving">Suppression...</span>
						<span v-else>Supprimer</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import EmptyState from "@/components/EmptyState.vue";
import {computed, onMounted, reactive, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useDocumentTypeStore} from '@/stores/DocumentTypeStore';
import type {DocumentType} from '~/models/DocumentType';
import {DocumentStatusEnum} from '~/models/DocumentType';
import Loader from "@/components/Loader.vue";
import Swal from "sweetalert2";
import DocumentTypeCardView from "@/components/DocumentTypes/DocumentTypeCardView.vue";
import DocumentTypeListView from "@/components/DocumentTypes/DocumentTypeListView.vue";

useHead({title: "Gestion des types de documents"});

// alias exposé au template
const DocumentStatus = DocumentStatusEnum;

const documentTypeStore = useDocumentTypeStore();
const {documentTypes, isLoading, isSaving, validationErrors} = storeToRefs(documentTypeStore);

const searchQuery = ref('');
const showFormModal = ref(false);
const isEditing = ref(false);
const showDeleteModal = ref(false);
const currentToDelete = ref<DocumentType | null>(null);

const form = reactive<DocumentType & { file?: any }>({
	id: '',
	name: '',
	description: '',
	isAvailable: true,
	required: false,
	status: DocumentStatus.AVAILABLE,
	file: null,
});

const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const storageUrl = (path: string) => {
	const base = import.meta.env.VITE_API_URL_BASE || 'http://localhost:8000';
	return `${base}/storage/${path}`;
};

const onFileChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0] ?? null;
	selectedFile.value = file;
	if (file) {
		imagePreview.value = URL.createObjectURL(file);
	} else {
		imagePreview.value = null;
	}
};

const errors = reactive<Record<string, string[]>>({});

const openCreate = () => {
	isEditing.value = false;
	form.id = '';
	form.name = '';
	form.description = '';
	form.isAvailable = true;
	form.required = false;
	form.status = DocumentStatus.AVAILABLE;
	form.file = null;
	selectedFile.value = null;
	imagePreview.value = null;
	Object.keys(errors).forEach(k => delete errors[k]);
	showFormModal.value = true;
};

const edit = (dt: DocumentType) => {
	isEditing.value = true;
	form.id = dt.id;
	form.name = dt.name;
	form.description = dt.description ?? '';
	form.isAvailable = dt.isAvailable;
	form.required = dt.required;
	form.status = dt.status ?? DocumentStatus.AVAILABLE;
	form.file = dt.file ?? null;
	selectedFile.value = null;
	imagePreview.value = null;
	Object.keys(errors).forEach(k => delete errors[k]);
	showFormModal.value = true;
};

const closeForm = () => {
	showFormModal.value = false;
};

const submitForm = async () => {
	Object.assign(errors, {});
	try {
		if (isEditing.value) {
			await documentTypeStore.update({...form}, selectedFile.value);
			useAlert().showAlert("Type de document modifié", "success");
		} else {
			const payload = {...form, id: ''}; // id server-generated
			await documentTypeStore.store(payload as DocumentType, selectedFile.value);
			useAlert().showAlert("Type de document créé", "success");
		}
		showFormModal.value = false;
		selectedFile.value = null;
		imagePreview.value = null;
	} catch (e: any) {
		// récupérer erreurs de validation depuis le store si présentes
		if (validationErrors.value && Object.keys(validationErrors.value).length > 0) {
			Object.assign(errors, validationErrors.value as unknown as Record<string, string[]>);
		} else if (e?.response?.data?.errors) {
			Object.assign(errors, e.response.data.errors);
		} else {
			useAlert().showAlert("Une erreur est survenue", "error");
		}
	} finally {
		// isSaving géré par le store
	}
};

const confirmDelete = (dt: DocumentType) => {
	currentToDelete.value = dt;
	showDeleteModal.value = true;
};

const deleteConfirmed = async () => {
	if (!currentToDelete.value) return;
	try {
		await documentTypeStore.delete(currentToDelete.value.id);
		useAlert().showAlert("Type supprimé", "success");
		showDeleteModal.value = false;
		currentToDelete.value = null;
	} catch (e) {
		useAlert().showAlert("Erreur lors de la suppression", "error");
	} finally {
		// isSaving géré par store
	}
};

const toggleAvailability = async (id: string) => {
	try {
		await documentTypeStore.changeAvailability(id);
		useAlert().showAlert("Disponibilité modifiée", "success");
	} catch (e) {
		// erreur gérée dans le store
	}
};

const filtered = computed(() => {
	if (!searchQuery.value) return documentTypes.value;
	const q = searchQuery.value.toLowerCase();
	return documentTypes.value.filter(dt =>
		(dt.name || '').toLowerCase().includes(q) ||
		(dt.description || '').toLowerCase().includes(q)
	);
});

const readableStatus = (s?: string) => {
	const status = s ?? DocumentStatus.AVAILABLE;
	switch (status) {
		case DocumentStatus.AVAILABLE:
			return 'Disponible';
		case DocumentStatus.MISSING:
			return 'Manquant';
		case DocumentStatus.IN_PROGRESS:
			return 'En cours';
		default:
			return String(status);
	}
};

const loadDocuments = async () => {
	try {
		await documentTypeStore.fetchAll();
	} catch (e) {
		useAlert().showAlert("Erreur lors du chargement des types de document", "error");
		Swal.fire({
			icon: "error",
			text: "Erreur lors du chargement des types de document"
		})
	}
};

onMounted(async () => {
	await loadDocuments();
});
</script>
