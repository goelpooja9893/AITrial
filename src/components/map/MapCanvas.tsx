import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '../../types';
import { createCustomMarkerIcon } from './CustomMarker';

interface MapCanvasProps {
    places: Place[];
    selectedPlaceId: string | null;
    onSelectPlace: (id: string) => void;
    onImageClick?: (image: string) => void;
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

export function MapCanvas({ places, selectedPlaceId, onSelectPlace, onImageClick }: MapCanvasProps) {
    const selectedPlace = places.find(p => p.id === selectedPlaceId);

    // Find most recent place
    const mostRecentPlace = places.length > 0
        ? places.reduce((latest, current) =>
            current.addedAt > latest.addedAt ? current : latest
        )
        : null;

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
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <TileLayer
                    attribution=''
                    url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png"
                    opacity={0.7}
                />

                {places.map((place) => {
                    const isRecent = mostRecentPlace?.id === place.id;
                    const hasImage = place.images && place.images.length > 0;

                    return (
                        <Marker
                            key={place.id}
                            position={[place.location.lat, place.location.lng]}
                            icon={createCustomMarkerIcon({ isRecent, hasImage })}
                            eventHandlers={{
                                click: () => onSelectPlace(place.id),
                            }}
                        >
                            <Popup className="font-sans">
                                <div className="text-sm font-semibold">{place.name}</div>
                                {place.images && place.images.length > 0 && (
                                    <div
                                        className="my-1 rounded-sm overflow-hidden h-20 w-full cursor-zoom-in hover:brightness-110 transition-all"
                                        onClick={() => {
                                            // Leaflet popup events propagation is tricky, this usually works straight away in React Leaflet V4
                                            onImageClick?.(place.images![0]);
                                        }}
                                    >
                                        <img src={place.images[0]} alt={place.name} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <div className="text-xs text-muted-foreground">{place.country}</div>
                                <div className="text-xs mt-1 text-slate-500">
                                    {new Date(place.visitDate).toLocaleDateString()}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {selectedPlace && <FlyToLocation location={selectedPlace.location} />}
            </MapContainer>
        </div>
    );
}
