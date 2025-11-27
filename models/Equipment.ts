export interface Equipment {
	id: string
	type: string;
	brand: string;
	model: string;
	manufacturer: string;
	serial_number: string;
	diagnostic_price: string;
	characteristics: string;
	name: string;
	role: string;
	mac_address: string;
	ip_address: string;
	company_name: string;
	company_address: string;
	company_zipCode: string;
	company_city: string;
	comment: string;
	photo: string | null | File,
	photoPreview: string | null
}

export const equipmentFormData = (equipment?: Equipment): Equipment => ({
	id: equipment?.id || '',
	type: equipment?.type || '',
	brand: equipment?.brand || '',
	model: equipment?.model || '',
	manufacturer: equipment?.manufacturer || '',
	serial_number: equipment?.serial_number || '',
	diagnostic_price: equipment?.diagnostic_price || '',
	characteristics: equipment?.characteristics || '',
	name: equipment?.name || '',
	role: equipment?.role || '',
	mac_address: equipment?.mac_address || '',
	ip_address: equipment?.ip_address || '',
	company_name: equipment?.company_name || '',
	company_address: equipment?.company_address || '',
	company_zipCode: equipment?.company_zipCode || '',
	company_city: equipment?.company_city || '',
	comment: equipment?.comment || '',
	photo: equipment?.photo || null,
	photoPreview: equipment?.photoPreview || null
});
