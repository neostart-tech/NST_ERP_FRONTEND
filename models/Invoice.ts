import { type Client } from "./Client";
import type { Product } from "./Product";
import type { Proforma } from "./Proforma";

export interface OrderArticle {
	id: number;
	label: string;
	description: string;
	pivot?: {
		quantity: number;
		unit_price: number;
	};
}

export interface Order {
	id: string;
	reference: string;
	date: string;
	total_ht: number;
	total_ttc: number;
	status: 'pending' | 'delivered' | 'canceled';
	created_at?: string;
	updated_at?: string;
	comment?: string;
	client: Client;
	proforma?: Proforma;
	articles: Product[];
}

export interface Invoice {
	id: string;
	reference: string;
	date: string | Date;
	total: number;
	status: "paid" | "pending" | "cancelled";
	order: Order;
	created_at?: string;
	updated_at?: string;
}
