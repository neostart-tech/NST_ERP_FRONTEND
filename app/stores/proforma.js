import { defineStore } from "pinia";
 export const useProformaStore= defineStore('proforma',{
    state:()=>({
        proforma:[],
    }),
    actions:{
        async addProforma(payload){
            try{
                const response= await $fetch('http://127.0.0.1:8000/api/proforma',{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-type':'application/json',
                    },  
                    body:payload
                });
            }catch(error){
                console.error("Erreur d'enregistrement de facture",error);
            }
        },
         async fetchProforma(){
            try{
                this.proforma= await $fetch('http://127.0.0.1:8000/api/proforma');
            

            }catch(error){
                console.error("Erreur lors de l'affichage",error);
                
            }
         },
         async fetchProformaValidate(){
            try{
                this.proforma= await $fetch('http://127.0.0.1:8000/api/proforma/validated');
            

            }catch(error){
                console.error("Erreur lors de l'affichage",error);
                
            }
         },
         async updateStatus(id,status){
            try{
                await $fetch(`http://127.0.0.1:8000/api/proforma/${id}/status`,{
                    method:'PATCH',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    body:{status}   
                })
                 // Mise à jour locale sans rechargement
                const index = this.proforma.findIndex(p => p.id === id)
                if (index !== -1) {
                this.proforma[index].status = status
                }
            }catch(error){
                console.error("Erreur lors de la misa à jour du statut",error)

            }

         }  
    }
 })