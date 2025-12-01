export interface Technician {
	id: string;
	full_name: string;
	specialty: string;
	years_of_experience: number;
	email: string;
	phone: string;
	address: string;
	availability: string;
	date_added: string;
	photo: string | File | null;
}

export const defaultTechnician = (): Technician => ({
	id: Date.now().toString(),
	full_name: '',
	specialty: '',
	years_of_experience: 0,
	email: '',
	phone: '',
	address: '',
	availability: '',
	date_added: '',
	photo: null,
});

export const technicianFormDefaultValue = (technician: Technician | null = null) => ({
	id: technician?.id || Date.now().toString(),
	full_name: technician?.full_name || '',
	specialty: technician?.specialty || '',
	years_of_experience: technician?.years_of_experience || 0,
	email: technician?.email || '',
	phone: technician?.phone || '',
	address: technician?.address || '',
	availability: technician?.availability || 'Disponible',
	date_added: technician?.date_added || '',
	photo: technician?.photo || null,
	photoPreview: technician?.photo || '', // URL de prévisualisation

});
