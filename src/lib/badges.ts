import { Badge } from "../types";
import { TravelStats } from "./stats";

export const BADGE_DEFINITIONS: Omit<Badge, 'unlockedAt'>[] = [
    {
        id: 'first_step',
        name: 'First Step',
        description: 'Added your first place.',
        icon: '🏁',
        condition: (stats: TravelStats) => stats.citiesCount >= 1
    },
    {
        id: 'explorer',
        name: 'Explorer',
        description: 'Visited 5 different countries.',
        icon: '🌍',
        condition: (stats: TravelStats) => stats.countriesCount >= 5
    },
    {
        id: 'globetrotter',
        name: 'Globetrotter',
        description: 'Visited 3 continents.',
        icon: '🗺️',
        condition: (stats: TravelStats) => stats.continentsCount >= 3
    },
    {
        id: 'mile_high',
        name: 'High Flyer',
        description: 'Traveled over 10,000 km.',
        icon: '✈️',
        condition: (stats: TravelStats) => stats.totalDistance >= 10000
    },
    {
        id: 'local_expert',
        name: 'Local Expert',
        description: 'Logged 10 places.',
        icon: '📍',
        condition: (stats: TravelStats) => stats.citiesCount >= 10
    }
];

export function checkNewBadges(stats: TravelStats, currentBadges: Badge[]): Badge[] {
    const existingIds = new Set(currentBadges.map(b => b.id));
    const newBadges: Badge[] = [];

    BADGE_DEFINITIONS.forEach(def => {
        if (!existingIds.has(def.id) && def.condition(stats)) {
            newBadges.push({
                ...def,
                unlockedAt: Date.now()
            });
        }
    });

    return newBadges;
}
