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
        },
        async downloadDelivery(delivery){
            try{
                window.open(`http://127.0.0.1:8000/api/livraison/download/${delivery.id}`,'_blank')//Affichage 
                // const res=await fetch(`http://127.0.0.1:8000/api/livraison/download/${delivery.id}`)
                // const blob= await res.blob()
                // const urlBlob=window.URL.createObjectURL(blob)
                // window.open(urlBlob,'_blank) //Ouvrir avant de telecharger
                // const a = document.createElement('a')
                // a.href=urlBlob
                // a.download=`livraison${delivery.id}.pdf`
                // a.click()
                // window.URL.revokeObjectURL(urlBlob)

            }catch(error){
                console.error("Erreur lors du téléchargement",error)
            }
        }

    }
})