export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Place {
    id: string;
    name: string;
    location: Coordinates;
    country?: string;
    countryCode?: string; // e.g. "fr", "jp"
    visitDate: string; // ISO Date String
    notes?: string;
    rating?: number; // 1-5
    addedAt: number; // Timestamp
    images?: string[]; // URLs
    userId?: string; // Owner of the place
    tags?: ('visited' | 'lived' | 'transit')[];
    mood?: 'happy' | 'excited' | 'relaxed' | 'romantic' | 'adventurous' | 'local';
}

export type ViewMode = 'map' | 'list' | 'stats';

export interface PlaceInput {
    name: string;
    lat: number;
    lng: number;
    country?: string;
    countryCode?: string;
    image?: string;
    tags?: ('visited' | 'lived' | 'transit')[];
    mood?: 'happy' | 'excited' | 'relaxed' | 'romantic' | 'adventurous' | 'local';
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // emoji or lucide icon name
    condition: (stats: any) => boolean;
    unlockedAt?: number;
}

