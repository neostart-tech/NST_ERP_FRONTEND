import { defineStore } from "pinia";

export const useTenderStore = defineStore("TenderStore", {
	state: () => ({
		tenders: [] as any[],
	}),

    actions: {
        getTenderTasks(tenderId: number) {
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
