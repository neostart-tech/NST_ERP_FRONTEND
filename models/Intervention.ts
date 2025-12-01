import type { Client } from "./Client";
import type { Equipment } from "./Equipment";
import type { Technician } from "./Technician";

export interface Intervention {
	id: string,
	client_id: string,
	equipement_id: string,
	technician_id: string,
	problem_description: string,
	report_date: string,
	contact_time: string,
	status: string,
	department: string,
	location: string,
	is_tested_certified: boolean,
	is_sent_for_maintenance: boolean,
	needs_delivery: boolean,
	delivery_price: number,
	under_contract: boolean,
	repair_start_date: string,
	repair_end_date: string,
	repair_duration: string,
	technician_findings: string,
	client: Client | null,
	equipment: Equipment | null,
	technician: Technician | null,
	// quotation_file_name: string,
	// quotation_file: string,
	// quotation_amount: string,
	// audio_recording_url: string,
	// quotation_email_sent: boolean,
	// quotation_email_date: string,
	// quotation_comments: string,
	// technician_signature: string,
	// client_signature: string
}

export const getInterventionStatus = (_: Intervention) => {
	return _.status === 'new' ? 'Nouveau'
		: _.status === 'diagnostic' ? 'En diagnostic'
		: _.status === 'quotation' ? 'Validation du devis en cours'
		: _.status === 'repair' ? 'En réparation'
		: _.status === 'waiting' ? 'En attente de pièces'
		: _.status === 'finished' ? 'Terminé'
		: _.status === 'delivered' ? 'Livré'
		: ''
}

export const getStatusColor = (status: string) => {
	switch (status) {
		case 'new': return 'bg-blue-100 text-blue-800'
		case 'diagnostic': return 'bg-purple-100 text-purple-800'
		case 'devis': return 'bg-yellow-100 text-yellow-800'
		case 'repair': return 'bg-indigo-100 text-indigo-800'
		case 'pieces': return 'bg-orange-100 text-orange-800'
		case 'finished': return 'bg-green-100 text-green-800'
		case 'delivered': return 'bg-teal-100 text-teal-800'
		default: return 'bg-gray-100 text-gray-800'
	}
}

export const InterventionFormData = (intervention?: Intervention): Intervention => ({
	id: intervention?.id || '',
	client_id: intervention?.client_id || '',
	equipement_id: intervention?.equipement_id || '',
	technician_id: intervention?.technician_id || '',
	problem_description: intervention?.problem_description || '',
	report_date: intervention?.report_date || new Date().toISOString().slice(0, 16),
	contact_time: intervention?.contact_time || '',
	status: intervention?.status || 'new',
	department: intervention?.department || '',
	location: intervention?.location || '',
	is_tested_certified: intervention?.is_tested_certified || false,
	is_sent_for_maintenance: intervention?.is_sent_for_maintenance || false,
	needs_delivery: intervention?.needs_delivery || false,
	delivery_price: intervention?.delivery_price || 0,
	under_contract: intervention?.under_contract || false,
	repair_start_date: intervention?.repair_start_date || '',
	repair_end_date: intervention?.repair_end_date || '',
	repair_duration: intervention?.repair_duration || '',
	technician_findings: intervention?.technician_findings || '',
	client: intervention?.client || null,
	equipment: intervention?.equipment || null,
	technician: intervention?.technician || null,
	// quotation_file_name: '',
	// quotation_file: null,
	// quotation_amount: '',
	// audio_recording_url: '',
	// quotation_email_sent: false,
	// quotation_email_date: new Date().toISOString().slice(0, 16),
	// quotation_comments: '',
	// technician_signature: '',
	// client_signature: ''
});
