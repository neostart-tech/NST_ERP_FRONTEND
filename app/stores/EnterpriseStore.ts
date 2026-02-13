import { defineStore } from "pinia";
import type { EnterpriseForm, Entreprise } from "~/models/Enterprise";
import { ApiUrl } from "@/composables/apiUrl";
import { useValidationErrors, type ValidationErrors } from "@/composables/useValidationErrors";
import { useApi } from "#imports";

const PERSISTANCE_KEY = "entreprises-store";

export const useEnterpriseStore = defineStore("EnterpriseStore", {
  state: () => ({
    enterprises: [] as Entreprise[],
    isLoading: true,
    validationErrors: {} as ValidationErrors,
  }),
  actions: {
    async fetchAll() {
      try {
        const { data } = await useApi().get<Entreprise[]>(ApiUrl.ENTREPRISES);
        this.enterprises = data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async saveEnterprise(enterprise: EnterpriseForm) {
      this.isLoading = true;
      this.validationErrors = {};
      try {
        let { data } = await useApi().post<Entreprise>(ApiUrl.ENTREPRISES, enterprise);
        data = { ...data, offersCount: 0 };
        this.enterprises = [data, ...this.enterprises];
      } catch (error) {
        this.validationErrors = useValidationErrors(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteEnterprise(entrepriseId: string) {
      try {
        await useApi().del(ApiUrl.parameterized(ApiUrl.ENTREPRISE_BY_ID, entrepriseId));
        this.enterprises = this.enterprises.filter(_ => _.id !== entrepriseId);
      } catch (error) {
        throw error;
      }
    },

    async getOneEntreprise(entrepriseId: string) {
      this.isLoading = true;
      try {
        const { data } = await useApi().get<Entreprise>(ApiUrl.parameterized(ApiUrl.ENTREPRISE_BY_ID, entrepriseId));
        return data;
      } catch (error) {
        this.validationErrors = useValidationErrors(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateEntreprise(entrepriseId: string, enterpriseFormData: EnterpriseForm) {
      this.isLoading = true;
      this.validationErrors = {};
      try {
        const { data } = await useApi().put<Entreprise>(
          ApiUrl.parameterized(ApiUrl.ENTREPRISE_BY_ID, entrepriseId),
          enterpriseFormData
        );
        this.enterprises = this.enterprises.map(_ => _.id === entrepriseId ? data : _);
        return data;
      } catch (error) {
        this.validationErrors = useValidationErrors(error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    cleanStorage() {
      this.enterprises = [];
      this.isLoading = true;
      this.validationErrors = {};
    }
  },

  // Configuration de la persistance
  persist: {
    storage: persistedState.cookies,
    // Optionnel : personnaliser la clé de stockage
    key: PERSISTANCE_KEY,
    // Optionnel : choisir quelles propriétés persister
    pick: ['enterprises']
  }
});
