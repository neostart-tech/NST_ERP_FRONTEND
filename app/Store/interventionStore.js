import { ApiUrls } from '../composables/apiUrl';

export const useInterventionStore = defineStore('Intervention', {
  state: () => ({
    interventions: [],
    technicians: [],
    equipments: [],
    clients: [],
    loading: false,
    appURL: "http://127.0.0.1:8000/api/",
  }),

  actions: {
    // Récupérer toutes les interventions
    async fetchInterventions() {
      this.loading = true;
      try {
        const response = await $fetch(`${this.appURL}${ApiUrls.INTERVENTIONS.DISPLAY}`);
        this.interventions = response.data || [];
      } catch (error) {
        console.error("Error fetching interventions: - interventionStore.js:21", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Ajouter une nouvelle intervention
    async addIntervention(payload) {
      this.loading = true;
      try {
        const formData = new FormData();
        
        // Ajouter tous les champs du formulaire
        Object.keys(payload).forEach(key => {
          if (payload[key] !== null && payload[key] !== undefined) {
            if (key === 'audio_file' && payload[key] instanceof File) {
              formData.append(key, payload[key]);
            } else if (key === 'signature' && typeof payload[key] === 'string') {
              formData.append(key, payload[key]);
            } else {
              formData.append(key, payload[key]);
            }
          }
        });

        const response = await $fetch(`${this.appURL}${ApiUrls.INTERVENTIONS.ADD}`, {
          method: 'POST',
          body: formData
        });
        
        if (response.success) {
          this.interventions.unshift(response.data);
        }
        return response;
      } catch (error) {
        console.error("Error adding intervention: - interventionStore.js:57", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Mettre à jour une intervention
    async updateIntervention(id, payload) {
      this.loading = true;
      try {
        const formData = new FormData();
        
        // Ajouter tous les champs du formulaire
        Object.keys(payload).forEach(key => {
          if (payload[key] !== null && payload[key] !== undefined) {
            if (key === 'audio_file' && payload[key] instanceof File) {
              formData.append(key, payload[key]);
            } else if (key === 'signature' && typeof payload[key] === 'string') {
              formData.append(key, payload[key]);
            } else {
              formData.append(key, payload[key]);
            }
          }
        });

        const response = await $fetch(`${this.appURL}${ApiUrls.INTERVENTIONS.UPDATE}/${id}`, {
          method: 'PUT',
          body: formData
        });
        
        if (response.success) {
          const index = this.interventions.findIndex(i => i.id === id);
          if (index !== -1) {
            this.interventions[index] = response.data;
          }
        }
        return response;
      } catch (error) {
        console.error("Error updating intervention: - interventionStore.js:96", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Supprimer une intervention
    async deleteIntervention(id) {
      this.loading = true;
      try {
        const response = await $fetch(`${this.appURL}${ApiUrls.INTERVENTIONS.DELETE}/${id}`, {
          method: 'DELETE'
        });
        
        if (response.success) {
          this.interventions = this.interventions.filter(i => i.id !== id);
        }
        return response;
      } catch (error) {
        console.error("Error deleting intervention: - interventionStore.js:116", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Récupérer les techniciens
    async fetchTechnicians() {
      try {
        const response = await $fetch(`${this.appURL}${ApiUrls.TECHNICIANS.DISPLAY}`);
        this.technicians = response || [];
      } catch (error) {
        console.error("Error fetching technicians: - interventionStore.js:129", error);
        throw error;
      }
    },

    // Récupérer les équipements
    async fetchEquipments() {
      try {
        const response = await $fetch(`${this.appURL}${ApiUrls.EQUIPMENTS.DISPLAY}`);
        this.equipments = response.data || [];
      } catch (error) {
        console.error("Error fetching equipments: - interventionStore.js:140", error);
        throw error;
      }
    },

    // Récupérer les clients
    async fetchClients() {
      try {
        const response = await $fetch(`${this.appURL}${ApiUrls.CLIENTS.DISPLAY}`);
        this.clients = response.data || [];
      } catch (error) {
        console.error("Error fetching clients: - interventionStore.js:151", error);
        throw error;
      }
    },

    // Initialiser toutes les données
    async initializeData() {
      await Promise.all([
        this.fetchInterventions(),
        this.fetchTechnicians(),
        this.fetchEquipments(),
        this.fetchClients()
      ]);
    }
  },

  getters: {
    getInterventions: (state) => state.interventions,
    getTechnicians: (state) => state.technicians,
    getEquipments: (state) => state.equipments,
    getClients: (state) => state.clients,
    getLoading: (state) => state.loading,
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'interventionStore',
        storage: localStorage,
      },
    ],
  },
});
