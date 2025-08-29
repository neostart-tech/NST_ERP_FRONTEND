// stores/client.js
import { defineStore } from 'pinia';

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [], // Toujours initialiser avec un tableau vide
    currentClient: null, // Pour stocker les détails d'un client spécifique
    loading: false,
    error: null
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
          throw { status: response.status, ...data };
        }

        // Ajouter le nouveau client à la liste
        this.clients.push(data.client);
        
        return data;
      } catch (error) {
        console.error("Erreur création client:", error);
        this.error = error.message || "Erreur lors de la création du client";
        throw error;
      }
    },

    async fetchClients() {
      try {
        this.loading = true;
        this.error = null;
        
        // Utilisez $fetch de Nuxt 3 ou fetch standard
        const response = await fetch('http://127.0.0.1:8000/api/clients');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Assurez-vous que data est un tableau
        this.clients = Array.isArray(data) ? data : [];
        
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
        this.error = error.message;
        this.clients = []; // Garantir que clients reste un tableau
      } finally {
        this.loading = false;
      }
    },

    // NOUVEAU: Récupérer un client spécifique
    async fetchClient(id) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await fetch(`http://127.0.0.1:8000/api/clients/${id}`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        this.currentClient = data;
        
        return data;
      } catch (error) {
        console.error("Erreur lors du chargement du client:", error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // NOUVEAU: Mettre à jour un client
    
async updateClient({ id, clientData }) {
  try {
    const response = await fetch(`http://localhost:8000/api/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, ...data };
    }

    // Mettre à jour le client dans la liste
    const index = this.clients.findIndex(client => client.id === id);
    if (index !== -1) {
      this.clients[index] = data.client;
    }
    
    return data;
  } catch (error) {
    console.error("Erreur mise à jour client:", error);
    this.error = error.message || "Erreur lors de la mise à jour du client";
    throw error;
  }
},

    // NOUVEAU: Supprimer un client
    async deleteClient(id) {
      try {
        const response = await fetch(`http://localhost:8000/api/clients/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw { status: response.status, ...data };
        }

        // Retirer le client de la liste
        this.clients = this.clients.filter(client => client.id !== id);
        
        return data;
      } catch (error) {
        console.error("Erreur suppression client:", error);
        this.error = error.message || "Erreur lors de la suppression du client";
        throw error;
      }
    },

    // NOUVEAU: Réinitialiser l'erreur
    clearError() {
      this.error = null;
    }
  }
});