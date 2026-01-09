import { defineStore } from "pinia";
import type { Order } from "~/models/Invoice";
import { type ProformaOrder } from "~/models/Order";

export const useOrderStore = defineStore("OrderStore", {
	state: () => ({
		orders: [] as Order[],
		isLoading: false,
		isSaving: false,
		validationErrors: {} as ValidationErrors,
	}),
	actions: {
		async fetchAll() {
			try {
				if (this.orders.length === 0) {
					this.isLoading = true;
				}
				const { data } = await useApi().get<Order[]>(ApiUrl.ORDERS);
				this.orders = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async fetchValidatedOrders(status?: "pending" | "delivered" | "canceled") {
			status = status || "pending";
			try {
				if (this.orders.length === 0) {
					this.isLoading = true;
				} else {
					this.orders = this.orders.filter((_) => _.status === status);
				}
				const { data } = await useApi().get<Order[]>(
					ApiUrl.queryable(ApiUrl.ORDERS, { status })
				);
				this.orders = data;
			} catch (error) {
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(payload: Order) {
			this.isSaving = true;
			this.validationErrors = {};
			try {
				const { data } = await useApi().post<Order>(ApiUrl.ORDERS, {
					...payload,
					client_id: payload.client?.id,
					proforma_invoice_id: payload.proforma?.id,
				});
				this.orders.push(data);
			} catch (error) {
				console.error("Erreur lors de l'enregistrement de la commande", error);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		async updateStatus(id: string, status: string) {
			this.validationErrors = {};
			try {
				const { data } = await useApi().patch<Order>(
					ApiUrl.parameterized(ApiUrl.ORDER_STATUS, id),
					{ status }
				);
				this.orders = this.orders.map((_) => (_.id === id ? data : _));
				this.fetchAll();
			} catch (error) {
				console.error("Erreur lors de la mise à jour du statut", error);
				this.validationErrors = useValidationErrors(error);
				throw error;
			}
		},

		async find(id: string) {
			try {
				const { data } = await useApi().get<Order>(
					ApiUrl.parameterized(ApiUrl.ORDER_BY_ID, id)
				);
				return data;
			} catch (error) {
				throw error;
			}
		},

		async delete(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.ORDER_BY_ID, id));
				this.orders = this.orders.filter((_) => _.id !== id);
				this.fetchAll();
			} catch (error) {
				throw error;
			}
		},

		cleanStorage() {
			this.orders = [];
			this.validationErrors = {};
			this.isLoading = false;
			this.isSaving = false;
		},
	},

	// Configuration de la persistance
	persist: {
		storage: persistedState.cookies,
		// Optionnel : personnaliser la clé de stockage
		key: "orders-store",
		// Optionnel : choisir quelles propriétés persister
		pick: ["orders"],
	},
});
