import type {ModePayment} from "~/models/ModePayment";
import {defineStore} from "pinia";

export const useModePaymentStore = defineStore('ModePaymentStore', {
	state: () => ({
		modePayments: [] as ModePayment[],
		isLoading: false,
		isSaving: false,
		validationErrors: {} as ValidationErrors,
	}),
	actions: {

		async fetchAll() {
			this.isLoading = true;
			try {
				const {data} = await useApi().get<ModePayment[]>(ApiUrl.MODE_PAYMENTS);
				this.modePayments = data;
			} catch (error) {
				useAlert().showAlert("Une erreur est survenue lors de la récupération des modes de paiement", "error");
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		cleanStorage() {
			this.modePayments = [];
			this.validationErrors = {};
			this.isLoading = false;
			this.isSaving = false;
			localStorage.removeItem('mode-payment-store');
		}
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: 'mode-payment-store',
		// Optionnel : choisir quelles propriétés persister
		pick: ['modePayments']
	}
});
