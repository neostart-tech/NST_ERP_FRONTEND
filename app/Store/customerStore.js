export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    selectedClient: null,
    loading: false,
    error: null
  }),

  actions: {
    // Récupérer tous les clients
    async fetchClients() {
      this.loading = true
      try {
        const response = await $fetch('/api/displayClients')
        this.clients = response.data
        this.error = null
      } catch (error) {
        this.error = error.message || 'Erreur lors de la récupération des clients'
        console.error('Error fetching clients: - customerStore.js:19', error)
      } finally {
        this.loading = false
      }
    },

    // Ajouter un nouveau client
    async addClient(clientData) {
      this.loading = true
      try {
        const response = await $fetch('/api/addClient', {
          method: 'POST',
          body: clientData
        })
        this.clients.push(response.data)
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.message || 'Erreur lors de l\'ajout du client'
        console.error('Error adding client: - customerStore.js:38', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Mettre à jour un client
    async updateClient(id, clientData) {
      this.loading = true
      try {
        const response = await $fetch(`/api/updateClient/${id}`, {
          method: 'PUT',
          body: clientData
        })
        
        const index = this.clients.findIndex(c => c.id === id)
        if (index !== -1) {
          this.clients[index] = response.data
        }
        
        // Si le client sélectionné est celui qui est mis à jour
        if (this.selectedClient && this.selectedClient.id === id) {
          this.selectedClient = response.data
        }
        
        this.error = null
        return response.data
      } catch (error) {
        this.error = error.message || 'Erreur lors de la mise à jour du client'
        console.error('Error updating client: - customerStore.js:68', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Supprimer un client
    async deleteClient(id) {
      this.loading = true
      try {
        await $fetch(`/api/deleteClient/${id}`, {
          method: 'DELETE'
        })
        
        this.clients = this.clients.filter(c => c.id !== id)
        
        // Si le client sélectionné est celui qui est supprimé
        if (this.selectedClient && this.selectedClient.id === id) {
          this.selectedClient = null
        }
        
        this.error = null
      } catch (error) {
        this.error = error.message || 'Erreur lors de la suppression du client'
        console.error('Error deleting client: - customerStore.js:93', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Sélectionner un client
    selectClient(client) {
      this.selectedClient = client
    },

    // Effacer la sélection
    clearSelectedClient() {
      this.selectedClient = null
    }
  },

  getters: {
    // Filtre les clients par recherche
    filteredClients: (state) => (searchQuery) => {
      if (!searchQuery) return state.clients
      const query = searchQuery.toLowerCase()
      return state.clients.filter(client => 
        client.nom.toLowerCase().includes(query) || 
        (client.entreprise && client.entreprise.toLowerCase().includes(query)) ||
        client.email.toLowerCase().includes(query)
      )
    }
  }
})