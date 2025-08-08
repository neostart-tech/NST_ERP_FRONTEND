<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestion des Factures</h1>
     <NuxtLink :to="AppUrl.INVOICE" class="items-center px-6 py-3 font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 ">
      <i class="fas fa-add"> </i>  Nouvelle facture 
     </NuxtLink>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class=" flex gap-4 bg-indigo-100 p-4  justify-center rounded-lg shadow text-center">
        <i class="fas fa-file-invoice text-blue-600 text-2xl mb-2"></i><p class="text-center text-gray-500 text-sm">Total Factures</p>
        
      </div>
      <div class="flex gap-4 bg-green-100 p-4  justify-center rounded-lg shadow text-center">
        <i class="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
        <p class="text-gray-500 text-sm">Payées</p>
      
      </div>
      <div class="flex gap-4 bg-yellow-100 p-4 justify-center rounded-lg shadow text-center">
        <i class="fas fa-clock text-yellow-500 text-2xl mb-2"></i>
        <p class="text-gray-500 text-sm">En attente</p>
       
      </div>
      <div class="flex gap-4 bg-purple-100 p-4 justify-center rounded-lg shadow text-center">
        <i class="fas fa-xof-sign text-purple-600 text-2xl mb-2"></i>
        <p class="text-gray-500 text-sm">Montant Total</p>
       
      </div>
    </div>
    

    <!-- Tableau des factures -->
    <div class="bg-white shadow overflow-x-auto">
      <table class="w-full  border border-black text-sm">
        <thead class="bg-gray-50">
          <tr class="bg-gray-200">
            <th class=" border border-gray-500 px-4 py-2 text-center uppercase">Facture</th>
            <th class="border border-gray-500 px-4 py-2 text-center uppercase">Client</th>
            <th class="border border-gray-500 px-4 py-2 text-center uppercase">Montant TTC</th>
            <th class="border border-gray-500 px-4 py-2 text-center uppercase">Date</th>
            <th class="border border-gray-500 px-4 py-2 text-center uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoiceStore.facture" :key="invoice.id" :value="invoice.id" class=" bg-indigo-50 hover:bg-gray-50">
            <td class="border border-gray-500 text-center uppercase px-4 py-2">{{invoice.reference}}</td> 
            <td class="border border-gray-500 text-center uppercase px-4 py-2">{{invoice.order.client.first_name}} {{invoice.order.client.last_name}}</td>
            <td class="border border-gray-500 text-center uppercase px-4 py-2 font-semibold">{{ formatCurrency(invoice.total)}}</td>
            <td class="border border-gray-500 text-center uppercase px-4 py-2 font-semibold">{{invoice.date}}</td>
            <td class="border border-gray-300 px-4 py-2 text-center space-x-3 flex justify-center">
                <!-- Voir -->
                 <div class="relative group">
                    <button @click="viewInvoice(invoice)" class="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition duration-150 ease-in-out">
                        <i class="fas fa-eye"></i><span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Voir</span>
                    </button>
                 </div>
                <!-- Supprimer -->
                 <!-- <div class="relative group ">
                    <button @click="deleteFacture(invoice.id)" class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-150 ease-in-out">
                        <i class="fas fa-trash"></i><span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Supprimer</span>
                    </button>
                </div> -->
                <!-- Télécharger -->
                <div class="relative group">
                    <button @click="downloadFacture(invoice.id) "class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition duration-150 ease-in-out">
                    <i class="fas fa-download"></i></button>
                        <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">Télécharger facture(pdf)</span>
                </div>
            </td>
          </tr>
          
        </tbody>
      </table>
    </div>
  </div>
  <!-- Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-1/2 max-w-3xl relative">
      <h2 class="text-2xl font-bold mb-4">Détails de la facture</h2>
      <div class="mb-4">
        <p><strong>Référence :</strong> {{selectedInvoice.reference }}</p>
        <p><strong>Date :</strong> {{ selectedInvoice.date }}</p>
        <p><strong>Total TTC :</strong>{{ formatCurrency(selectedInvoice.total) }} </p>
      </div>

      <div class="mb-4">
        <h3 class="font-semibold text-lg mb-2">Informations client</h3>
        <p>{{ selectedInvoice.order.client.last_name }} {{ selectedInvoice.order.client.first_name }}</p>
      </div>

      <div v-if="selectedInvoice.order.proforma" class="mb-4">
        
        <h3 class="font-semibold text-lg mb-2">Proforma associée</h3>
        <p><strong>Référence :</strong> {{ selectedInvoice.order.proforma.reference }}</p>
        <p><strong>Objet :</strong> {{ selectedInvoice.order.proforma.object }}</p>
        <p><strong>Total HT :</strong> {{ formatCurrency(selectedInvoice.order.proforma.total_ht) }}</p>
        <p><strong>Total TTC :</strong> {{ formatCurrency(selectedInvoice.order.proforma.total_ttc) }}</p>
      </div>

      <div v-if="selectedInvoice.order.proforma.articles?.length" class="overflow-x-auto mt-4">
        <h3 class="font-semibold text-lg mb-2">Articles de la proforma</h3>
        <table class="min-w-full bg-white border">
          <thead>
            <tr class="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th class="py-2 px-4">Article</th>
              <th class="py-2 px-4">Description</th>
              <th class="py-2 px-4">Quantité</th>
              <th class="py-2 px-4">Prix unitaire</th>
              <th class="py-2 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in selectedInvoice.order.proforma.articles" :key="article.id" class="text-sm border-t">
              <td class="py-2 px-4">{{ article.label }}</td>
              <td class="py-2 px-4">{{ article.description }}</td>
              <td class="py-2 px-4">{{ article.pivot.quantity }}</td>
              <td class="py-2 px-4">{{ formatCurrency(article.pivot.unit_price) }}</td>
              <td class="py-2 px-4">
                {{ formatCurrency(article.pivot.quantity * article.pivot.unit_price) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-100 text-sm font-semibold">
              <td colspan="4" class="py-2 px-4 text-right">Total HT :</td>
              <td class="py-2 px-4">{{ formatCurrency(selectedInvoice.order.proforma.total_ht) }}</td>
            </tr>
            <tr class="text-sm font-semibold">
              <td colspan="4" class="py-2 px-4 text-right">Total TTC :</td>
              <td class="py-2 px-4">{{ formatCurrency(selectedInvoice.order.proforma.total_ttc) }}</td>
            </tr>
           
          </tfoot>
        </table>
      </div>

      <div v-else class="text-red-500 font-semibold mt-4">
        Aucune proforma associée à cette commande.
      </div>
      <div class="mt-6 text-right">
      <button @click="closeModal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow-sm">
        Fermer
      </button>
    </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInvoiceStore } from '#imports'
import { onMounted } from 'vue'

const selectedInvoice=ref()
const showModal=ref(false)


const invoiceStore=useInvoiceStore()
onMounted(()=> {
  invoiceStore.fetchInvoice()
  
} )

//Details de la facture
function viewInvoice(invoice){
  selectedInvoice.value=invoice
  showModal.value=true
}

function closeModal(){
 showModal.value=false
 selectedInvoice.value=null
}
 console.log('selectedInvoice')

const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')
const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)

</script>
