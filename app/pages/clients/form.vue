<template>
  <main class="flex-1 p-6 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- En-tête -->
      <div class="bg-sky-600 px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Nouveau Client</h2>
        <router-link 
          to="/clients"
          class="text-white hover:text-gray-200 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </router-link>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <!-- Section Informations Client -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-2">Informations Client</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom du client*</label>
              <input
                v-model="client.name"
                type="text"
                required
                :class="{'border-red-500': errors.client.name}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <span v-if="errors.client.name" class="text-red-500 text-xs mt-1">{{ errors.client.name }}</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type de client*</label>
              <select
                v-model="client.client_type"
                required
                :class="{'border-red-500': errors.client.client_type}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="">Sélectionner un type</option>
                <option value="Particulier">Particulier</option>
                <option value="Entreprise">Entreprise</option>
                <option value="Organisation">Organisation</option>
              </select>
              <span v-if="errors.client.client_type" class="text-red-500 text-xs mt-1">{{ errors.client.client_type }}</span>
            </div>

            <div v-if="client.client_type === 'Entreprise'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
              <input
                v-model="client.company_name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input
                v-model="client.email"
                type="email"
                required
                :class="{'border-red-500': errors.client.email}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <span v-if="errors.client.email" class="text-red-500 text-xs mt-1">{{ errors.client.email }}</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
              <input
                v-model="client.phone"
                type="tel"
                required
                :class="{'border-red-500': errors.client.phone}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <span v-if="errors.client.phone" class="text-red-500 text-xs mt-1">{{ errors.client.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Section Adresse -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-2">Adresse</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pays*</label>
              <select
                v-model="client.country"
                required
                :class="{'border-red-500': errors.client.country}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="">Sélectionner un pays</option>
                <option value="Togo">Togo</option>
                <option value="Bénin">Bénin</option>
                <option value="Ghana">Ghana</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              </select>
              <span v-if="errors.client.country" class="text-red-500 text-xs mt-1">{{ errors.client.country }}</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Région*</label>
              <input
                v-model="client.region"
                type="text"
                required
                :class="{'border-red-500': errors.client.region}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <span v-if="errors.client.region" class="text-red-500 text-xs mt-1">{{ errors.client.region }}</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ville*</label>
              <input
                v-model="client.city"
                type="text"
                required
                :class="{'border-red-500': errors.client.city}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <span v-if="errors.client.city" class="text-red-500 text-xs mt-1">{{ errors.client.city }}</span>
            </div>
          </div>
        </div>

        <!-- Section Contacts -->
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800">Personnes à contacter</h3>
            <button
              type="button"
              @click="addContact"
              class="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Ajouter un contact
            </button>
          </div>

          <div v-for="(contact, index) in client.contacts" :key="index" class="border border-gray-200 rounded-lg p-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                <input
                  v-model="contact.name"
                  type="text"
                  required
                  :class="{'border-red-500': errors.contacts[index]?.name}"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <span v-if="errors.contacts[index]?.name" class="text-red-500 text-xs mt-1">{{ errors.contacts[index].name }}</span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rôle dans l'entreprise</label>
                <input
                  v-model="contact.role"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="contact.email"
                  type="email"
                  :class="{'border-red-500': errors.contacts[index]?.email}"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <span v-if="errors.contacts[index]?.email" class="text-red-500 text-xs mt-1">{{ errors.contacts[index].email }}</span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  v-model="contact.phone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="button"
              @click="removeContact(index)"
              class="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Supprimer ce contact
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <router-link
            to="/clients"
            class="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Annuler
          </router-link>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2.5 bg-sky-600 text-white font-medium rounded-lg shadow hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Enregistrement en cours...</span>
            <span v-else>Enregistrer le client</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '../../stores/client'


const router = useRouter()

const clientStore=useClientStore()
const client = ref({
  name: '',
  client_type: '',
  country: '',
  region: '',
  city: '',
  email: '',
  phone: '',
  company_name: '',
  salesman_id: '',
  contacts: []
})

const errors = ref({
  client: {},
  contacts: []
})

const isLoading = ref(false)

const addContact = () => {
  client.value.contacts.push({
    name: '',
    role: '',
    email: '',
    phone: ''
  })
  errors.value.contacts.push({})
}

const removeContact = (index) => {
  client.value.contacts.splice(index, 1)
  errors.value.contacts.splice(index, 1)
}

const validateForm = () => {
  let isValid = true
  errors.value = { client: {}, contacts: [] }

  // Validation client
  if (!client.value.name.trim()) {
    errors.value.client.name = 'Le nom est requis'
    isValid = false
  }

  if (!client.value.client_type) {
    errors.value.client.client_type = 'Le type de client est requis'
    isValid = false
  }

  if (!client.value.email.trim()) {
    errors.value.client.email = 'L\'email est requis'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(client.value.email)) {
    errors.value.client.email = 'Email invalide'
    isValid = false
  }

  if (!client.value.phone.trim()) {
    errors.value.client.phone = 'Le téléphone est requis'
    isValid = false
  }

  if (!client.value.country) {
    errors.value.client.country = 'Le pays est requis'
    isValid = false
  }

  if (!client.value.region.trim()) {
    errors.value.client.region = 'La région est requise'
    isValid = false
  }

  if (!client.value.city.trim()) {
    errors.value.client.city = 'La ville est requise'
    isValid = false
  }

  // Validation des contacts
  client.value.contacts.forEach((contact, index) => {
    errors.value.contacts[index] = {}
    
    if (!contact.name.trim()) {
      errors.value.contacts[index].name = 'Le nom est requis'
      isValid = false
    }
    
    if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
      errors.value.contacts[index].email = 'Email invalide'
      isValid = false
    }
  })

  return isValid
}

const submitForm = async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  isLoading.value = true

  try {
    // Ajoutez salesman_id si nécessaire (par exemple depuis le store Pinia)
    const payload = {
      name:client.value.name,
      client_type:client.value.client_type,
      company_name:client.value.company_name ?? null,
      email:client.value.email,
      phone:client.value.phone,
      country:client.value.country,
      region:client.value.region,
      city:client.value.city,     
      client_contacts: client.value.contacts,
      salesman_id: "0198851a-39af-7371-bf71-c277b2f9a15c",
    };

    const response = await fetch('http://127.0.0.1:8000/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Si vous utilisez l'authentification :
        // 'Authorization': `Bearer ${localStorage.getItem('token-col')}`
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Gestion des erreurs de validation Laravel
      if (data.errors) {
        // Réinitialiser les erreurs
        errors.value = { client: {}, contacts: [] };
        
        // Traiter les erreurs du client
        for (const [field, messages] of Object.entries(data.errors)) {
          if (field.startsWith('client_contacts.')) {
            // Erreurs pour les contacts
            const parts = field.split('.');
            const contactIndex = parseInt(parts[1]);
            const contactField = parts[2];
            
            if (!errors.value.contacts[contactIndex]) {
              errors.value.contacts[contactIndex] = {};
            }
            errors.value.contacts[contactIndex][contactField] = messages[0];
          } else {
            // Erreurs pour le client
            errors.value.client[field] = messages[0];
          }
        }
      }
      throw new Error(data.message || 'Erreur lors de la création du client');
    }

    // Succès - redirection avec message
    router.push({
      path: '/clients',
      query: { success: 'Client créé avec succès' }
    });
  } catch (error) {
    console.error('Erreur:', error);
    alert(`Erreur: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
input, select {
  transition: all 0.2s ease;
}
</style>