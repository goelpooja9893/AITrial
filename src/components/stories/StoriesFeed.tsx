import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Star } from 'lucide-react';
import { Place } from '../../types';
import { format } from 'date-fns';
import { getFlagEmoji } from '../../lib/flags';

interface StoriesFeedProps {
    isOpen: boolean;
    onClose: () => void;
    places: Place[];
}

export function StoriesFeed({ isOpen, onClose, places }: StoriesFeedProps) {
    if (!isOpen) return null;

    // Sort by date (newest first for feed)
    const sortedPlaces = [...places].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed inset-0 z-[60] bg-black"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 text-white/50 hover:text-white p-2"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
                    {sortedPlaces.map((place) => (
                        <div key={place.id} className="h-full w-full snap-start relative flex items-center justify-center bg-slate-900">
                            {/* Background Image / Blur */}
                            {place.images && place.images.length > 0 && (
                                <div className="absolute inset-0 z-0">
                                    <img src={place.images[0]} alt="" className="h-full w-full object-cover blur-sm opacity-50 scale-110" />
                                </div>
                            )}

                            {/* Main Card */}
                            <div className="relative z-10 w-full max-w-sm mx-4 aspect-[9/16] max-h-[80vh] bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
                                {/* Image */}
                                <div className="flex-1 relative overflow-hidden bg-slate-800">
                                    {place.images && place.images.length > 0 ? (
                                        <img src={place.images[0]} alt={place.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-500">
                                            <MapPin className="h-12 w-12" />
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{getFlagEmoji(place.countryCode || '')}</span>
                                            <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider">
                                                {place.tags?.[0] || 'Visit'}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold leading-tight mb-1">{place.name}</h2>
                                        <div className="text-white/80 text-sm flex items-center gap-4 mb-4">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(place.visitDate), 'MMM d, yyyy')}</span>
                                            {place.rating && <span className="flex items-center gap-1 text-yellow-400"><Star className="h-3 w-3 fill-current" /> {place.rating}</span>}
                                        </div>

                                        {place.notes && (
                                            <p className="text-sm text-white/90 italic leading-relaxed line-clamp-3">
                                                "{place.notes}"
                                            </p>
                                        )}

                                        {place.mood && (
                                            <div className="absolute top-4 right-4 text-4xl animate-bounce">
                                                {place.mood === 'happy' && '😊'}
                                                {place.mood === 'excited' && '🤩'}
                                                {place.mood === 'relaxed' && '😌'}
                                                {place.mood === 'adventurous' && '🤠'}
                                                {place.mood === 'romantic' && '🥰'}
                                                {place.mood === 'local' && '🏠'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {places.length === 0 && (
                        <div className="h-full w-full flex items-center justify-center text-white">
                            <div className="text-center">
                                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No stories yet. Start adding places!</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
