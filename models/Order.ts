import type { Client } from "./Client";
import type { Proforma } from "./Proforma";
import type { Product } from "./Product";

// Commandes basées soit sur une proforma ou directe
export interface ProformaOrder {
	id: string;
	reference: string;
	date: string;
	comment?: string;
	articles: Product[];
	// client_id: string;
	client: Client;
	// proforma_id: string;
	proforma: Proforma;
}
