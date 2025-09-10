import type { OfferType } from "./ProjectType";
import type { OfferSource } from "./OfferSource";
import type { Entreprise } from "./Enterprise";

export interface Offer {
    id: string;
    title: string;
    description: string;
    estimated_budget: number;
    publication_date: string;
    amount: number;
    submission_deadline: string;
    status: string;
    offer_type: OfferType;
    offer_source: OfferSource;
    entreprise: Entreprise;
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
    metaData: Metadata
}

export interface OfferForm {
    title: string;
    description: string;
    estimated_budget: number;
    publication_date: string;
    amount: number;
    submission_deadline: string;
    status: string;
    offer_type: string;
    source_label: string;
    enterprise_id: string;
    number?: string;
    file_price?: number;
    file_obtaining_deadline?: string;
    offer_validity: string;
    submission_address: string;
    requirement?: string;
    stacking_instruction?: string;
    batch_number: string;
    execution_batch_duration?: string;
    execution_duration?: string;
}

export interface Metadata {
    id: string;
    bank_guarentee?: string;
    bank_guarentee_amount?: number;
    offer_project?: string;
    sponsor?: string;
    clarification_instruction?: string;
    is_free?: boolean;
    offer_opening_date?: string;
    offer_pickup_address?: string;
    comment?: string;
    updated_at: string;
    created_at: string;
}

export interface MetadataForm {
    bank_guarentee?: boolean;
    bank_guarentee_amount?: number;
    offer_project?: string;
    sponsor?: string;
    clarification_instruction?: string;
    is_free?: boolean;
    offer_opening_date?: string;
    offer_pickup_address?: string;
    comment?: string;
}

export const defaultOfferFormData = (): OfferForm => ({
    title: "",
    description: "",
    estimated_budget: 0,
    publication_date: "",
    amount: 0,
    submission_deadline: "",
    status: "",
    offer_type: "",
    source_label: "",
    entreprise: "",
    number: "",
    file_price: 0,
    file_obtaining_deadline: "",
    offer_validity: "",
    submission_address: "",
    requirement: "",
    stacking_instruction: "",
    batch_number: "",
    execution_batch_duration: "",
    execution_duration: "",
});

export const defaultOfferData = (): Offer => ({
    title: "",
    description: "",
    estimated_budget: 0,
    publication_date: "",
    amount: 0,
    submission_deadline: "",
    status: "",
    offer_type: "",
    source_label: "",
    entreprise: "",
    number: "",
    file_price: 0,
    file_obtaining_deadline: "",
    offer_validity: "",
    submission_address: "",
    requirement: "",
    stacking_instruction: "",
    batch_number: "",
    execution_batch_duration: "",
    execution_duration: "",
});


export const defaultMetadataFormData = (): MetadataForm => ({
    bank_guarentee: "",
    bank_guarentee_amount: 0,
    offer_project: "",
    sponsor: "",
    clarification_instruction: "",
    is_free: false,
    offer_opening_date: "",
    offer_pickup_address: "",
    comment: "",
});