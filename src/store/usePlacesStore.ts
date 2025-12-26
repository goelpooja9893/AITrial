import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Badge, Place, ViewMode } from '../types';

interface PlacesState {
    places: Place[];
    badges: Badge[]; // Unlocked badges
    viewMode: ViewMode;
    theme: 'light' | 'dark' | 'midnight';
    selectedPlaceId: string | null;

    // Actions
    addPlace: (place: Place) => void;
    removePlace: (id: string) => void;
    updatePlace: (id: string, updates: Partial<Place>) => void;
    setViewMode: (mode: ViewMode) => void;
    setTheme: (theme: 'light' | 'dark' | 'midnight') => void;
    selectPlace: (id: string | null) => void;
    unlockBadge: (badge: Badge) => void;
}

// Helper to filter places by user
export const selectUserPlaces = (state: PlacesState, userId: string | undefined) =>
    state.places.filter(p => !p.userId || p.userId === userId);

export const usePlacesStore = create<PlacesState>()(
    persist(
        (set) => ({
            places: [],
            badges: [],
            viewMode: 'map',
            theme: 'light',
            selectedPlaceId: null,

            addPlace: (place) => set((state) => ({
                places: [place, ...state.places]
            })),

            setTheme: (theme) => set({ theme }),

            unlockBadge: (badge) => set((state) => ({
                badges: [...state.badges, badge]
            })),

            removePlace: (id) => set((state) => ({
                places: state.places.filter((p) => p.id !== id),
                selectedPlaceId: state.selectedPlaceId === id ? null : state.selectedPlaceId
            })),

            updatePlace: (id, updates) => set((state) => ({
                places: state.places.map((p) => p.id === id ? { ...p, ...updates } : p)
            })),

            setViewMode: (mode) => set({ viewMode: mode }),

            selectPlace: (id) => set({ selectedPlaceId: id, viewMode: 'map' }),
        }),
        {
            name: 'place-tracker-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
