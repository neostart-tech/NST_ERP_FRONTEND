export interface Technician {
    id: number;
    nom: string;
    specialite: string;
    experience?: number;
    email: string;
    telephone: string;
    adresse?: string;
    disponibilite: string;
    photo?: string;
    dateAjout: string;
    created_at?: string;
    updated_at?: string;
}

export interface TechnicianFormData {
    nom: string;
    specialite: string;
    experience?: number;
    email: string;
    telephone: string;
    adresse?: string;
    disponibilite: string;
    photo?: File;
}

export interface TechnicianResponse {
    success: boolean;
    message: string;
    data: Technician | Technician[];
    count?: number;
}

export interface TechnicianListResponse {
    success: boolean;
    count: number;
    data: Technician[];
}

