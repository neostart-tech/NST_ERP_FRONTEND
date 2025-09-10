export interface User extends UserCreateForm {
	id: string;
	role?: string;
	permissions: string[];
	isActive: boolean;
	createdAt: string;
	hasConfirmedPassword: boolean;
	loggedInAt: string;
}

export interface AuthUser extends User {
	token: string;
}

export interface UserCreateForm {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	login: string;
	hiredYear: string;
}

export const createDefaultUserForm = (): UserCreateForm => ({
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	login: "",
	hiredYear: new Date().getFullYear().toString()
});

export interface LoginCredential {
	email: string;
	password: string;
}

export const createDefaultLoginCredential = (): LoginCredential => ({
	email: "",
	password: ""
});

export interface PasswordResetData extends NewPasswordData {
	token: string;
	email: string;
};

export interface NewPasswordData {
	password: string;
	password_confirmation: string;
}
