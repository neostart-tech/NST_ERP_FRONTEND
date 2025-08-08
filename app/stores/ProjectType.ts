import { defineStore } from "pinia";
import type { ProjectType } from "~/models/ProjectType";

export const useProjectTypeStore = defineStore("ProjectTypeStore", {
    state() {
        return {
            projectTypes: [] as ProjectType[],
        };
    },
    actions: {
        async fetchProjectTypes() {
            try {
                const { data } = await useApi().get<ProjectType[]>(ApiUrl.OFFER_TYPES);
                this.projectTypes = data;
            } catch (error) {
                console.log("Error fetching project types:", error);
                useAlert().showAlert("Une erreur est survenue lors de la récupération des types de projet", "error");
            }
        },
    },
});