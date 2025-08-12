import { defineStore } from "pinia";
export const useScheduleStore=defineStore('Echéancier',{
   state:()=>({
    echeancier:[],
   } ),
   actions:{
    async addSchedule(payload){
        try{
            const response=$fetch('http://127.0.0.1:8000/api/echeance',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:payload
            });
            return response;
        }catch(error){
            console.error("Erreur lors de l'enregistrement",error);
            throw error
        }
        
    },
    async fetchSchedule(){
        try{
            this.echeancier=await $fetch('http://127.0.0.1:8000/api/echeance')
        }catch(error){
            console.error("Erreur lors de l'affichage")
        }

    }
   }
})