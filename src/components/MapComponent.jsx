import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import shp from 'shpjs';
import { useEffect, useState } from 'react';
import * as turf from '@turf/turf';

const MapComponent = ({ stations }) => {
    const [geoData, setGeoData] = useState(null);
    const center = [20.5937, 78.9629];

    useEffect(() => {
        // Fetch and parse the shapefile
        shp('./india_outline.zip').then(function (geojson) {
            setGeoData(geojson);
        }).catch(err => console.error("Error loading shapefile:", err));
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
                            opacity: 0.4,
                            dashArray: '4, 4',
                            fillColor: 'transparent',
                            fillOpacity: 0
                        }}
                    />
                )}

                {stations.map((station) => {
                    const lat = parseFloat(station.lat);
                    const lng = parseFloat(station.lng);

                    if (isNaN(lat) || isNaN(lng)) return null;

                    return (
                        <CircleMarker
                            key={station.station}
                            center={[lat, lng]}
                            radius={6}
                            pathOptions={{
                                color: station.displayColor,
                                fillColor: station.displayColor,
                                fillOpacity: 0.8,
                                weight: 2,
                                className: station.isDerived ? '' : 'neon-marker-pulse'
                            }}
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
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
