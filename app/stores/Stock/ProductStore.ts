import type { Product } from "~/models/Product";

export const useProductStore = defineStore("ProductStore", {
	state: () => ({
		products: [] as Product[],
		isLoading: false,
	}),

	actions: {
		async fetchAll() {
			try {
				this.isLoading = true;
				const { data } = await useApi().get<Product[]>(ApiUrl.PRODUCTS);
				this.products = data;
			} catch (error) {
				console.error("Erreur lors du chargement des produits:", error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},
	},
});
