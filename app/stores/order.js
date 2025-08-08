import { defineStore } from "pinia";

export const useOrderStore=defineStore('commande',{
    state:()=>({
        commande:[],
        only:[],
    }),
    actions:{
        async addOrder(payload){
            try{
                const response=await $fetch('http://127.0.0.1:8000/api/order',{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                   },
                   body:payload,
                });
                return response; //Reponse pour la gesion dans la vue

            }catch(error){
                console.error("Erreur lors de l'enregistrement de la commande",error)
            }
        },

        async fetchOrder(){
            try{
                this.commande= await $fetch('http://127.0.0.1:8000/api/order')
            }catch(error){
                console.error("Erreur lors de l'affichage",error)
            }
            
        },
        async fetchOrderValidate(){
            try{
                this.commande= await $fetch('http://127.0.0.1:8000/api/order/validated')
            }catch(error){
                console.error("Erreur lors de l'affichage",error)
            }
            
        },
        async updateStatus(orderId,status){
            try{
                const response=await $fetch(`http://127.0.0.1:8000/api/order/${orderId}`,{
                    method:'PATCH',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    body:{status}
                })
                // ✅ Met à jour localement
                const order = this.commande.find(o => o.id === orderId)
                if (order) order.status = status
                return response

            }catch(error){
                console.error('Erreur lors de la mise à jour du statut',error)
                throw error
            }
        },
        async fetchOneOrder(orderId  ){
            try{
                this.only=await $fetch(`http://127.0.0.1:8000/api/order/${orderId}`)
                return this.only  // 

            }catch(error){
                console.error("Erreur lors de l'affichage des informations",error)
            }
        }
    }
})