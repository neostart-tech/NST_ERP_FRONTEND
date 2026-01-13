import type { Order } from "./Invoice";
import type { Product } from "./Product";

export interface Delivery {
	id: string;
	order: Order;
	delivery_date: string;
	delivery_address: string;
	delivery_type: string;
	created_at: string;
	updated_at: string;
	// items: DeliveryItem[];
}

export interface DeliveryItem {
	id: string;
	// delivery
	article: Product;
	quantity: number;
}