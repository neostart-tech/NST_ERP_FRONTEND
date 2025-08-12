import {defineStore} from "pinia";
import type { Offer, OfferForm, MetadataForm } from "~/models/Offer";

export const useOfferStore = defineStore("OfferStore", {
  state: () => ({
    offers: [] as Offer[], 
    // offer: {} as Offer,
    // validationErrors: {} as ValidationErrors,
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

    async storeOffer(offerData: OfferForm, metadata: MetadataForm) {
      try {
        const { data } = await useApi().post<Offer>("/offers", {offer: offerData, metadata: metadata});
        this.offers = [data, ...this.offers];
      } catch (error) {
        useAlert().showAlert("Une erreur est survenue", "error");
        throw error;
      }
    }
  }
});