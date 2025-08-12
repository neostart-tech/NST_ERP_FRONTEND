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

         } ,
        async downloadProforma(proforma){
            try {
                window.open(`http://localhost:8000/api/proforma/download/${proforma.id}`, '_blank')
                // const res = await fetch(`http://localhost:8000/api/proforma/download/${proforma.id}`)
                // const blob = await res.blob()
                // const urlBlob = window.URL.createObjectURL(blob)
                // const a = document.createElement('a')
                // a.href = urlBlob
                // a.download = `proforma_${proforma.reference}.pdf`
                // a.click()
                //  window.URL.revokeObjectURL(urlBlob)
             } catch (error) {
            console.error('Erreur lors du téléchargement du PDF', error)
            }
        
        }
    }
 })