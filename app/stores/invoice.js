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
         },
         async downloadInvoice(invoice){
            try{
                window.open(`http://127.0.0.1:8000/api/invoice/download/${invoice.id}`,'_blank')
            //   const res=await fetch(`http://127.0.0.1:8000/api/invoice/download/${invoice.id}`)
            //   const blob =await res.blob()
            //   const urlBlob=window.URL.createObjectURL(blob)
            //   const a = document.createElement('a')
            //   a.href=urlBlob
            //   a.download=`invoice_${invoice.id}.pdf`
            //   a.click()
            //   window.URL.revokeObjectURL(urlBlob)

            }catch(error){
                console.error("Erreur lors du téléchargement de la facture")

            }
         }
    }
})
