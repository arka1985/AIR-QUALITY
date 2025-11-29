import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

const getAQIColor = (value) => {
    const v = parseInt(value);
    if (isNaN(v)) return 'text-gray-400';
    if (v <= 50) return 'text-green-400';
    if (v <= 100) return 'text-yellow-400';
    if (v <= 200) return 'text-orange-400';
    if (v <= 300) return 'text-red-400';
    if (v <= 400) return 'text-purple-400';
    return 'text-red-600';
};

const StationCard = ({ data }) => {
    const [showMap, setShowMap] = useState(false);
    const lat = parseFloat(data.lat);
    const lng = parseFloat(data.lng);
    const hasLocation = !isNaN(lat) && !isNaN(lng);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel neon-border rounded-xl p-6 hover:bg-white/5 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white leading-tight">{data.station}</h3>
                    <p className="text-sm text-gray-400 mt-1">{data.city}, {data.state.replace(/_/g, ' ')}</p>
                </div>
            </div>

            {hasLocation && (
                <div className="mb-4">
                    {!showMap ? (
                        <button
                            onClick={() => setShowMap(true)}
                            className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs rounded border border-blue-500/30 transition-colors"
                        >
                            Show Station Map
                        </button>
                    ) : (
                        <div className="h-32 rounded-lg overflow-hidden border border-white/10 relative z-0">
                            <MapContainer
                                center={[lat, lng]}
                                zoom={10}
                                scrollWheelZoom={true}
                                zoomControl={true}
                                dragging={true}
                                doubleClickZoom={true}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                <Marker
                                    position={[lat, lng]}
                                    icon={L.divIcon({
                                        className: 'custom-div-icon',
                                        html: `<div class="marker-pin ${data.hasRealTimeData ? 'marker-pulsating' : ''}" style="background-color: ${data.displayColor}; color: ${data.displayColor}; box-shadow: 0 0 5px ${data.displayColor};"></div>`,
                                        iconSize: [12, 12],
                                        iconAnchor: [6, 6]
                                    })}
                                />
                            </MapContainer>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-3 flex-grow">
                {data.pollutants.map((p) => (
                    <div key={p.pollutant_id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-gray-300 bg-white/5 px-2 py-0.5 rounded">{p.pollutant_id}</span>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-bold ${getAQIColor(p.avg_value)}`}>
                                {p.avg_value}
                            </div>
                            <div className="text-xs text-gray-500">
                                L:{p.min_value} H:{p.max_value}
                            </div>
                        </div>
                    </div>
                ))}
                {data.isDerived && (
                    <div className="text-xs text-orange-400 mt-2 italic text-center border-t border-white/10 pt-2">
                        *PM2.5 estimated from nearest station
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-500 text-right">
                Updated: {data.last_update}
            </div>
        </motion.div>
    );
};

export default StationCard;
