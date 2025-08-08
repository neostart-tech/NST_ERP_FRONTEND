import { defineStore } from "pinia";

export const useInvoiceStore=defineStore('facture',{
    state:()=> ({
        facture:[]
    }),
    actions:{
         async addInvoice(payload){
            try{
                const response=await $fetch('http://127.0.0.1:8000/api/invoice',{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-type':'application/json',
                    },
                    body:payload
                })
                return response

            }catch(error){
                console.error("Erreur lors de l'enregistrement",error)
            }
         },
         async fetchInvoice(){
            try{
                this.facture=await $fetch('http://127.0.0.1:8000/api/invoice')

            }catch(error){
                console.error("Erreur lors de l'affichage de la facture")
            }
         }
    }
})