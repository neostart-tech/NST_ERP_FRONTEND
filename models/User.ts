export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role?: string;
	permissions: string[];
	isActive: boolean;
	createdAt: string;
}

export interface AuthUser extends User {
	token: string;
}

export interface LoginCredential {
	email: string;
	password: string;
}

export const createDefaultLoginCredential = (): LoginCredential => ({
	email: "",
	password: ""
});
