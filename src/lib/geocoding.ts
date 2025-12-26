import { PlaceInput } from "../types";

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    address?: {
        country?: string;
    };
}

export async function searchPlaces(query: string): Promise<PlaceInput[]> {
    if (!query || query.length < 3) return [];

    const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5',
    });

    try {
        const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('Geocoding failed');

        const data: NominatimResult[] = await response.json();

        return data.map((item) => ({
            name: item.display_name.split(',')[0], // Simple name
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            country: item.address?.country
        }));
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}
