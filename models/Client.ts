export interface Client {
	id:string,
	type: string,
	first_name: string,
	last_name: string,
	companyName: string,
	email: string,
	phone: string,
	region: string,
	country: string,
	city: string
}

export const defaultClient = () : Client => ({
	id: '',
	type: '',
	first_name: '',
	last_name: '',
	companyName: '',
	email: '',
	phone: '',
	region: '',
	country: '',
	city: ''
});	
