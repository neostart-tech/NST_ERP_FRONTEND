export const useEquipment = () => {
    const { get } = useApi();
    const baseUrl = '/equipments';

    const fetchEquipments = async () => {
        try {
            const response = await get(`${baseUrl}/displayEquipments`);
            return response.data;
        } catch (error) {
            console.error('Error fetching equipments:', error);
            throw error;
        }
    };

    return {
        fetchEquipments
    };
};

