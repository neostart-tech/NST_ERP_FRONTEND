import type {User} from "./User";
import type {Invoice} from "./Invoice";

export interface InvoiceSchedule {
	id: string;
	amount: number;
	actualDate: string;
	scheduledDate: string;
	user: User;
	invoice: Invoice;
}

export const defaultInvoiceSchedule: InvoiceSchedule = {
	id: '',
	amount: 0,
	actualDate: '',
	scheduledDate: '',
	// @ts-ignore
	user: {},
	invoice: {
		id: '',
		// @ts-ignore
		order: {},
		type: '',
	},
};
