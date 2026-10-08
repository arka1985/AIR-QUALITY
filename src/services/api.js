import axios from 'axios';
import { mockAQIData } from './mockData';

const API_KEY = '579b464db66ec23bdd00000110fade4c7b7240d551e6727d99c0993a';
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
        console.error("Error fetching AQI data (falling back to mock data):", error);
        
        let filteredRecords = [];
        if (mockAQIData && Array.isArray(mockAQIData.records)) {
            filteredRecords = [...mockAQIData.records];
            
            if (params['filters[state]']) {
                filteredRecords = filteredRecords.filter(r => r.state === params['filters[state]']);
            }
            if (params['filters[city]']) {
                filteredRecords = filteredRecords.filter(r => r.city === params['filters[city]']);
            }
            if (params['filters[station]']) {
                filteredRecords = filteredRecords.filter(r => r.station === params['filters[station]']);
            }
        }

        return {
            ...(mockAQIData || {}),
            records: filteredRecords
        };
    }
};
