import { Place } from "../types";

// Haversine formula to calculate distance between two points
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Simple mapping for demo purposes. 
// in a real app, this would be a robust library or API.
const CONTINENT_MAP: Record<string, string> = {
    'US': 'North America', 'CA': 'North America', 'MX': 'North America',
    'GB': 'Europe', 'FR': 'Europe', 'DE': 'Europe', 'IT': 'Europe', 'ES': 'Europe', 'PT': 'Europe', 'NL': 'Europe', 'BE': 'Europe', 'CH': 'Europe', 'AT': 'Europe', 'SE': 'Europe', 'NO': 'Europe', 'DK': 'Europe', 'FI': 'Europe', 'PL': 'Europe', 'GR': 'Europe', 'IE': 'Europe', 'CZ': 'Europe', 'HU': 'Europe', 'RO': 'Europe', 'RU': 'Europe/Asia',
    'CN': 'Asia', 'JP': 'Asia', 'KR': 'Asia', 'IN': 'Asia', 'TH': 'Asia', 'VN': 'Asia', 'ID': 'Asia', 'MY': 'Asia', 'SG': 'Asia', 'PH': 'Asia', 'AE': 'Asia', 'IL': 'Asia', 'TR': 'Asia',
    'AU': 'Oceania', 'NZ': 'Oceania',
    'BR': 'South America', 'AR': 'South America', 'CL': 'South America', 'CO': 'South America', 'PE': 'South America',
    'ZA': 'Africa', 'EG': 'Africa', 'NG': 'Africa', 'KE': 'Africa', 'MA': 'Africa',
    // Add more as needed or default to 'Unknown'
};

export interface TravelStats {
    totalDistance: number; // in km
    countriesCount: number;
    citiesCount: number;
    continentsCount: number;
    continents: string[];
    topMood: string;
}

export function calculateStats(places: Place[]): TravelStats {
    if (!places || places.length === 0) {
        return {
            totalDistance: 0,
            countriesCount: 0,
            citiesCount: 0,
            continentsCount: 0,
            continents: [],
            topMood: 'N/A'
        };
    }

    // Sort by date to calculate realistic path distance
    const sortedPlaces = [...places].sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());

    let totalDist = 0;
    // Assume starting from the first place, or if we had a "Home" base. 
    // For now, we calculate distance BETWEEN visited places chronologically.
    for (let i = 0; i < sortedPlaces.length - 1; i++) {
        totalDist += getDistanceFromLatLonInKm(
            sortedPlaces[i].location.lat, sortedPlaces[i].location.lng,
            sortedPlaces[i + 1].location.lat, sortedPlaces[i + 1].location.lng
        );
    }

    const uniqueCountries = new Set(places.map(p => p.countryCode).filter(Boolean));
    // Approximate cities by unique lat/lng rounded or just by name (safer implies name + country)
    const uniqueCities = new Set(places.map(p => `${p.name}-${p.countryCode}`));

    const uniqueContinents = new Set<string>();
    places.forEach(p => {
        if (p.countryCode) {
            const continent = CONTINENT_MAP[p.countryCode.toUpperCase()];
            if (continent) uniqueContinents.add(continent);
        }
    });

    // Calculate Top Mood
    const moodCounts: Record<string, number> = {};
    places.forEach(p => {
        if (p.mood) {
            moodCounts[p.mood] = (moodCounts[p.mood] || 0) + 1;
        }
    });
    let topMood = 'N/A';
    let maxMoodCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxMoodCount) {
            maxMoodCount = count;
            topMood = mood;
        }
    });

    return {
        totalDistance: Math.round(totalDist),
        countriesCount: uniqueCountries.size,
        citiesCount: uniqueCities.size,
        continentsCount: uniqueContinents.size,
        continents: Array.from(uniqueContinents),
        topMood
    };
}
