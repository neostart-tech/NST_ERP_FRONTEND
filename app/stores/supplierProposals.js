// filepath: c:\Users\jonas\Desktop\frontnuxt\stores\supplierProposals.js
import { defineStore } from 'pinia';

export const useSupplierProposalsStore = defineStore('supplierProposals', {
  state: () => ({
    proposals: [],
  }),
  actions: {
    addProposal(proposal) {
      this.proposals.push(proposal);
    },
    // setProposals(proposals) {
    //   this.proposals = proposals;
    // },
    async fetchProposals(){
      try{
        this.proposals=await $fetch('http://127.0.0.1:8000/api/supplier-proposals');

      }catch(error){
        console.error("Erreur lors de la récupération des propositions", error);
    
      }
    }
  },
});