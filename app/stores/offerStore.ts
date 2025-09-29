import { defineStore } from "pinia";
import type { Entreprise } from "~/models/Enterprise";
import type { Offer, OfferForm, MetadataForm } from "~/models/Offer";
import { extractDateTime } from "../utils/dateParser";

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
        let { data } = await useApi().get<Offer>(ApiUrl.parameterize(ApiUrl.OFFER_BY_ID, id));
				data.publication_date = extractTime(data.publication_date);
				data.submission_deadline = extractDateTime(data.submission_deadline);
				data.file_obtaining_deadline = extractTime(data.file_obtaining_deadline);
				data.offer_opening_date = extractTime(data.offer_opening_date);
				console.log(data);
        return data;
      } catch (error) {
        console.error("Error fetching offer:", error);
        throw error;
      }
    },

    async appreciateOffer(id: string, appreciation: "yes" | "no") {
      try {
        const response = await useApi().post<Offer>(
          `/offers/${id}/appreciate`,
          { appreciation }
        );
        this.offers = this.offers.map((offer) =>
          offer.id === id ? response.data : offer
        );
        return response.data;
      } catch (error) {
        console.error("Error appreciating offer:", error);
        throw error;
      }
    },

    async updateOfferDecision(id: string, decisionData: {
      decision: 'yes' | 'no' | null;
      submissionMotif?: string;
      refusalMotif?: string;
    }) {
      try {
        const response = await useApi().put<Offer>(`/offers/${id}/decision`, decisionData);
        this.offers = this.offers.map(offer =>
          offer.id === id ? { ...offer, ...response.data } : offer
        );
        return response.data;
      } catch (error) {
        console.error('Error updating offer decision:', error);
        throw error;
      }
    },

    async updateOffer(id: string, data: Partial<Offer>) {
      try {
        const response = await useApi().put<Offer>(`/offers/${id}`, data);
        this.offers = this.offers.map(offer =>
          offer.id === id ? { ...offer, ...response.data } : offer
        );
        return response.data;
      } catch (error) {
        console.error('Error updating offer:', error);
        throw error;
      }
    },

    async deleteOffer(id: string) {
      try {
        await useApi().request({
          method: 'DELETE',
          url: `/offers/${id}`
        });
        this.offers = this.offers.filter(offer => offer.id !== id);
        return true;
      } catch (error) {
        console.error('Error deleting offer:', error);
        throw error;
      }
    },

    async saveDecision(id: string, decisionData: {
      decision: 'yes' | 'no' | null;
      submissionMotif?: string;
      refusalMotif?: string;
    }) {
      try {
        const response = await useApi().put<Offer>(`/offers/${id}/decision`, decisionData);
        this.offers = this.offers.map(offer =>
          offer.id === id ? { ...offer, ...response.data } : offer
        );
        return response.data;
      } catch (error) {
        console.error('Error saving decision:', error);
        throw error;
      }
    },
  }
});
