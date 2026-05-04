export const useTechnician = () => {
    const { get } = useApi();
    const baseUrl = '/technicians';

    const fetchTechnicians = async () => {
        try {
            const response = await get(`${baseUrl}/displayTechnicians`);
            return response.data;
        } catch (error) {
            console.error('Error fetching technicians:', error);
            throw error;
        }
    };

    return {
        fetchTechnicians
    };
};