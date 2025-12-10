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
            <h1 class="text-3xl font-bold mb-2">Proposition de prix et infos fournisseur</h1>
            <p class="text-sky-100 text-lg">Saisissez les propositions de prix et informations des fournisseurs</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="max-w-4xl mx-auto bg-white shadow-md p-8 rounded-xl">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Soumettre une proposition de prix</h2>

    <form @submit.prevent="submitProposal">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sélection produit -->
        <div>
          <label class="block mb-1 font-medium">Produit</label>
          <select v-model="form.product_id" class="w-full input" required>
            <option value="" disabled>-- Choisir un produit --</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>

        <!-- Sélection fournisseur -->
        <div>
          <label class="block mb-1 font-medium">Fournisseur</label>
          <select v-model="form.supplier_id" class="w-full input" required>
            <option value="" disabled>-- Choisir un fournisseur --</option>
            <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
              {{ supplier.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1 font-medium">Pays</label>
          <input v-model="form.country" type="text" class="w-full input" required>
        </div>

        <div>
          <label class="block mb-1 font-medium">Ville</label>
          <input v-model="form.city" type="text" class="w-full input" required>
        </div>

        <div>
          <label class="block mb-1 font-medium">Téléphone</label>
          <input v-model="form.phone" type="tel" class="w-full input" required>
        </div>

        <div>
          <label class="block mb-1 font-medium">Date de la proposition</label>
          <input v-model="form.proposal_date" type="date" class="w-full input" required>
        </div>

        <div>
          <label class="block mb-1 font-medium">Prix unitaire (FCFA)</label>
          <input v-model.number="form.unit_price" type="number" step="0.01" class="w-full input" required>
        </div>

        <div>
          <label class="block mb-1 font-medium">Condition de paiement</label>
          <input v-model="form.payment_condition" type="text" class="w-full input">
        </div>

        <div>
          <label class="block mb-1 font-medium">Type de transport</label>
          <select v-model="form.transport_type" class="w-full input">
            <option value="">-- Choisir --</option>
            <option value="air">Aérien</option>
            <option value="sea">Maritime</option>
            <option value="land">Terrestre</option>
          </select>
        </div>

        <div>
          <label class="block mb-1 font-medium">Coût transport/unité (FCFA)</label>
          <input v-model.number="form.transport_cost_per_unit" type="number" step="0.01" class="w-full input">
        </div>

        <div>
          <label class="block mb-1 font-medium">Coût douane/unité (FCFA)</label>
          <input v-model.number="form.customs_cost_per_unit" type="number" step="0.01" class="w-full input">
        </div>

        <div>
          <label class="block mb-1 font-medium">Coût de revient total/unité (FCFA)</label>
          <input :value="totalCostPerUnit" type="number" class="w-full input bg-gray-100" readonly>
        </div>

        <div class="md:col-span-2">
          <label class="block mb-1 font-medium">Commentaires</label>
          <textarea v-model="form.comments" class="w-full input" rows="3"></textarea>
        </div>
      </div>

      <button type="submit" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Envoyer la proposition
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      suppliers: [],
      products: [],
      form: {
        product_id: '',
        supplier_id: '',
        country: '',
        city: '',
        phone: '',
        proposal_date: '',
        unit_price: 0,
        payment_condition: '',
        transport_type: '',
        transport_cost_per_unit: 0,
        customs_cost_per_unit: 0,
        comments: '',
      },
    };
  },
  computed: {
    totalCostPerUnit() {
      const unit = parseFloat(this.form.unit_price || 0);
      const transport = parseFloat(this.form.transport_cost_per_unit || 0);
      const customs = parseFloat(this.form.customs_cost_per_unit || 0);
      return (unit + transport + customs).toFixed(2);
    },
  },
  methods: {
    async fetchSuppliers() {
      try {
        const response = await axios.get('/api/suppliers');
        this.suppliers = response.data;
      } catch (error) {
        console.error('Erreur chargement fournisseurs:', error);
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Erreur chargement produits:', error);
      }
    },
    async submitProposal() {
      if (!this.form.supplier_id || !this.form.product_id) {
        alert('Veuillez sélectionner un produit et un fournisseur.');
        return;
      }

      // On crée le payload à partir du formulaire
      const payload = {
        ...this.form,
        total_cost_of_return_per_unit: this.totalCostPerUnit
      };

      try {
        await axios.post('/api/supplier-proposals', payload);
        alert('Proposition soumise avec succès !');
        this.resetForm();
      } catch (error) {
        console.error(error);
        alert("Erreur lors de l'envoi de la proposition.");
      }
    },
    resetForm() {
      this.form = {
        product_id: '',
        supplier_id: '',
        country: '',
        city: '',
        phone: '',
        proposal_date: '',
        unit_price: 0,
        payment_condition: '',
        transport_type: '',
        transport_cost_per_unit: 0,
        customs_cost_per_unit: 0,
        comments: '',
      };
    },
  },
  mounted() {
    this.fetchSuppliers();
    this.fetchProducts();
  },
};
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
</style>
