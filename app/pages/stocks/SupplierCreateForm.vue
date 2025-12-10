<template>
<div class="max-w-4xl mx-auto">
    <!-- En-tête avec le nouveau style -->
    <div class="bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden mb-8 relative">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
        <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full"></div>
        <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
      </div>

      <div class="relative z-10">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 class="text-3xl font-bold mb-2">1er formulaire fournisseur</h1>
            <p class="text-sky-100 text-lg">Saisissez les infos des fournisseurs</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="supplier-form">
  

    <form @submit.prevent="createSupplier">
      <div class="form-group">
        <label>Nom du fournisseur *</label>
        <input v-model="form.name" type="text" required />
      </div>

      <div class="form-group">
        <label>Personne de contact</label>
        <input v-model="form.contact_person" type="text" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" />
      </div>

      <div class="form-group">
        <label>Téléphone</label>
        <input v-model="form.phone" type="text" />
      </div>

      <div class="form-group">
        <label>Adresse</label>
        <input v-model="form.address" type="text" />
      </div>

      <div class="form-group">
        <label>Ville</label>
        <input v-model="form.city" type="text" />
      </div>

      <div class="form-group">
        <label>Pays</label>
        <input v-model="form.country" type="text" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Enregistrement..." : "Créer le fournisseur" }}
      </button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  name: "SupplierCreateForm",
  setup() {
    const form = ref({
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
    });

    const loading = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");

    const createSupplier = async () => {
      loading.value = true;
      successMessage.value = "";
      errorMessage.value = "";

      try {
        const response = await axios.post("/api/suppliers", form.value);
        successMessage.value = `Fournisseur "${response.data.name}" créé avec succès !`;
        
        // Réinitialiser le formulaire
        form.value = {
          name: "",
          contact_person: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
        };
      } catch (error) {
        if (error.response && error.response.data.errors) {
          errorMessage.value = Object.values(error.response.data.errors)
            .flat()
            .join(", ");
        } else {
          errorMessage.value = "Erreur lors de la création du fournisseur.";
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      successMessage,
      errorMessage,
      createSupplier,
    };
  },
};
</script>

<style scoped>
.supplier-form {
  max-width: 500px;
  margin: auto;
  padding: 15px;
  background: #f7f7f7;
  border-radius: 6px;
}
.form-group {
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  background: #1d72b8;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #aaa;
}
.success {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
