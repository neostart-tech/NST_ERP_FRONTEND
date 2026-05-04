export const useIntervention = () => {
    const { get, post, put, del } = useApi();
    const baseUrl = '/interventions';

    const fetchInterventions = async () => {
        try {
            const response = await get(`${baseUrl}/displayInterventions`);
            return response.data;
        } catch (error) {
            console.error('Error fetching interventions:', error);
            throw error;
        }
    };

    const addIntervention = async (payload: any) => {
        try {
            const formData = new FormData();

            // Ajouter tous les champs du formulaire
            Object.keys(payload).forEach(key => {
                if (payload[key] !== null && payload[key] !== undefined) {
                    if (key === 'audio_file' && payload[key] instanceof File) {
                        formData.append(key, payload[key]);
                    } else if (key === 'signature' && typeof payload[key] === 'string') {
                        formData.append(key, payload[key]);
                    } else {
                        formData.append(key, payload[key]);
                    }
                }
            });

            const response = await post(`${baseUrl}/addIntervention`, formData);
            return response.data;
        } catch (error) {
            console.error('Error adding intervention:', error);
            throw error;
        }
    };

    const updateIntervention = async (id: number, payload: any) => {
        try {
            const formData = new FormData();

            // Ajouter tous les champs du formulaire
            Object.keys(payload).forEach(key => {
                if (payload[key] !== null && payload[key] !== undefined) {
                    if (key === 'audio_file' && payload[key] instanceof File) {
                        formData.append(key, payload[key]);
                    } else if (key === 'signature' && typeof payload[key] === 'string') {
                        formData.append(key, payload[key]);
                    } else {
                        formData.append(key, payload[key]);
                    }
                }
            });

            const response = await put(`${baseUrl}/updateIntervention/${id}`, formData);
            return response.data;
        } catch (error) {
            console.error('Error updating intervention:', error);
            throw error;
        }
    };

    const deleteIntervention = async (id: number) => {
        try {
            const response = await del(`${baseUrl}/deleteIntervention/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting intervention:', error);
            throw error;
        }
    };

    return {
        fetchInterventions,
        addIntervention,
        updateIntervention,
        deleteIntervention
    };
};

