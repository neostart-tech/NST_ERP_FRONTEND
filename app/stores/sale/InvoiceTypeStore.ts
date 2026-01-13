import { defineStore } from "pinia";
import type { invoiceType } from "~/models/Invoice";

export const useInvoiceTypeStore = defineStore("InvoiceTypeStore", {
	state: () => ({
		invoiceTypes: [] as invoiceType[],
		isLoading: false,
	}),

	actions: {
		async fetchAll() {
			try {
				if (this.invoiceTypes.length === 0) this.isLoading = true;
				const { data } = await useApi().get<invoiceType[]>(
					ApiUrl.INVOICE_TYPES
				);
				this.invoiceTypes = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		// async store(payload: any) {
		// 	try {
		// 		const { data } = await useApi().post<invoiceType>(ApiUrl.INVOICES, payload);
		// 		this.invoiceTypes.push(data);
		// 	} catch (error) {
		// 		console.error("Erreur lors de l'enregistrement", error);
		// 		throw error;
		// 	}
		// },
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: "invoice-type-store",
		// Optionnel : choisir quelles propriétés persister
		pick: ["invoice-type"],
	},
});
