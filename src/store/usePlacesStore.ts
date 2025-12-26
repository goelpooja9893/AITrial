import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Place, ViewMode } from '../types';

interface PlacesState {
    places: Place[];
    viewMode: ViewMode;
    selectedPlaceId: string | null;

    // Actions
    addPlace: (place: Place) => void;
    removePlace: (id: string) => void;
    updatePlace: (id: string, updates: Partial<Place>) => void;
    setViewMode: (mode: ViewMode) => void;
    selectPlace: (id: string | null) => void;
}

export const usePlacesStore = create<PlacesState>()(
    persist(
        (set) => ({
            places: [],
            viewMode: 'map',
            selectedPlaceId: null,

            addPlace: (place) => set((state) => ({
                places: [place, ...state.places]
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
