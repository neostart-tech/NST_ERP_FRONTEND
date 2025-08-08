import { defineStore } from "pinia";
import type { Entreprise } from "~/models/Entreprise";
import { ApiUrl } from "@/composables/apiUrl";

export const entrepriseStore = defineStore("EntrepriseStore", {
  state: () => ({
    entreprises: [] as Entreprise[],
  }),
  actions: {
    async fetchEntreprises() {
      try {
        const response = await useApi().get<Entreprise[]>(ApiUrl.ENTREPRISES);
        this.entreprises = response.data;
      } catch (error) {
        useAlert().showAlert("Une erreur est survenue lors de la récupération des entreprises", "error");
      }
    },
  },
});