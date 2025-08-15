import { defineStore } from "pinia";
import type { Entreprise } from "~/models/Enterprise";
import { ApiUrl } from "@/composables/apiUrl";

export const useEnterpriseStore = defineStore("EnterpriseStore", {
  state: () => ({
    enterprises: [] as Entreprise[],
  }),
  actions: {
    async fetchEnterprises() {
      try {
        const response = await useApi().get<Entreprise[]>(ApiUrl.ENTREPRISES);
        this.enterprises = response.data;
      } catch (error) {
        console.log("Error fetching enterprise:", error);
        useAlert().showAlert("Une erreur est survenue lors de la récupération des entreprises", "error");
      }
    },
  },
});
