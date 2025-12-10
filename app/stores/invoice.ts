import { defineStore } from "pinia";
import type { Invoice } from "~/models/Invoice";

export const useInvoiceStore = defineStore('facture', {
	state: () => ({
		invoices: [] as Invoice[],
		isLoading: false
	}),
	actions: {
		async addInvoice(payload: any) {
			try {
				const { data } = await useApi().post<Invoice>(ApiUrl.INVOICES, payload);
				this.invoices.push(data);
				useAlert().showAlert("Facture ajoutée avec succès", "success");
			} catch (error) {
				console.error("Erreur lors de l'enregistrement", error);
			}
		},
		async fetchInvoice() {
			try {
				if (this.invoices.length === 0) this.isLoading = true;
				const { data } = await useApi().get<Invoice[]>(ApiUrl.INVOICES);
				this.invoices = data;
			} catch (error) {
				console.log("Error fetching technicians:", error);
				useAlert().showAlert("Une erreur est survenue lors de la récupération des techniciens", "error");
			} finally {
				this.isLoading = false;
			}
		},
		async downloadInvoice(invoice: Invoice) {
			try {
				window.open(`http://127.0.0.1:8000/api/invoice/download/${invoice.id}`, '_blank')
				//   const res=await fetch(`http://127.0.0.1:8000/api/invoice/download/${invoice.id}`)
				//   const blob =await res.blob()
				//   const urlBlob=window.URL.createObjectURL(blob)
				//   const a = document.createElement('a')
				//   a.href=urlBlob
				//   a.download=`invoice_${invoice.id}.pdf`
				//   a.click()
				//   window.URL.revokeObjectURL(urlBlob)

			} catch (error) {
				console.error("Erreur lors du téléchargement de la facture")

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
