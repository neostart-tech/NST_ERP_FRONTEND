import type { Product } from "~/models/Product";

export const useProductStore = defineStore("ProductStore", {
	state: () => ({
		products: [] as Product[],
		isLoading: false,
		validationErrors: {} as ValidationErrors
	}),

	actions: {
		async fetchAll() {
			try {
				if (this.products.length == 0) {
					this.isLoading = true;
				}
				const { data } = await useApi().get<Product[]>(ApiUrl.PRODUCTS);
				this.products = data;
			} catch (error) {
				console.error("Erreur lors du chargement des produits:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		cleanStorage() {
			this.products = [];
			this.validationErrors = {};
			this.isLoading = false;
		},
	},

	// Configuration de la persistance
	persist: {
		storage: secureLsStorage,
		// Optionnel : personnaliser la clé de stockage
		key: 'product-store',
		// Optionnel : choisir quelles propriétés persister
		pick: ['products']
	}
});
