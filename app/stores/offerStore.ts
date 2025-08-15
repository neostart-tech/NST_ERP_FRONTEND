import { defineStore } from "pinia";
import type { Entreprise } from "~/models/Enterprise";
import type { Offer, OfferForm, MetadataForm } from "~/models/Offer";

export const useOfferStore = defineStore("OfferStore", {
  state: () => ({
    offers: [] as Offer[],
    // offer: {} as Offer,
    validationErrors: {} as ValidationErrors,
    isLoading: true
  }),
  actions: {
    async fetchOffers() {
      try {
        console.log("Fetching offers from API...");
        const response = await useApi().get<Offer[]>("/offers");
        console.log("API Response:", response);
        this.offers = response.data || [];
        console.log("Offers after update:", this.offers);
      } catch (error) {
        console.error("Error fetching offers:", error);
        useAlert().showAlert("Une erreur est survenue lors du chargement des appels d'offres", "error");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async storeOffer(offerData: OfferForm, metadata: MetadataForm, enterprise: Entreprise) {
      try {
        const formData = {
          ...offerData,
          ...metadata,
          offer_type_id: offerData.offer_type,
          enterprise_id: enterprise.id
        };
        console.log("formData:", formData)
        const { data } = await useApi().post<Offer>(ApiUrl.OFFERS, formData);
        this.offers = [data, ...this.offers];
      } catch (error) {
        console.log("Error storing offer:", error);
        useAlert().showAlert("Une erreur est survenue", "error");
        this.validationErrors = useValidationErrors(error);
        throw error;
      }
    }
  }
});