// export interface DocumentType {
// 	id: string;
// 	name: string;
// 	description: string;
// 	required: boolean;
// 	status: DocumentStatusEnum;
// 	isAvailable: boolean;
// 	isValid: boolean | null;
// 	// requestDeadline: string | null;
// 	// isCustom: boolean;
// 	// uploadedFile: File | null;
// }

export enum DocumentStatusEnum {
	AVAILABLE = "available",
	MISSING = "missing",
	IN_PROGRESS = "in-progress",
}

export interface FileResource {
	id: string;
	name: string;
	path: string;
}

// Nouveau type pour les "types de document" (gestion CRUD)
export interface DocumentType {
	id: string;
	name: string;
	description?: string | null;
	isAvailable: boolean;
	required: boolean;
	status: DocumentStatusEnum;
	file?: FileResource | null;
	createdAt?: string;
	updatedAt?: string;
}
