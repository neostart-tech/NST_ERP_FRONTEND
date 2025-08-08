import { defineStore } from "pinia";
import type { DocumentType } from "~/models/DoucementType";
import { ApiUrl } from "~/composables/apiUrl";

export const documentTypeStore = defineStore("DocumentTypeStore", {
  state: () => ({
    documentTypes: [] as DocumentType[],
  }),
  actions: {
    async fetchDocumentTypes() {
      try {
        const response = await useApi().get<DocumentType[]>(ApiUrl.DOCUMENT_TYPES);
        this.documentTypes = response.data;
      } catch (error) {
        useAlert().showAlert("Une erreur est survenue lors de la récupération des types de document", "error");
      }
    },
  },
});