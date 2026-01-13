import { defineStore } from "pinia";
import type { Invoice } from "~/models/Invoice";

export const useInvoiceStore = defineStore('InvoiceStore', {
	state: () => ({
		invoices: [] as Invoice[],
		isLoading: false
	}),

	actions: {
		async fetchAll() {
			try {
				if (this.invoices.length === 0) this.isLoading = true;
				const { data } = await useApi().get<Invoice[]>(ApiUrl.INVOICES);
				this.invoices = data;
			} catch (error) {
				console.log("Error fetching technicians:", error);
				useAlert().showAlert("Une erreur est survenue lors de la récupération de la facture", "error");
			} finally {
				this.isLoading = false;
			}
		},

		async store(payload: any) {
			try {
				const { data } = await useApi().post<Invoice>(ApiUrl.INVOICES, payload);
				this.invoices.push(data);
			} catch (error) {
				console.error("Erreur lors de l'enregistrement", error);
				throw error;
			}
		},

		async delete(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.INVOICE_BY_ID, id));
				this.invoices = this.invoices.filter((invoice) => invoice.id !== id);
				this.fetchAll();
			} catch (error) {
				console.error("Erreur lors de la suppression", error);
				throw error;
			}
		}
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: 'invoice-store',
		// Optionnel : choisir quelles propriétés persister
		pick: ['invoices']
	}
});
