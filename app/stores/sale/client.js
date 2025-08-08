import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
export const useClientStore = defineStore("client", {
  state: () => ({
    loading: false,
    clients: [],
    stat:{
      total:0,
      physique:0, 
      moral:0
    }
  }),
  actions: {
    async fetchClients() {
      try {
        // this.loading = true;
        this.clients = await $fetch("http://127.0.0.1:8000/api/client");

        // this.loading = false;
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
      }
    },
    async fetchStats(){
      try{
        this.stat=await $fetch('http://127.0.0.1:8000/api/customers/stats');
      }catch(error){
        console.error('Erreur lors du chargement des statistiques',error);

      }
    }
    
  }

 
});
