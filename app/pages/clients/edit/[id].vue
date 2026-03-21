<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- En-tête -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Modifier le client</h1>
            <p class="text-gray-600">Mettez à jour les informations de votre client</p>
          </div>
          <button
            @click="$router.back()"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>

        <!-- Messages d'état -->
        <div v-if="clientStore.errors" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {{ clientStore.errors }}
        </div>

        <div v-if="message" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {{ message }}
        </div>
      </div>

      <!-- Formulaire -->
      <div v-if="!clientStore.isLoading && form" class="bg-white rounded-2xl shadow-xl p-6">
        <form @submit.prevent="submitForm">
          <!-- Informations de base -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                <input
                  v-model="form.name"
                  type="text"
                  id="name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="client_type" class="block text-sm font-medium text-gray-700 mb-2">Type de client *</label>
                <select
                  v-model="form.client_type"
                  id="client_type"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
                  <option value="Particulier">Particulier</option>
                  <option value="Entreprise">Entreprise</option>
                  <option value="Organisation">Organisation</option>
                </select>
              </div>

              <div v-if="form.client_type !== 'Particulier'">
                <label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
                <input
                  v-model="form.company_name"
                  type="text"
                  id="company_name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  id="phone"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>
            </div>
          </div>

          <!-- Adresse -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Adresse</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                <input
                  v-model="form.country"
                  type="text"
                  id="country"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="region" class="block text-sm font-medium text-gray-700 mb-2">Région *</label>
                <input
                  v-model="form.region"
                  type="text"
                  id="region"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>

              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                <input
                  v-model="form.city"
                  type="text"
                  id="city"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                >
              </div>
            </div>
          </div>

          <!-- Contacts -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Contacts *</h2>
              <button
                type="button"
                @click="addContact"
                class="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un contact
              </button>
            </div>

            <div v-for="(contact, index) in form.client_contacts" :key="index" class="bg-gray-50 p-4 rounded-lg mb-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-medium text-gray-900">Contact {{ index + 1 }}</h3>
                <button
                  type="button"
                  @click="removeContact(index)"
                  class="text-red-600 hover:text-red-700"
                  v-if="form.client_contacts.length > 1"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label :for="`contact_name_${index}`" class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    v-model="contact.name"
                    type="text"
                    :id="`contact_name_${index}`"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                </div>

                <div>
                  <label :for="`contact_role_${index}`" class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                  <input
                    v-model="contact.role"
                    type="text"
                    :id="`contact_role_${index}`"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                </div>

                <div>
                  <label :for="`contact_email_${index}`" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    v-model="contact.email"
                    type="email"
                    :id="`contact_email_${index}`"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                </div>

                <div>
                  <label :for="`contact_phone_${index}`" class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    v-model="contact.phone"
                    type="tel"
                    :id="`contact_phone_${index}`"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="$router.back()"
              class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Mettre à jour</span>
              <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <!-- Squelette de chargement -->
      <div v-if="clientStore.isLoading" class="bg-white rounded-2xl shadow-xl p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-gray-200 rounded w-1/3"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useClientStore } from '@/stores/ClientStore.ts';
import { onMounted, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const clientStore = useClientStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const message = ref('');
const form = reactive({
  name: '',
  client_type: 'Particulier',
  company_name: '',
  email: '',
  phone: '',
  country: '',
  region: '',
  city: '',
  salesman_id: null,
  client_contacts: [
    {
      name: '',
      role: '',
      email: '',
      phone: ''
    }
  ]
});

// Charger les données du client
onMounted(async () => {
  try {
    await clientStore.fetchClient(route.params.id);

    if (clientStore.currentClient) {
      // Mapper les données du client vers le formulaire
      Object.assign(form, {
        name: clientStore.currentClient.name,
        client_type: clientStore.currentClient.client_type,
        company_name: clientStore.currentClient.company_name || '',
        email: clientStore.currentClient.email,
        phone: clientStore.currentClient.phone,
        country: clientStore.currentClient.country,
        region: clientStore.currentClient.region,
        city: clientStore.currentClient.city,
        salesman_id: clientStore.currentClient.salesman_id,
        client_contacts: clientStore.currentClient.contacts && clientStore.currentClient.contacts.length > 0
          ? clientStore.currentClient.contacts
          : [{ name: '', role: '', email: '', phone: '' }]
      });
    }
  } catch (error) {
    console.error('Erreur lors du chargement du client:', error);
  }
});

// Ajouter un contact
const addContact = () => {
  form.client_contacts.push({
    name: '',
    role: '',
    email: '',
    phone: ''
  });
};

// Supprimer un contact
const removeContact = (index) => {
  if (form.client_contacts.length > 1) {
    form.client_contacts.splice(index, 1);
  }
};

// Soumettre le formulaire
const submitForm = async () => {
  loading.value = true;
  clientStore.clearError();
  message.value = '';

  try {
    await clientStore.updateClient({
      id: route.params.id,
      clientData: form
    });

    message.value = 'Client mis à jour avec succès';

    // Redirection après un délai
    setTimeout(() => {
      router.push('/clients');
    }, 1500);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Styles pour les transitions */
input, select {
  transition: all 0.2s ease;
}

button {
  transition: all 0.2s ease;
}

/* Animation pour l'apparition des messages */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
