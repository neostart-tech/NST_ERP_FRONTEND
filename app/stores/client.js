// stores/client.js
import { defineStore } from 'pinia';

export const useClientStore = defineStore('client', {
  state:()=>({
    clients:[]
  }),
  actions: {
    async createClient(clientData) {
      try {
        const response = await fetch('http://localhost:8000/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(clientData),
        });

        const data = await response.json();

        if (!response.ok) {
          // On lève l'erreur avec détails Laravel
          throw { status: response.status, ...data };
        }

        return data;
      } catch (error) {
        console.error("Erreur création client:", error);
        throw error;
      }
    },
    async fetchClients() {
      try {
        // this.loading = true;
        this.clients = await $fetch("http://127.0.0.1:8000/api/clients");

        // this.loading = false;
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
      }
    },
  }
});