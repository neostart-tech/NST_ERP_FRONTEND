import { defineStore } from "pinia";
import type { Entreprise } from "~/models/Enterprise";
import type { Offer, OfferForm, MetadataForm } from "~/models/Offer";

export const useOfferStore = defineStore("OfferStore", {
  state: () => ({
    offers: [] as Offer[],
    pendingOffers: [] as Offer[],

    // offer: {} as Offer,
    validationErrors: {} as ValidationErrors,
    isLoading: true
  }),
  actions: {
    async fetchOffers() {
      try {
        const response = await useApi().get<Offer[]>("/offers");
        this.offers = response.data || [];
      } catch (error) {
        console.error("Error fetching offers:", error);
        useAlert().showAlert("Une erreur est survenue lors du chargement des appels d'offres", "error");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPendingOffers() {
      try {
        const response = await useApi().get<Offer[]>(ApiUrl.OFFERS);
        this.offers = response.data || [];
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
        const formData = {
          ...offerData,
          ...metadata,
          offer_type_id: offerData.offer_type
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
    },

    async getOneOffer(id: string) {
      try {
        const { data } = await useApi().get<Offer>(ApiUrl.parameterize(ApiUrl.OFFER_BY_ID, id));
        return data;
      } catch (error) {
        console.error("Error fetching offer:", error);
        throw error;
      }
    }

  }
});