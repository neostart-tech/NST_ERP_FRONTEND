import { defaultClient, type Client } from "./Client";
import { type Product } from "./Product";

export enum QuoteStatusEnum
{
	SENT = 'Envoyé',
	ACCEPTED = 'Accepté',
	REFUSED = 'Refusé',
};

export interface Quote {
	client: Client,
	date: string,
	validity: number,
	status: QuoteStatusEnum,
	notes: string,
	terms_conditions: string,
	payment_terms: string,
	items: Product[]
}

export const initQuoteForm = (data?: Quote): Quote => ({
	client: data?.client || defaultClient(),
	date: data?.date || new Date().toISOString().split('T')[0]!,
	validity: data?.validity || 30,
	status: data?.status || QuoteStatusEnum.SENT,
	notes: data?.notes || '',
	terms_conditions: data?.terms_conditions || '',
	payment_terms: data?.payment_terms || '',
	items: data?.items || [
		{
			description: '',
			quantity: 1,
			unit_price: 0
		}
	]
});
