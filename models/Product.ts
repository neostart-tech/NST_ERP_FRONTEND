export interface Product {
	id: string
	name: string;
	reference: string;
	description: string;
	category_id: string;
	unit_price_purchase: number;
	unit_price_sale: number;
	quantity: number;
	unit: string;
	status: string;
}

export const productFormData = (product?: Product): Product => ({
	id: product?.id || "",
	name: product?.name || "",
	reference: product?.reference || "",
	description: product?.description || "",
	category_id: product?.category_id || "",
	unit_price_purchase: product?.unit_price_purchase || 0,
	unit_price_sale: product?.unit_price_sale || 0,
	quantity: product?.quantity || 0,
	unit: product?.unit || "unité",
	status: product?.status || "active",
});
