import type { Product } from "./Product";

export interface Movement {
	id: string;
	product_id: string;
	product: Product;
	movement_type: 'entry' | 'exit' | 'adjustment';
	quantity: number | null;
	reason: string;
}
