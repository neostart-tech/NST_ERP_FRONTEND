export interface Product {
	id: string;
	name: string;
	reference: string;
	description: string;
	category_id: string;
	unit_price_purchase: number;
	unit_price_sale: number;
	current_stock: number;
	unit: string;
	is_active: Boolean;
	pivot?: {
		quantity: number;
		unit_price: number;
		total: number;
	};
}

export const productFormData = (product?: Product): Product => ({
	id: product?.id || "",
	name: product?.name || "",
	reference: product?.reference || "",
	description: product?.description || "",
	category_id: product?.category_id || "",
	unit_price_purchase: product?.unit_price_purchase || 0,
	unit_price_sale: product?.unit_price_sale || 0,
	current_stock: product?.current_stock || 0,
	unit: product?.unit || "unité",
	is_active: product?.is_active || true,
	pivot: {
		quantity: product?.pivot?.quantity || 0,
		unit_price: product?.pivot?.unit_price || 0,
		total: product?.pivot?.total || 0,
	},
});

export const formatCurrency = (amount: number) =>
	Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
	}).format(amount);
