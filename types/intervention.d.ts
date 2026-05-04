export interface Intervention {
    id: number;
    equipment_id: number;
    client_id: number;
    technician_id: number;
    problem_description: string;
    report_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    contact_time?: string;
    repair_start_date?: string;
    repair_end_date?: string;
    technician_findings?: string;
    is_tested_certified?: boolean;
    is_sent_for_maintenance?: boolean;
    needs_delivery?: boolean;
    delivery_price?: number;
    under_contract?: boolean;
    audio_file_path?: string;
    customer_signature_path?: string;
    signed_at?: string;
    created_at: string;
    updated_at: string;

    // Relations
    equipment?: Equipment;
    client?: Client;
    technician?: Technician;
}

export interface Equipment {
    id: number;
    name: string;
    serial: string;
    manufacturer: string;
    model: string;
    purchase_date: string;
    under_warranty: boolean;
}

export interface Client {
    id: number;
    name?: string;
    company_name?: string;
    type: 'physical' | 'company';
    department?: string;
    location?: string;
    phone: string;
    email: string;
}

export interface Technician {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export interface InterventionFormData {
    equipment_id: number;
    client_id: number;
    technician_id: number;
    problem_description: string;
    report_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    contact_time?: string;
    repair_start_date?: string;
    repair_end_date?: string;
    technician_findings?: string;
    is_tested_certified?: boolean;
    is_sent_for_maintenance?: boolean;
    needs_delivery?: boolean;
    delivery_price?: number;
    under_contract?: boolean;
    audio_file?: File;
    signature?: string;
}

export interface InterventionResponse {
    success: boolean;
    message: string;
    data: Intervention | Intervention[];
    count?: number;
}

export interface InterventionListResponse {
    success: boolean;
    count: number;
    data: Intervention[];
}

