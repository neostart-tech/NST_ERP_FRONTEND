export interface User extends UserCreateForm {
	id: string;
	role?: UserRole;
	permissions: string[];
	isActive: boolean;
	createdAt: string;
	hasConfirmedPassword: boolean;
	loggedInAt: Date;
}

export enum UserRole {
	ADMIN = "Admin",
	USER = "User",
	SELLER = "Commercial"
}

export const getRoleName = (role: UserRole): string => {
	switch (role) {
		case UserRole.ADMIN:
			return "Administrateur";
		case UserRole.USER:
			return "Utilisateur simple";
		case UserRole.SELLER:
			return "Commercial";
		default:
			return role;
	}
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
	role?: UserRole;
}

export const createDefaultUserForm = (user?: User): UserCreateForm => ({
	firstName: user?.firstName || "",
	lastName: user?.lastName || "",
	email: user?.email || "",
	phone: user?.phone || "",
	login: user?.login || "",
	hiredYear: user?.hiredYear || new Date().getFullYear().toString(),
	role: user?.role || UserRole.USER
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
