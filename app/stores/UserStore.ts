import {defineStore} from "pinia";
import type {User, UserCreateForm} from "~/models/User";
import {ApiUrl, useApi} from "#imports";

export const useUserStore = defineStore("UserStore", {
	state() {
		return {
			users: [] as User[],
			isLoading: true,
			validationErrors: {} as ValidationErrors
		}
	},

	actions: {
		async fetchAll() {
			try {
				const {data} = await useApi().get<User[]>(ApiUrl.USERS_INDEX);
				this.users = data;
			} catch (error) {
				throw error;
			} finally {
				 this.isLoading = false;
			}
		},

		async find(userId: string) {
			this.isLoading = true;
			try {
				const { data } = await useApi().get<User>(ApiUrl.parameterized(ApiUrl.USER_BY_ID, userId));
				return data;
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async store(user: UserCreateForm) {
			this.isLoading = true;
			try {
				const { data } = await useApi().post<User>(ApiUrl.USERS_INDEX, {
					...user,
					first_name: user.firstName,
					last_name: user.lastName,
					hired_year: user.hiredYear
				});
				this.users = [data, ...this.users];
				return data;
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async updateUser(user: User) {
			this.isLoading = true;
			try {
				const { data } = await useApi().put<User>(ApiUrl.parameterized(ApiUrl.USER_BY_ID, user.id), user);
				this.users = this.users.map(_ => _.id === user.id ? data : _);
				return data;
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		},

		async confirmPassword(password: string, passwordConfirmation: string) {
			try {
				await useApi().put<User[]>(
					ApiUrl.USERS_CONFIRM_PASSWORD,
					{
						password,
						password_confirmation: passwordConfirmation
					}
				);
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				throw error;
			}
		},

		async delete(id: string) {
			this.isLoading = true;
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.USER_BY_ID, id));
				this.users = this.users.filter(_ => _.id !== id);
				this.fetchAll();
			} catch (error) {
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isLoading = false;
			}
		}
	}
});
