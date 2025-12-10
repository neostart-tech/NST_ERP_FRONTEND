import { defineStore } from "pinia";

export const usePostStore=defineStore('post',{
    state: ()=>({
        posts:[] ,

    }),
    actions:{
        async fetchPost(){
            this.posts=await $fetch('/api/post')
        }
    }
})