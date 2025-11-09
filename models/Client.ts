export interface Client {
	id:string,
	type: string,
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
	type: '',
	first_name: '',
	last_name: '',
	client_type: '',
	company_name: '',
	email: '',
	phone: '',
	region: '',
	country: '',
	city: ''
});
