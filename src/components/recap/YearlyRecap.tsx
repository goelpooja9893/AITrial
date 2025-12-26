import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map } from 'lucide-react';
import { Place } from '../../types';

interface YearlyRecapProps {
    isOpen: boolean;
    onClose: () => void;
    places: Place[];
    year?: string;
}

export function YearlyRecap({ isOpen, onClose, places, year = new Date().getFullYear().toString() }: YearlyRecapProps) {
    const [step, setStep] = useState(0);

    // Filter places for the specific year
    const yearPlaces = places.filter(p => p.visitDate.startsWith(year));

    if (!isOpen) return null;

    const stats = {
        count: yearPlaces.length,
        countries: new Set(yearPlaces.map(p => p.countryCode).filter(Boolean)).size,
        topMood: yearPlaces.reduce((acc, p) => {
            if (p.mood) acc[p.mood] = (acc[p.mood] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
    };

    const topMood = Object.entries(stats.topMood).sort((a, b) => b[1] - a[1])[0]?.[0] || 'adventurous';

    const slides = [
        // Intro
        (
            <div className="flex flex-col items-center justify-center text-center h-full p-8 text-white">
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="text-6xl mb-4 font-black"
                >
                    {year}
                </motion.div>
                <div className="text-xl font-light tracking-widest uppercase">Travel Recap</div>
                <div className="mt-8 text-white/80">Ready to relive the journey?</div>
            </div>
        ),
        // Stats
        (
            <div className="flex flex-col items-center justify-center text-center h-full p-8 text-white">
                <div className="text-2xl font-bold mb-8">This year you visited</div>
                <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
                    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                        <div className="text-4xl font-bold mb-2">{stats.count}</div>
                        <div className="text-sm uppercase tracking-wider">Places</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl">
                        <div className="text-4xl font-bold mb-2">{stats.countries}</div>
                        <div className="text-sm uppercase tracking-wider">Countries</div>
                    </div>
                </div>
            </div>
        ),
        // Top Mood
        (
            <div className="flex flex-col items-center justify-center text-center h-full p-8 text-white">
                <div className="text-2xl font-bold mb-8">Your Travel Vibe Was</div>
                <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 10, scale: 1.2 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                    className="text-8xl mb-6"
                >
                    {topMood === 'happy' && '😊'}
                    {topMood === 'excited' && '🤩'}
                    {topMood === 'relaxed' && '😌'}
                    {topMood === 'adventurous' && '🤠'}
                    {topMood === 'romantic' && '🥰'}
                    {topMood === 'local' && '🏠'}
                </motion.div>
                <div className="text-3xl font-black uppercase text-amber-300">{topMood}</div>
            </div>
        ),
        // Map / Closing
        (
            <div className="flex flex-col items-center justify-center text-center h-full p-8 text-white">
                <div className="text-2xl font-bold mb-4">What a Year!</div>
                <div className="relative w-full max-w-xs aspect-square bg-slate-900 rounded-lg overflow-hidden mb-8 opacity-80">
                    {/* Placeholder for a mini-map or collage */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                        <Map className="h-16 w-16" />
                    </div>
                </div>
                <div className="text-lg">Here's to more adventures in {parseInt(year) + 1}! 🥂</div>
            </div>
        )
    ];

    const nextStep = () => {
        if (step < slides.length - 1) setStep(step + 1);
        else onClose();
    };

    const bgColors = [
        'bg-blue-600',
        'bg-indigo-600',
        'bg-purple-600',
        'bg-rose-600'
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
            >
                <div className={`relative w-full h-full max-w-md md:h-[90vh] md:w-[400px] md:rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500 ${bgColors[step]}`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-white/50 hover:text-white p-2"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Progress Bar */}
                    <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-white' : 'bg-white/30'}`}
                            />
                        ))}
                    </div>

                    <div
                        className="h-full w-full cursor-pointer"
                        onClick={nextStep}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="h-full w-full"
                            >
                                {slides[step]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
