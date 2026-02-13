import type { OfferType } from "./ProjectType";
import type { OfferSource } from "./OfferSource";
import type { Entreprise } from "./Enterprise";

export enum OfferStatus {
	PENDING = 'En attente de validation',
	VALIDATED = 'Validé',
	SUBMITTED = 'Soumis',
	REJECTED = 'Rejeté',
}

export interface Offer {
	id: string;
	title: string;
	description: string;
	estimated_budget: number;
	publication_date: string;
	amount: number;
	submission_deadline: string;
	status: OfferStatus;
	offer_type: OfferType;
	offer_source: OfferSource;
	enterprise: Entreprise;
	number: string;
	file_price: number;
	file_obtaining_deadline: string;
	offer_validity: string;
	submission_address: string;
	requirement: string;
	stacking_instruction: string;
	batch_number: string;
	execution_batch_duration: string;
	execution_duration: string;
	metadata: Metadata,
	lots: Lot[]
}

export interface OfferForm {
	title: string;
	description: string;
	estimated_budget: number;
	publication_date: string;
	amount: number;
	submission_deadline: string;
	status: string;
	offer_type_id: string;
	source_label: string;
	source_reference: string;
	enterprise_id: string;
	number?: string;
	file_price?: number;
	file_obtaining_deadline?: string;
	offer_validity: string;
	submission_address: string;
	requirement?: string[];
	stacking_instruction?: string;
	batch_number: string;
	execution_batch_duration?: string;
	execution_duration?: string;
	metadata?: MetadataForm
}

export interface Metadata {
	id: string;
	bank_guarentee?: number;
	offer_project?: string;
	sponsor?: string;
	clarification_instruction?: string;
	is_free?: boolean;
	tender_opening_date?: string;
	tender_pickup_address?: string;
	comment?: string;
	updated_at: string;
	created_at: string;
}

export interface MetadataForm {
	has_bank_guarentee?: number;
	bank_guarentee?: number;
	offer_project?: string;
	sponsor?: string;
	clarification_instruction?: string;
	is_free?: boolean;
	tender_opening_date?: string;
	tender_pickup_address?: string;
	comment?: string;
}

export interface LotItem {
	productId: string;
	productName: string;
	quantity: number;
	unitPrice: number;
}

export interface Lot {
	id: string;
	name: string;
	title: string;
	description: string | null;
	total_profit: number;
	isNew: boolean;
	items: LotItem[];
}

export const defaultOfferFormData = (data?: Offer): OfferForm => ({
	title: data?.title || "",
	description: data?.description || "",
	estimated_budget: data?.estimated_budget || 0,
	publication_date: data?.publication_date || "",
	amount: data?.amount || 0,
	submission_deadline: data?.submission_deadline || "",
	status: data?.status || "",
	offer_type_id: data?.offer_type.id || "",
	source_label: data?.offer_source.label || "",
	source_reference: data?.offer_source.reference || "",
	enterprise_id: data?.enterprise.id || "",
	number: data?.number || "",
	file_price: data?.file_price || 0,
	file_obtaining_deadline: data?.file_obtaining_deadline || "",
	offer_validity: data?.offer_validity || "",
	submission_address: data?.submission_address || "",
	requirement: data?.requirement || [],
	stacking_instruction: data?.stacking_instruction || "",
	batch_number: data?.batch_number || "",
	execution_batch_duration: data?.execution_batch_duration || "",
	execution_duration: data?.execution_duration || "",
	metadata: data?.metadata || {}
});

export const defaultOfferData = (offer?: Offer): Offer => ({
	title: offer?.title || "",
	description: offer?.description || "",
	estimated_budget: offer?.estimated_budget || 0,
	publication_date: offer?.publication_date || "",
	amount: offer?.amount || 0,
	submission_deadline: offer?.submission_deadline || "",
	status: offer?.status || "",
	offer_type: offer?.offer_type || "",
	offer_source: offer?.offer_source || "",
	source_label: offer?.source_label || "",
	enterprise: offer?.enterprise || "",
	metadata: offer?.metadata || defaultMetadataFormData(),
	number: offer?.number || "",
	file_price: offer?.file_price || 0,
	file_obtaining_deadline: offer?.file_obtaining_deadline || "",
	offer_validity: offer?.offer_validity || "",
	submission_address: offer?.submission_address || "",
	requirement: offer?.requirement || "",
	stacking_instruction: offer?.stacking_instruction || "",
	batch_number: offer?.batch_number || "",
	execution_batch_duration: offer?.execution_batch_duration || "",
	execution_duration: offer?.execution_duration || "",
});

export const defaultMetadataFormData = (): MetadataForm => ({
	has_bank_guarentee: 0,
	offer_project: "",
	sponsor: "",
	clarification_instruction: "",
	is_free: false,
	tender_opening_date: "",
	tender_pickup_address: "",
	comment: "",
});

export const defaultLotData = (): Lot => ({
	id: "",
	name: "",
	title: "",
	description: "",
	total_profit: 0,
	isNew: true,
	items: []
})


