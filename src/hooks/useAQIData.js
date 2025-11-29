import { useState, useEffect } from 'react';
import { fetchAQIData } from '../services/api';

export const useAQIData = (filters = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const apiParams = {};
                if (filters.state) apiParams['filters[state]'] = filters.state;
                if (filters.city) apiParams['filters[city]'] = filters.city;

                // If we have a station filter, use it
                if (filters.station) apiParams['filters[station]'] = filters.station;

                const result = await fetchAQIData(apiParams);
                setData(result.records || []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [filters.state, filters.city, filters.station]);

    return { data, loading, error };
};
