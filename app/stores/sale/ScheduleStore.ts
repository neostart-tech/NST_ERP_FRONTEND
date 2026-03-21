import {defineStore} from "pinia";
import type {InvoiceSchedule} from "~/models/InvoiceSchedule";

export const useScheduleStore = defineStore('ScheduleStore', {
	state: () => ({
		schedules: [] as InvoiceSchedule[],
		isLoading: false,
		isSaving: false,
		validationErrors: {} as ValidationErrors,
	}),
	actions: {

		async fetchAll() {
			this.isLoading = true;
			try {
				const {data} = await useApi().get<InvoiceSchedule[]>(ApiUrl.INVOICE_SCHEDULES);
				this.schedules = data;
			} catch (error) {
				console.error("Erreur lors de la récupération des calendriers", error);
				useAlert().showAlert("Une erreur est survenue lors de la récupération des calendriers", "error");
			} finally {
				this.isLoading = false;
			}
		},

		async store(payload: { amount: number, scheduledDate: string }[], invoiceId: string) {
			this.isSaving = true;
			this.validationErrors = {};
			try {
				const {data} = await useApi().post<InvoiceSchedule>(
					ApiUrl.parameterized(ApiUrl.INVOICE_SCHEDULES_CREATE, invoiceId)
					, payload
				);
				this.schedules.push(data);
			} catch (error) {
				console.error("Erreur lors de l'enregistrement du calendrier", error);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		async delete(id: string) {
			try {
				await useApi().del(ApiUrl.parameterized(ApiUrl.INVOICE_SCHEDULES, id));
				this.schedules = this.schedules.filter((schedule) => schedule.id !== id);
			} catch (error) {
				console.error("Erreur lors de la suppression du calendrier", error);
				throw error;
			}
		},

		async markAsPaid(id: string, payload: { amount?: number, modePaymentId?: string, date: string }) {
			this.isSaving = true;
			this.validationErrors = {};
			try {
				const {data} = await useApi().post<InvoiceSchedule>(
					ApiUrl.parameterized(ApiUrl.INVOICE_SCHEDULE_MARK_AS_PAID, id),
					{
						amount: payload.amount,
						mode_payment_id: payload.modePaymentId,
						date: payload.date
					}
				);

				this.schedules = this.schedules.map(_ => _.id === id ? data : _);
				return data;
			} catch (error) {
				console.error("Erreur lors du marquage du calendrier comme payé", error);
				this.validationErrors = useValidationErrors(error);
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		async sendReminder(id: string, reason: string) {
			this.isSaving = true;
			try {
				await useApi().post(ApiUrl.parameterized(ApiUrl.SEND_INVOICE_REMINDER_MANUALLY, id), {motif: reason});
				useAlert().showAlert("Rappel envoyé avec succès", "success");
			} catch (error) {
				console.error("Erreur lors de l'envoi du rappel", error);
				useAlert().showAlert("Une erreur est survenue lors de l'envoi du rappel", "error");
				throw error;
			} finally {
				this.isSaving = false;
			}
		},

		cleanStorage() {
			this.schedules = [];
			this.validationErrors = {};
			this.isLoading = false;
			this.isSaving = false;
			localStorage.removeItem('schedule-store');
		}
	},
})
