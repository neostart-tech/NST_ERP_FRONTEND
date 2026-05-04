export const useEquipmentStore = defineStore('Equipment', {
    state: () => ({
        equipments: [],
        loading: false,
        appURL:"http://127.0.0.1:8000/api",
    }),

    actions: {
        async fetchEquipments() {
            try {
                  this.equipments= await $fetch(`${this.appURL}/displayEquipments`);
              
            } catch (error) {
                console.error("Error fetching equipments: - equipmentStore.js:14", error);
            }
        },

        async addEquipment(payload) {
            try {
                const response = await $fetch(`${this.appURL}/addequipments`, {
                    method: 'POST',

                    body: payload   
                });
                this.equipments.push(response.data);
            } catch (error) {
                console.error("Error adding equipment: - equipmentStore.js:27", error);
            } finally {
                this.loading = false;
            }
        },
             async updateEquipment(id, formData) {
    this.loading = true;
    try {
        const response = await $fetch(`${this.appURL}/updateEquipments/${id}`, {
            method: 'PUT',
            body: formData
        });
        const index = this.equipments.findIndex(e => e.id === id);
        if (index !== -1) {
            this.equipments[index] = response.data;
        }
    } catch (error) {
        console.error("Error updating equipment: - equipmentStore.js:44", error);
    } finally {
        this.loading = false;
    }
},
   
       

        async deleteEquipment(id) {
            this.loading = true;
            try {
    
                await $fetch(`${this.appURL}/deleteEquipments/${id}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error("Error deleting equipment: - equipmentStore.js:60", error);
            } finally {
                this.loading = false;
            }
        },

    }
});