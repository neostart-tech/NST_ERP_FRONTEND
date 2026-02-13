import { type Quote } from "~/models/Quote";
import { type ValidationErrors, useValidationErrors } from "@/composables/useValidationErrors";

export const useQuoteStore = defineStore("QuoteStore", {
	state: () => ({
		quotes: [] as Quote[],
		isLoading: true,
		isSaving: false,
		errors: {} as ValidationErrors
	}),

	actions: {
		async fetchAll() {
			try {
				this.isLoading = true;
				const { data } = await useApi().get<Quote[]>(ApiUrl.QUOTES);
				this.quotes = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(quote: Quote) {
			console.log("Called:", quote);
			
			this.isSaving = false;
			try {
				const { data } = await useApi().post<Quote>(ApiUrl.QUOTES, {
					...quote,
					// client_id: quote.client.id,
				});
				this.quotes.push(data);
			} catch (error) {
				this.errors = useValidationErrors(error);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},
	},
});
