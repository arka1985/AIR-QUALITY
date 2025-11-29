import { motion } from 'framer-motion';
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
                    <div className="p-2 bg-blue-900/20 rounded text-center text-xs text-blue-300 border border-blue-500/30">
                        Map Temporarily Disabled
                    </div>
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
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gray-500 text-right">
                Updated: {data.last_update}
            </div>
        </motion.div>
    );
};

export default StationCard;
