import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDocumentStore = defineStore('document', () => {
  const invoices = ref([])
  const proformas = ref([])
  const deliveries = ref([])
  const clients = ref([])
  const technicians = ref([])
  const equipments = ref([])
  const interventions = ref([])

  // Charger tous les documents
  const fetchAllDocuments = async () => {
    try {
      await Promise.all([
        fetchInvoices(),
        fetchProformas(),
        fetchDeliveries(),
        fetchClients(),
        fetchTechnicians(),
        fetchEquipments(),
        fetchInterventions()
      ])
    } catch (error) {
      console.error('Erreur lors du chargement des documents: - documentStore.js:26', error)
    }
  }

  // Factures
  const fetchInvoices = async () => {
    try {
      // Cette API devra être créée côté Laravel
      const response = await fetch('/api/invoices')
      invoices.value = await response.json()
    } catch (error) {
      console.error('Erreur lors du chargement des factures: - documentStore.js:37', error)
    }
  }

  const addInvoice = async (invoiceData) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData)
      })
      const newInvoice = await response.json()
      invoices.value.push(newInvoice)
      return newInvoice
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la facture: - documentStore.js:54', error)
      throw error
    }
  }

  const updateInvoice = async (id, invoiceData) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData)
      })
      const updatedInvoice = await response.json()
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index !== -1) {
        invoices.value[index] = updatedInvoice
      }
      return updatedInvoice
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture: - documentStore.js:75', error)
      throw error
    }
  }

  const deleteInvoice = async (id) => {
    try {
      await fetch(`/api/invoices/${id}`, {
        method: 'DELETE'
      })
      invoices.value = invoices.value.filter(inv => inv.id !== id)
    } catch (error) {
      console.error('Erreur lors de la suppression de la facture: - documentStore.js:87', error)
      throw error
    }
  }

  // Clients
  const fetchClients = async () => {
    try {
      const response = await fetch('/api/displayClients')
      const data = await response.json()
      if (data.success) {
        clients.value = data.data
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients: - documentStore.js:101', error)
    }
  }

  const addClient = async (clientData) => {
    try {
      const formData = new FormData()
      Object.keys(clientData).forEach(key => {
        if (clientData[key] !== null && clientData[key] !== undefined) {
          formData.append(key, clientData[key])
        }
      })

      const response = await fetch('/api/addClient', {
        method: 'POST',
        body: formData
      })
      const newClient = await response.json()
      if (newClient.success) {
        clients.value.push(newClient.data)
      }
      return newClient
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client: - documentStore.js:124', error)
      throw error
    }
  }

  // Techniciens
  const fetchTechnicians = async () => {
    try {
      const response = await fetch('/api/displayTechnicians')
      technicians.value = await response.json()
    } catch (error) {
      console.error('Erreur lors du chargement des techniciens: - documentStore.js:135', error)
    }
  }

  // Équipements
  const fetchEquipments = async () => {
    try {
      const response = await fetch('/api/displayEquipments')
      const data = await response.json()
      if (data.success) {
        equipments.value = data.data
      }
    } catch (error) {
      console.error('Erreur lors du chargement des équipements: - documentStore.js:148', error)
    }
  }

  // Interventions
  const fetchInterventions = async () => {
    try {
      const response = await fetch('/api/displayInterventions')
      const data = await response.json()
      if (data.success) {
        interventions.value = data.data
      }
    } catch (error) {
      console.error('Erreur lors du chargement des interventions: - documentStore.js:161', error)
    }
  }

  return {
    invoices,
    proformas,
    deliveries,
    clients,
    technicians,
    equipments,
    interventions,
    fetchAllDocuments,
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    fetchClients,
    addClient,
    fetchTechnicians,
    fetchEquipments,
    fetchInterventions
  }
})