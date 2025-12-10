import { type Client } from "./Client";

export interface OrderArticle {
	id: number;
	label: string;
	description: string;
	pivot: {
		quantity: number;
		unit_price: number;
	};
}

export interface Order {
	id: number;
	reference: string;
	client: Client;
	articles: OrderArticle[];
}

export interface Invoice {
	id: string;
	reference: string;
	date: string | Date;
	total: number;
	status: 'paid' | 'pending' | 'cancelled';
	order: Order;
	created_at?: string;
	updated_at?: string;
}
