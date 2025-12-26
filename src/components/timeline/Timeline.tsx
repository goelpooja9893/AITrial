import { Place } from '../../types';
import { format } from 'date-fns';
import { MapPin, Calendar, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

interface TimelineProps {
    places: Place[];
    onSelectPlace: (id: string) => void;
    selectedPlaceId: string | null;
    onImageClick?: (image: string) => void;
}

export function Timeline({ places, onSelectPlace, selectedPlaceId, onImageClick }: TimelineProps) {
    // Sort by date descending
    const sortedPlaces = [...places].sort((a, b) =>
        new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );

    return (
        <div className="space-y-4 p-4 pb-20">
            {sortedPlaces.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No places added yet.</p>
                    <p className="text-sm">Start by adding a location!</p>
                </div>
            )}

            {sortedPlaces.map((place) => (
                <Card
                    key={place.id}
                    onClick={() => onSelectPlace(place.id)}
                    className={cn(
                        "cursor-pointer transition-all hover:bg-accent/50 border-transparent hover:border-border",
                        selectedPlaceId === place.id ? "ring-2 ring-primary border-primary" : "bg-white/80 backdrop-blur-sm"
                    )}
                >
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                {place.name}
                            </CardTitle>
                            {place.rating && (
                                <div className="flex items-center text-yellow-500">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span className="text-xs ml-1">{place.rating}</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(place.visitDate), 'MMMM d, yyyy')}
                        </div>
                        {place.images && place.images.length > 0 && (
                            <div
                                className="mb-3 rounded-md overflow-hidden h-32 w-full cursor-zoom-in relative group"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onImageClick?.(place.images![0]);
                                }}
                            >
                                <img src={place.images[0]} alt={place.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                        )}
                        {place.notes && (
                            <p className="text-sm text-slate-600 line-clamp-2">{place.notes}</p>
                        )}
                        {place.country && (
                            <span className="inline-block mt-2 text-[10px] uppercase font-semibold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {place.country}
                            </span>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
