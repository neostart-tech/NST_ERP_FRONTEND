import { defineStore } from "pinia";
import type { Lot } from "~/models/Offer";
import { ApiUrl } from "@/composables/apiUrl";
import type { ValidationErrors } from "@/composables/useValidationErrors";

export const useLotStore = defineStore("LotStore", {
	state: () => ({
		validationErrors: {} as ValidationErrors,
		isLoading: true
	}),
	actions: {
		async fetchLots(offerId: string) {
			try {
				// Vérifier que l'offerId est valide
				if (!offerId) {
					throw new Error('ID de l\'offre non valide');
				}

				console.log('Fetching lots for offer:', offerId);
				const apiUrl = ApiUrl.parameterized(ApiUrl.OFFER_LOTS, offerId);
				console.log('API URL:', apiUrl);

				const { data } = await useApi().get<Lot[]>(apiUrl);
				console.log('Lots data received:', data);
				return data.map(_ => ({ ..._, isNew: false }));
			} catch (error) {
				console.error("Error fetching lots:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async configureLots(offerId: string, lots: Lot[]) {
			try {
				const { data } = await useApi().put<Lot[]>(
					ApiUrl.parameterized(ApiUrl.OFFER_LOTS, offerId),
					{ lots }
				);
				return data.map(_ => ({ ..._, isNew: false }));
			} catch (error) {
				console.error('Error configuring lots:', error);
				throw error;
			}
			// TODO: Checker les suppression des nouveaux et anciens lots
		},

		async deleteLot(lotId: string) {
			try {
				await useApi().del(ApiUrl.parameterized(
					ApiUrl.OFFER_LOTS,
					lotId
				));
				return true;
			} catch (error) {
				console.error('Error deleting lot:', error);
				throw error;
			}
		}
	}
});
