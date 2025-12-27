// stores/user.js - VERSION COMPLÈTE ET CORRIGÉE

import { defineStore } from 'pinia'

export const _useUserStore = defineStore('user', {
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
          throw new Error('Erreur lors de la création de l\'utilisateur.')
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
            'Accept': 'application/json',
          },
          body: JSON.stringify(userData),
        })

        if (!res.ok) {
          const err = await res.json()
          this.error = err
          throw new Error('Erreur lors de la mise à jour de l\'utilisateur.')
        }

        const updatedUser = await res.json()
        
        // Mettre à jour l'utilisateur dans la liste locale
        const index = this.users.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...updatedUser.user }
        }
        
        return updatedUser
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users')
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Gestion des différentes structures de réponse
        this.users = Array.isArray(data) ? data : (data.users || data.data || [])
        
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error)
        this.error = error.message
        this.users = []
      } finally {
        this.loading = false
      }
    },

    async fetchUser(id) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${id}`)
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        return data.user || data
        
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // NOUVELLE MÉTHODE: Désactiver un utilisateur
    async deactivateUser(userId) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}/deactivate`, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!res.ok) {
          const err = await res.json()
          this.error = err
          throw new Error('Erreur lors de la désactivation de l\'utilisateur.')
        }

        const result = await res.json()
        
        // Mettre à jour l'utilisateur dans la liste locale
        const index = this.users.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.users[index].is_active = false
        }
        
        return result
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    // Méthode activateUser existante (à garder)
    async activateUser(userId) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}/activate`, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!res.ok) {
          const err = await res.json()
          this.error = err
          throw new Error('Erreur lors de l\'activation de l\'utilisateur.')
        }

        const result = await res.json()
        
        // Mettre à jour l'utilisateur dans la liste
        const index = this.users.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.users[index].is_active = true
        }
        
        return result
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    // NOUVELLE MÉTHODE: Supprimer un utilisateur
    async deleteUser(userId) {
      this.loading = true
      this.error = null
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!res.ok) {
          const err = await res.json()
          this.error = err
          throw new Error('Erreur lors de la suppression de l\'utilisateur.')
        }

        const result = await res.json()
        
        // Retirer l'utilisateur de la liste locale
        this.users = this.users.filter(u => u.id !== userId)
        
        return result
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})