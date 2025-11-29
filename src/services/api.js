import axios from 'axios';

const API_KEY = '579b464db66ec23bdd000001d1e83b7bc07d44656e93faae08238354';
const BASE_URL = 'https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';

export const fetchAQIData = async (params = {}) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                'api-key': API_KEY,
                format: 'json',
                limit: 2000,
                ...params
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        throw error;
    }
};
