<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Titre -->
    <h1 class="text-2xl font-bold text-gray-800">Gestion des Clients</h1>

    <!-- Statistiques -->
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-indigo-100 p-4 rounded-xl border-l-4 border-blue-900 shadow text-center">
        <h3 class="text-lg font-semibold text-indigo-700">Total Clients</h3>
        <p class="text-3xl font-bold">{{ clientStore.stat.total }}</p>
      </div>
      <div class="bg-green-100 p-4 rounded-xl border-l-4 border-green-800 shadow text-center">
        <h3 class="text-lg font-semibold text-green-700">Clients Physiques</h3>
        <p class="text-3xl font-bold">{{ clientStore.stat.physique }}</p>
      </div>
      <div class="bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-800 h-[100px] shadow text-center">
        <h3 class="text-lg font-semibold text-yellow-700">Clients Moraux</h3>
        <p class="text-3xl font-bold">{{ clientStore.stat.moral }}</p>
      </div>
    </div>

    <!-- Liste des Clients -->
    <div class="bg-white border p-4 rounded-lg shadow mt-6">
      <div class="flex justify-between mb-4">
        <h2 class="text-lg font-semibold">Liste des Clients</h2>
        <button @click="openModalForCreate" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          <i class="fas fa-plus"></i> Nouveau Client
        </button>
      </div>

      <table class="w-full border border-gray-300 text-sm">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-300 p-2">Nom</th>
            <th class="border border-gray-300 p-2">Prénom</th>
            <th class="border border-gray-300 p-2">Email</th>
            <th class="border border-gray-300 p-2">Téléphone</th>
            <th class="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clientStore.clients" :key="client.id" class="border-t">
            <td class="border border-gray-300 text-center p-2">{{ client.last_name }}</td>
            <td class="border border-gray-300 text-center p-2">{{ client.first_name }}</td>
            <td class="border border-gray-300 text-center p-2">{{ client.email }}</td>
            <td class="border border-gray-300 text-center p-2">{{ client.phone }}</td>
            <td class="border border-gray-300 text-center p-2">
              <button @click="viewClient(client)" title="Voir" class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="editClient(client)" title="Modifier" class="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteClient(client)" title="Supprimer" class="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Client -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h3 class="text-lg font-semibold mb-4">{{ isEditing ? "Modifier Client" : "Enregistrer Client" }}</h3>

        <div class="space-y-4">
          <select v-model="newClient.type" class="w-full border p-2 rounded-[15px]">
            <option value="">Type de Client</option>
            <option value="Physique">Physique</option>
            <option value="Moral">Moral</option>
          </select>

          <!-- Client Physique -->
          <div v-if="newClient.type === 'Physique'" class="space-y-3">
            <input v-model="newClient.last_name" type="text" placeholder="Nom" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.first_name" type="text" placeholder="Prénom" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.email" type="email" placeholder="Email" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.phone" type="text" placeholder="Téléphone" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.region" type="text" placeholder="Région" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.city" type="text" placeholder="Ville" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.country" type="text" placeholder="Pays" class="w-full border p-2 rounded-[15px]" />
          </div>

          <!-- Client Moral -->
          <div v-if="newClient.type === 'Moral'" class="space-y-3">
            <input v-model="newClient.companyName" type="text" placeholder="Raison Sociale" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.email" type="email" placeholder="Email" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.phone" type="text" placeholder="Téléphone" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.region" type="text" placeholder="Région" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.city" type="text" placeholder="Ville" class="w-full border p-2 rounded-[15px]" />
            <input v-model="newClient.country" type="text" placeholder="Pays" class="w-full border p-2 rounded-[15px]" />
          </div>
        </div>

        <div class="flex justify-end mt-4 gap-2">
          <button @click="resetForm" class="px-4 py-2 bg-red-300 rounded-[15px] hover:bg-red-700 hover:text-white">Annuler</button>
          <button @click="handleSave" class="px-4 py-2 bg-blue-600 text-white rounded-[15px] hover:bg-blue-900">
            {{ isEditing ? "Mettre à jour" : "Enregistrer" }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Affichage Client -->
<div v-if="showViewModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
    <h3 class="text-lg font-semibold mb-4">Informations Client</h3>

    <div class="space-y-2">
      <p><strong>Type :</strong> {{ selectedClient.type || selectedClient.client_type }}</p>
      <p v-if="selectedClient.type === 'Physique' || selectedClient.client_type === 'Physique'">
        <strong>Nom :</strong> {{ selectedClient.last_name }}<br>
        <strong>Prénom :</strong> {{ selectedClient.first_name }}
      </p>
      <p v-if="selectedClient.type === 'Moral' || selectedClient.client_type === 'Moral'">
        <strong>Raison Sociale :</strong> {{ selectedClient.company_name || selectedClient.companyName }}
      </p>
      <p><strong>Email :</strong> {{ selectedClient.email }}</p>
      <p><strong>Téléphone :</strong> {{ selectedClient.phone }}</p>
      <p><strong>Région :</strong> {{ selectedClient.region }}</p>
      <p><strong>Ville :</strong> {{ selectedClient.city }}</p>
      <p><strong>Pays :</strong> {{ selectedClient.country }}</p>
    </div>

    <div class="flex justify-end mt-4">
      <button @click="showViewModal = false" class="px-4 py-2 bg-red-300 rounded-[15px] hover:bg-red-700 hover:text-white">Fermer</button>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useClientStore } from '~/app/stores/sale/client'
