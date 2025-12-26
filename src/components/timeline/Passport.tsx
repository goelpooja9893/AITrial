import { Place } from "../../types";
import { getFlagEmoji } from "../../lib/flags";
import { motion } from "framer-motion";
import { X, Plane } from 'lucide-react';

interface PassportProps {
    isOpen: boolean;
    onClose: () => void;
    places: Place[];
    user: { name: string; avatar?: string };
}

export function Passport({ isOpen, onClose, places, user }: PassportProps) {
    if (!isOpen) return null;

    const uniqueCountries = Array.from(new Set(places.map(p => p.countryCode).filter(Boolean)));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, rotateY: 90, opacity: 0 }}
                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a237e] w-full max-w-2xl aspect-[1.4] rounded-r-3xl rounded-l-md shadow-2xl overflow-hidden flex flex-col md:flex-row border-l-8 border-l-[#0d1352] relative"
                style={{
                    backgroundImage: `url("https://www.transparenttextures.com/patterns/leather.png"), linear-gradient(135deg, #1a237e 0%, #283593 100%)`
                }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white z-10"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* ID Page */}
                <div className="flex-1 bg-[#fdfbf7] p-8 flex flex-col border-r border-slate-200 relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    <div className="flex items-start justify-between mb-8 border-b-2 border-slate-800 pb-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Passport</span>
                            <span className="text-2xl font-serif font-bold text-slate-800 uppercase tracking-wider">Place Tracker</span>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-900 flex items-center justify-center text-white">
                            <Plane className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="w-24 h-32 bg-slate-200 rounded-sm overflow-hidden border border-slate-300 shadow-inner">
                            {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover grayscale contrast-125" alt="Avatar" />
                            ) : (
                                <div className="w-full h-full bg-slate-300" />
                            )}
                        </div>
                        <div className="flex-1 space-y-4 font-mono text-sm">
                            <div>
                                <div className="text-[10px] uppercase text-slate-400">Name</div>
                                <div className="font-bold border-b border-dotted border-slate-300 w-full uppercase">{user.name}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase text-slate-400">Nationality</div>
                                <div className="font-bold border-b border-dotted border-slate-300 w-full uppercase">Global Citizen</div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <div className="text-[10px] uppercase text-slate-400">Stamps</div>
                                    <div className="font-bold uppercase">{places.length}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase text-slate-400">Countries</div>
                                    <div className="font-bold uppercase">{uniqueCountries.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stamps Page */}
                <div className="flex-1 bg-[#fdfbf7] p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#b91c1c 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center border-b border-slate-200 pb-2">Visas & Stamps</h3>

                    <div className="grid grid-cols-3 gap-4 auto-rows-min h-full overflow-y-auto pb-10 content-start">
                        {places.map((place) => (
                            <div
                                key={place.id}
                                className="aspect-square border-2 border-dashed border-red-800/30 rounded-full flex flex-col items-center justify-center p-2 transform rotate-selected hover:scale-110 transition-transform cursor-help group relative"
                                style={{ transform: `rotate(${Math.random() * 30 - 15}deg)` }}
                                title={`${place.name}, ${place.country}`}
                            >
                                <span className="text-xl filter sepia">{getFlagEmoji(place.countryCode || '')}</span>
                                <span className="text-[8px] font-bold text-red-900/60 uppercase text-center leading-tight mt-1 line-clamp-2">
                                    {place.countryCode || 'UNK'}
                                    <br />
                                    <span className="text-[6px]">{new Date(place.visitDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </span>
                            </div>
                        ))}
                        {Array.from({ length: Math.max(0, 9 - places.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square border border-dotted border-slate-200 rounded-full opacity-50" />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
