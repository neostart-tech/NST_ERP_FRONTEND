import type { Client } from "./Client";
import { type Product } from "./Product";

export interface Proforma {
	id: string;
	reference: string;
	clientId: string;
	object?: string;
	status: 'draft' | 'validated' | 'rejected';
	created_at: string;
	updated_at: string;
	articles: Product[];
	client: Client,
	total_ht: number,
	total_ttc: number,
}
