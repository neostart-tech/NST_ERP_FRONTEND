// stores/user.js - VERSION CORRIGÉE

import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async createUser(userData) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch('http://127.0.0.1:8000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
           'Accept': 'application/json',
          },
          body: JSON.stringify(userData),
        })

        if (!res.ok) {
          const err = await res.json()
          this.error = err
          throw new Error('Erreur lors de la création de l utilisateur.')
        }

        const createdUser = await res.json()
        return createdUser
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateUser(userId, userData) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(userData),
        })

        if (!res.ok) {
          const err = await res.json()
          this.error = err
          throw new Error('Erreur lors de la mise à jour de l utilisateur.')
        }

        const updatedUser = await res.json()
        return updatedUser
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchUsers() {
      try {
        this.users = await $fetch('http://127.0.0.1:8000/api/users')
      } catch (err) {
        console.error("Erreur lors de l'affichage", err)
        throw err
      }
    },

    // ✅ CORRECTION avec DEBUG : fetchUser maintenant DANS le bloc actions
    async fetchUser(id) {
      console.log('🟡 STORE: Début fetchUser avec ID:', id)
      this.loading = true
      this.error = null
      try {
        const url = `http://127.0.0.1:8000/api/users/${id}`
        console.log('🟡 STORE: URL appelée:', url)
        
        const response = await fetch(url)
        console.log('🟡 STORE: Statut de la réponse:', response.status)
        
        if (!response.ok) {
          console.error('❌ STORE: Réponse non OK:', response.status, response.statusText)
          throw new Error(`Utilisateur non trouvé - Status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('🟡 STORE: Données reçues:', data)
        
        // ✅ CORRECTION : Retourner directement user si la structure est { success: true, user: {...} }
        if (data.success && data.user) {
          console.log('✅ STORE: Utilisateur extrait:', data.user)
          return data.user
        } else if (data.user) {
          console.log('✅ STORE: Utilisateur trouvé (format alternatif):', data.user)
          return data.user
        } else {
          console.log('✅ STORE: Retour direct des données:', data)
          return data // Au cas où la structure change
        }
        
      } catch (error) {
        console.error('❌ STORE: Erreur dans fetchUser:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
        console.log('🟡 STORE: Fin fetchUser')
      }
    }
  }
})