import Swal from 'sweetalert2'

const clientStore = useClientStore()

const showModal = ref(false)
const isEditing = ref(false)
const clientId = ref(null)

const newClient = ref({
  type: '',
  first_name: '',
  last_name: '',
  companyName: '',
  email: '',
  phone: '',
  region: '',
  country: '',
  city: ''
})

// Charger les clients au montage
onMounted(() => {
  clientStore.fetchClients()
  clientStore.fetchStats()
})

// Ouvrir modal pour créer un client
const openModalForCreate = () => {
  resetForm()
  showModal.value = true
}

const selectedClient = ref(null)
const showViewModal = ref(false)

const viewClient = (client) => {
  selectedClient.value = client
  showViewModal.value = true
}

// Créer ou mettre à jour selon le mode
const handleSave = async () => {
  // Validation du type
  if (!newClient.value.type) {
    Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: 'Le type de client est requis !'
    })
    return
  }

  // Validation selon le type
  if (newClient.value.type === 'Physique') {
    if (!newClient.value.first_name || !newClient.value.last_name) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Le nom et prénom sont obligatoires pour un client physique.'
      })
      return
    }
  } else if (newClient.value.type === 'Moral') {
    if (!newClient.value.companyName) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'La raison sociale est obligatoire pour un client moral.'
      })
      return
    }
  }

  // Si tout est bon, enregistrer ou mettre à jour
  if (isEditing.value) {
    await updateClient()
  } else {
    await saveClient()
  }
}


// Enregistrer un nouveau client
const saveClient = async () => {
  try {
    const payload = { ...newClient.value }
    await clientStore.createClients(payload)
    Swal.fire({ icon: 'success', title: 'Succès', text: 'Client enregistré avec succès', timer: 2000, showConfirmButton: false })
    await clientStore.fetchClients()
    await clientStore.fetchStats()
    resetForm()
  } catch (error) {
    console.error(error)
    Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible d’enregistrer le client' })
  }
}

// Préparer le formulaire pour édition
const editClient = (client) => {
  isEditing.value = true
  showModal.value = true
  clientId.value = client.id
  newClient.value = {
    type: client.client_type || '',
    first_name: client.first_name || '',
    last_name: client.last_name || '',
    companyName: client.company_name || '',
    email: client.email || '',
    phone: client.phone || '',
    region: client.region || '',
    country: client.country || '',
    city: client.city || ''
  }
}

// Mettre à jour un client existant
const updateClient = async () => {
  try {
    const payload = {
      first_name: newClient.value.first_name,
      last_name: newClient.value.last_name,
      email: newClient.value.email,
      phone: newClient.value.phone,
      client_type: newClient.value.type,
      country: newClient.value.country,
      region: newClient.value.region,
      city: newClient.value.city,
      company_name: newClient.value.companyName
    }
  
    await clientStore.updateClient(clientId.value, payload)
    Swal.fire({ icon: 'success', title: 'Succès', text: 'Client modifié avec succès', timer: 2000, showConfirmButton: false })
    await clientStore.fetchClients()
    await clientStore.fetchStats()
    resetForm()
  } catch (error) {
    console.error(error)
    Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de modifier le client' })
  }
}

// Réinitialiser le formulaire
const resetForm = () => {
  newClient.value = {
    type: '',
    first_name: '',
    last_name: '',
    companyName: '',
    email: '',
    phone: '',
    region: '',
    country: '',
    city: ''
  }
  isEditing.value = false
  clientId.value = null
  showModal.value = false
}


</script>
