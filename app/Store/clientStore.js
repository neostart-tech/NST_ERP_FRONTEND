export const useClientStore = defineStore('Client', {
  state: () => ({
    clients: [],
    loading: false,
    appURL: "http://127.0.0.1:8000/api/",
  }),
  actions: {
    async fetchClients() {
      try {
        this.clients = await $fetch(`${this.appURL}displayClients`);
      } catch (error) {
        console.error("Error fetching clients: - ClientStore.js:12", error);
      }
    },

    async addClient(payload) {
      try {
        const response = await $fetch(`${this.appURL}addClient`, {
          method: 'POST',
          body: payload
        });
        this.clients.push(response.data);
      } catch (error) {
        console.error("Error adding client: - ClientStore.js:24", error);
      } finally {
        this.loading = false;
      }
    },

    async updateClient(id, formData) {
      this.loading = true;
      try {
        const response = await $fetch(`${this.appURL}updateClient/${id}`, {
          method: 'PUT',
          body: formData
        });
        const index = this.clients.findIndex(c => c.id === id);
        if (index !== -1) {
          this.clients[index] = response.data;
        }
      } catch (error) {
        console.error("Error updating client: - ClientStore.js:42", error);
      } finally {
        this.loading = false;
      }
    },

    async deleteClient(id) {
      this.loading = true;
      try {
        await $fetch(`${this.appURL}deleteClient/${id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error("Error deleting client: - ClientStore.js:55", error);
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    getClients: (state) => state.clients,
    getLoading: (state) => state.loading,
    getAppURL: (state) => state.appURL,
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'clientStore',
        storage: localStorage,
      },
    ],
  },
});