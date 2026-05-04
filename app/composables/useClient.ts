export const useClient = () => {
    const { get } = useApi();
    const baseUrl = '/clients';

    const fetchClients = async () => {
        try {
            const response = await get(`${baseUrl}/displayClients`);
            return response.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    };

    return {
        fetchClients
    };
};

