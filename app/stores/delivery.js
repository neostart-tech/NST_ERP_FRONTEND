import { defineStore } from "pinia";
export const useDeliveryStore=defineStore('livraison',{
    state:()=>({
        livraison:[]
    }),
    actions:{
        async addDelivery(payload){
            try{
                const response =await $fetch('http://127.0.0.1:8000/api/livraison',{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    body:payload
                })
              return response
            }catch(error){
                console.error("Erreur lors de l'enregistrement de la livraison")
                throw error
            }
        },
        async fetchDelivery(){
            try{
                this.livraison=await $fetch('http://127.0.0.1:8000/api/livraison')
            } catch(error){
                console.error("Erreur de l'affichafage",error)
            }
        }

    }
})