import { defineStore } from "pinia";
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
    async createClients(payload){
      try{
        const response=await $fetch('http://127.0.0.1:8000/api/client',{
          method:'POST',
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
          },
          body:payload
        })
        return response

      }catch(error){
        console.error("Erreur",error);
     
      }
    },

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
        this.stat=await $fetch('http://127.0.0.1:8000/api/client/stats');
      }catch(error){
        console.error('Erreur lors du chargement des statistiques',error);

      }
    },
    async updateClient(clientId, payload){
      try{
        const response=await $fetch(`http://127.0.0.1:8000/api/client/${clientId}`,{
          method:'PUT',
          headers:{
            'Accept':'appliction/json',
            'Content-Type':'applicaton/json'
          },
          body:payload
        })

      }catch(error){
        console.error("Erreur lors de la mise à jour")
      }
    }

    
  }

 
});
