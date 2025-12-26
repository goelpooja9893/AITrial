export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Place {
    id: string;
    name: string;
    location: Coordinates;
    country?: string;
    visitDate: string; // ISO Date String
    notes?: string;
    rating?: number; // 1-5
    addedAt: number; // Timestamp
    images?: string[]; // URLs
}

export type ViewMode = 'map' | 'list' | 'stats';

export interface PlaceInput {
    name: string;
    lat: number;
    lng: number;
    country?: string;
    image?: string;
}
