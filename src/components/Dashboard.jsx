import { useState, useMemo } from 'react';
import { useAQIData } from '../hooks/useAQIData';
import FilterBar from './FilterBar';
import StationCard from './StationCard';
import MapComponent from './MapComponent';
import { Loader } from 'lucide-react';
import * as turf from '@turf/turf';

const getAQIColorHex = (value) => {
    const v = parseInt(value);
    if (isNaN(v)) return '#9ca3af'; // gray-400
    if (v <= 50) return '#4ade80'; // green-400
    if (v <= 100) return '#facc15'; // yellow-400
    if (v <= 200) return '#fb923c'; // orange-400
    if (v <= 300) return '#f87171'; // red-400
    if (v <= 400) return '#c084fc'; // purple-400
    return '#dc2626'; // red-600
};

const Dashboard = () => {
    const [filters, setFilters] = useState({ state: '', city: '' });
    const { data, loading, error } = useAQIData({ state: filters.state });

    // Group data by station and enrich with derived PM2.5 logic
    const stations = useMemo(() => {
        if (!data) return {};

        // First pass: Group by station
        const grouped = data.reduce((acc, record) => {
            if (!acc[record.station]) {
                acc[record.station] = {
                    station: record.station,
                    city: record.city,
                    state: record.state,
                    last_update: record.last_update,
                    pollutants: [],
                    lat: parseFloat(record.latitude),
                    lng: parseFloat(record.longitude)
                };
            }
            acc[record.station].pollutants.push(record);
            return acc;
        }, {});

        const stationList = Object.values(grouped);
        const validStations = stationList.filter(s => !isNaN(s.lat) && !isNaN(s.lng));

        // Create a Turf feature collection of stations WITH PM2.5
        const stationsWithPM25 = validStations.filter(s =>
            s.pollutants.some(p => p.pollutant_id === 'PM2.5' && !isNaN(parseInt(p.avg_value)))
        ).map(s => turf.point([s.lng, s.lat], {
            pm25: parseInt(s.pollutants.find(p => p.pollutant_id === 'PM2.5').avg_value)
        }));

        const stationsCollection = turf.featureCollection(stationsWithPM25);

        // Second pass: Enrich each station
        return stationList.map(station => {
            const pm25Record = station.pollutants.find(p => p.pollutant_id === 'PM2.5');
            const pm10Record = station.pollutants.find(p => p.pollutant_id === 'PM10');

            let displayValue = null;
            let isDerived = false;
            let hasRealTimeData = false;

            // Priority 1: PM 2.5
            if (pm25Record && !isNaN(parseInt(pm25Record.avg_value))) {
                displayValue = parseInt(pm25Record.avg_value);
                hasRealTimeData = true;
            }
            // Priority 2: PM 10
            else if (pm10Record && !isNaN(parseInt(pm10Record.avg_value))) {
                displayValue = parseInt(pm10Record.avg_value);
                hasRealTimeData = true;
            }

            // Priority 3: Nearest PM 2.5 (Derived)
            if ((displayValue === null || isNaN(displayValue)) && stationsCollection.features.length > 0 && !isNaN(station.lat) && !isNaN(station.lng)) {
                // Find nearest station with PM2.5
                const targetPoint = turf.point([station.lng, station.lat]);
                const nearest = turf.nearestPoint(targetPoint, stationsCollection);
                if (nearest) {
                    displayValue = nearest.properties.pm25;
                    isDerived = true;
                }
            }

            return {
                ...station,
                displayPM25: displayValue, // Keeping key name for compatibility
                isDerived,
                hasRealTimeData,
                displayColor: getAQIColorHex(displayValue) // Will return gray if displayValue is null
            };
        });

    }, [data]);

    const filteredStations = useMemo(() => {
        let result = stations;
        // Filter by City if selected
        if (filters.city) {
            result = result.filter(s => s.city === filters.city);
        } else {
            // If no city selected, we still want to filter by state (already done in API hook, but good for safety)
            // The API hook returns data for the selected state.
        }
        return result;
    }, [stations, filters.city]);

    // Extract unique cities for the current state data
    const availableCities = useMemo(() => {
        if (!stations.length) return [];
        const cities = new Set(stations.map(s => s.city));
        return Array.from(cities).sort();
    }, [stations]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen flex flex-col">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    AIR QUALITY <span className="text-blue-100 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">INDIA</span>
                </h1>
                <p className="text-blue-200 mt-2 text-lg neon-text">Real-time Air Quality Monitoring System</p>
            </header>

            <FilterBar
                filters={filters}
                setFilters={setFilters}
                cities={availableCities}
            />

            {!loading && !error && filteredStations.length > 0 && (
                <MapComponent stations={filteredStations} />
            )}

            <div className="flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="w-12 h-12 animate-spin text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    </div>
                ) : error ? (
                    <div className="text-red-400 text-center p-8 glass-panel neon-border rounded-xl">
                        Error loading data. Please try again later.
                    </div>
                ) : filteredStations.length === 0 ? (
                    <div className="text-blue-300 text-center p-8 glass-panel neon-border rounded-xl">
                        No data available for the selected filters.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {filteredStations.map(station => (
                            <StationCard key={station.station} data={station} />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-12 mb-8 glass-panel neon-border p-6 rounded-xl max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-4 text-center">PM2.5 OR PM 10 Color Legend</h3>
                <p className="text-sm text-blue-200 text-center mb-6 max-w-2xl mx-auto">
                    <span className="font-bold text-white">Pulsating dots</span> indicate real-time data (PM 2.5 or PM 10) from Government sources.
                    <br />
                    <span className="font-bold text-white">Static dots</span> indicate data derived from the nearest available station (when local data is unavailable).
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-green-400 mb-2 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                        <span className="text-green-400 font-bold">0 - 50</span>
                        <span className="text-xs text-gray-300">Good</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 mb-2 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                        <span className="text-yellow-400 font-bold">51 - 100</span>
                        <span className="text-xs text-gray-300">Satisfactory</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-400 mb-2 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                        <span className="text-orange-400 font-bold">101 - 200</span>
                        <span className="text-xs text-gray-300">Moderate</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-red-400 mb-2 shadow-[0_0_10px_rgba(248,113,113,0.5)]"></div>
                        <span className="text-red-400 font-bold">201 - 300</span>
                        <span className="text-xs text-gray-300">Poor</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-400 mb-2 shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
                        <span className="text-purple-400 font-bold">301 - 400</span>
                        <span className="text-xs text-gray-300">Very Poor</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-red-600 mb-2 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                        <span className="text-red-600 font-bold">&gt; 400</span>
                        <span className="text-xs text-gray-300">Severe</span>
                    </div>
                </div>
            </div>

            <footer className="mt-4 py-8 border-t border-blue-500/20 text-center">
                <div className="glass-panel neon-border p-6 rounded-xl inline-block max-w-4xl mx-auto">
                    <p className="text-blue-300 font-semibold mb-2">Developed by:</p>
                    <p className="text-white font-bold text-lg mb-1 neon-text">Dr. Arkaprabha Sau</p>
                    <p className="text-blue-200 text-sm mb-4">
                        MBBS, MD (Gold Medalist), PhD (Computer Science & Engineering),<br />
                        DPH, Dip. Geriatric Medicine, Certificate in Diabetes Management
                    </p>
                    <p className="text-xs text-gray-400">
                        Source: CPCB (Open Government Data)
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
