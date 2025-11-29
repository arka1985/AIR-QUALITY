import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import * as turf from '@turf/turf';

const MapComponent = ({ stations }) => {
    const [geoData, setGeoData] = useState(null);
    const center = [20.5937, 78.9629];

    useEffect(() => {
        // Fetch the new GeoJSON file directly
        fetch('./india_states.json')
            .then(response => response.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Error loading GeoJSON:", err));
    }, []);

    return (
        <div className="glass-panel neon-border rounded-xl overflow-hidden h-[400px] mb-8 relative z-0">
            <MapContainer
                center={center}
                zoom={5}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={{
                            color: '#93c5fd', // blue-300
                            weight: 1,
                            opacity: 0.3,
                            dashArray: '2, 4', // Small dotted line
                            fillColor: 'transparent',
                            fillOpacity: 0
                        }}
                    />
                )}

                {stations.map((station) => {
                    const lat = parseFloat(station.lat);
                    const lng = parseFloat(station.lng);

                    if (isNaN(lat) || isNaN(lng)) return null;

                    const customIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div class="marker-pin ${station.displayPM25 !== null ? 'marker-pulsating' : ''}" style="background-color: ${station.displayColor}; color: ${station.displayColor}; box-shadow: 0 0 5px ${station.displayColor};"></div>`,
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                    });

                    return (
                        <Marker
                            key={station.station}
                            position={[lat, lng]}
                            icon={customIcon}
                        >
                            <Popup className="glass-popup">
                                <div className="text-gray-800">
                                    <h3 className="font-bold">{station.station}</h3>
                                    <p className="text-sm">{station.city}, {station.state}</p>
                                    <div className="mt-2">
                                        {station.pollutants.map(p => (
                                            <div key={p.pollutant_id} className="text-xs">
                                                <b>{p.pollutant_id}:</b> {p.avg_value}
                                            </div>
                                        ))}
                                        {station.isDerived && (
                                            <div className="text-xs text-orange-600 mt-1 italic">
                                                *PM2.5 est. from nearest station
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
