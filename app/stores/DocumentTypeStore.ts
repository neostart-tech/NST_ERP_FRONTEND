import {defineStore} from "pinia";
import {DocumentStatusEnum, type DocumentType} from "~/models/DocumentType";
import {ApiUrl} from "@/composables/apiUrl";
import {useValidationErrors} from "@/composables/useValidationErrors";

export const useDocumentTypeStore = defineStore("DocumentTypeStore", {
	state: () => ({
		documentTypes: [] as DocumentType[],
		validationErrors: {} as ValidationErrors,
		isLoading: false,
		isSaving: false,
	}),
	actions: {
		async fetchAll() {
			this.isLoading = true;
			try {
				const response = await useApi().get<DocumentType[]>(
					ApiUrl.DOCUMENT_TYPES
				);
				this.documentTypes = response.data;
			} catch (error) {
				useAlert().showAlert(
					"Une erreur est survenue lors de la récupération des types de document",
					"error",
				);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async fetchOnlyAvailable() {
			this.isLoading = true;
			try {
				const response = await useApi().get<DocumentType[]>(
					ApiUrl.queryable(
						ApiUrl.DOCUMENT_TYPES,
						{"status": DocumentStatusEnum.AVAILABLE}
					),
				);
				this.documentTypes = response.data;
			} catch (error) {
				useAlert().showAlert(
					"Une erreur est survenue lors de la récupération des types de document",
					"error",
				);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(documentType: DocumentType, file?: File | null) {
			this.isSaving = true;
			try {
				const formData = new FormData();
				formData.append('name', documentType.name);
				formData.append('description', documentType.description ?? '');
				formData.append('isAvailable', documentType.isAvailable ? '1' : '0');
				formData.append('required', documentType.required ? '1' : '0');
				formData.append('status', documentType.status);
				if (file) {
					formData.append('file', file);
				}

				const {data} = await useApi().post<DocumentType>(
					ApiUrl.DOCUMENT_TYPES,
					formData,
				);
				this.documentTypes = [data, ...this.documentTypes];
				this.validationErrors = {};
			} catch (error) {
				useAlert().showAlert(
					"Une erreur est survenue lors de la création du type de document",
					"error",
				);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		// Mise à jour d'un type de document
		async update(documentType: DocumentType, file?: File | null) {
			this.isSaving = true;
			try {
				const formData = new FormData();
				formData.append('name', documentType.name);
				formData.append('description', documentType.description ?? '');
				formData.append('isAvailable', documentType.isAvailable ? '1' : '0');
				formData.append('required', documentType.required ? '1' : '0');
				formData.append('status', documentType.status);
				formData.append('_method', 'PUT');
				if (file) {
					formData.append('file', file);
				}

				const {data} = await useApi().post<DocumentType>(
					ApiUrl.parameterized(ApiUrl.DOCUMENT_TYPES_BY_ID, documentType.id),
					formData,
				);
				this.documentTypes = this.documentTypes.map((_) =>
					_.id === data.id ? data : _,
				);
				this.validationErrors = {};
			} catch (error) {
				useAlert().showAlert(
					"Une erreur est survenue lors de la modification du type de document",
					"error",
				);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		async changeAvailability(id: string) {
			this.isSaving = true;
			try {
				const {data} = await useApi().patch<DocumentType>(
					ApiUrl.parameterized(ApiUrl.DOCUMENT_TYPES_BY_ID, id),
					null,
				);

				this.documentTypes = this.documentTypes.map((_) =>
					_.id === id ? data : _,
				);
			} catch (error) {
				useAlert().showAlert(
					"Une erreur est survenue lors de la modification du type de document",
					"error",
				);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		async delete(id: string) {
			this.isSaving = true;
			try {
				await useApi().del<void>(
					ApiUrl.parameterized(ApiUrl.DOCUMENT_TYPES_BY_ID, id),
				);

				this.documentTypes = this.documentTypes.filter((_) => _.id !== id);
			} catch (error) {
				useAlert().showAlert(
					"Une erreur est survenue lors de la suppression du type de document",
					"error",
				);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},
	},
});
