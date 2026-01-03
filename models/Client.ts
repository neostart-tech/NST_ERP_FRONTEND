export interface Client {
	id:string,
	first_name: string,
	last_name: string,
	client_type: string,
	company_name: string,
	email: string,
	phone: string,
	region: string,
	country: string,
	city: string
}

export const defaultClient = () : Client => ({
	id: Date.now().toString(),
	first_name: '',
	last_name: '',
	client_type: 'Physique',
	company_name: '',
	email: '',
	phone: '',
	region: '',
	country: '',
	city: ''
});

export function getClientName(client: Client): string {
	return client.client_type.toLowerCase() === 'physique'
		? `${client.first_name} ${client.last_name}`
		: client.company_name;
}
