import { defineStore } from "pinia";

export const useofferStore = defineStore("offerStore", {
	state: () => ({
		offers: [] as any[],
	}),

    actions: {
        getofferTasks(offerId: number) {
            return [];
        },
        updateTask(taskId: number, taskData: any) {
            return [];
        },
        createTask(taskData: any) {
            return [];
        }
    }
});
