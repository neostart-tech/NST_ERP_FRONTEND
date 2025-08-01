export interface User {
	id: string;
	name: string;
	email: string;
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
