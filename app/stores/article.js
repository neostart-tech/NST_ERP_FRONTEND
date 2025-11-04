import {defineStore} from 'pinia'
import {useNuxtApp} from '#app'
export const useArticleStore=defineStore('articles',{
    state:()=> ({
        articles:[],

    }),
    actions:{
        async fetchArticle(){
            try{
                this.articles=await $fetch('http://127.0.0.1:8000/api/article');

            }catch(error){
                console.error("Erreur de chargement des clients",error)
            }
        }

    }
});