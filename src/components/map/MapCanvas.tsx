import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '../../types';

import L from 'leaflet';

// Fix for default marker icon in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapCanvasProps {
    places: Place[];
    selectedPlaceId: string | null;
    onSelectPlace: (id: string) => void;
}

function FlyToLocation({ location }: { location: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], 13, { duration: 1.5 });
        }
    }, [location, map]);
    return null;
}

export function MapCanvas({ places, selectedPlaceId, onSelectPlace }: MapCanvasProps) {
    const selectedPlace = places.find(p => p.id === selectedPlaceId);

    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                scrollWheelZoom={true}
                className="h-full w-full outline-none"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    // Using CartoDB Positron for a clean, premium look
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {places.map((place) => (
                    <Marker
                        key={place.id}
                        position={[place.location.lat, place.location.lng]}
                        eventHandlers={{
                            click: () => onSelectPlace(place.id),
                        }}
                    >
                        <Popup className="font-sans">
                            <div className="text-sm font-semibold">{place.name}</div>
                            <div className="text-xs text-muted-foreground">{place.country}</div>
                            <div className="text-xs mt-1 text-slate-500">
                                {new Date(place.visitDate).toLocaleDateString()}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {selectedPlace && <FlyToLocation location={selectedPlace.location} />}
            </MapContainer>
        </div>
    );
}
