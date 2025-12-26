import { useAuthStore } from "../../store/useAuthStore";
import { Place } from "../../types";
import { Button } from "../common/Button";
import { LogOut, Trophy, X } from "lucide-react";
import { getFlagEmoji } from "../../lib/flags";

interface UserProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    places: Place[];
}

export function UserProfileDialog({ isOpen, onClose, places }: UserProfileDialogProps) {
    const { currentUser, logout } = useAuthStore();

    if (!isOpen || !currentUser) return null;

    // Calculate Stats
    const totalPlaces = places.length;
    const countries = Array.from(new Set(places.map(p => p.countryCode).filter(Boolean)));
    const uniqueCountriesCount = countries.length;

    // Gamification
    const travelerScore = (totalPlaces * 10) + (uniqueCountriesCount * 50);
    let rank = "Novice Explorer";
    if (travelerScore > 100) rank = "Wayfarer";
    if (travelerScore > 500) rank = "Globetrotter";
    if (travelerScore > 1000) rank = "World Citizen";

    const handleLogout = () => {
        logout();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-1"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full border-4 border-white/30 shadow-lg overflow-hidden bg-white mb-3">
                            <img src={currentUser.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        </div>
                        <h2 className="text-xl font-bold">{currentUser.name}</h2>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-medium mt-1 backdrop-blur-sm">
                            <Trophy className="h-3 w-3 text-yellow-300" />
                            {rank}
                        </div>
                    </div>

                    <div className="flex justify-around mt-6 text-center">
                        <div>
                            <div className="text-2xl font-bold">{totalPlaces}</div>
                            <div className="text-xs text-blue-100 uppercase tracking-wide opacity-80">Places</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{travelerScore}</div>
                            <div className="text-xs text-blue-100 uppercase tracking-wide opacity-80">Score</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{uniqueCountriesCount}</div>
                            <div className="text-xs text-blue-100 uppercase tracking-wide opacity-80">Countries</div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">My Flags</h3>
                    <div className="flex flex-wrap gap-2 mb-8 min-h-[60px]">
                        {countries.length > 0 ? countries.map(code => (
                            <span key={code} className="text-2xl" title={code || ''}>{getFlagEmoji(code || '')}</span>
                        )) : (
                            <p className="text-sm text-slate-400 italic">No countries visited yet.</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => {
                            const url = `${window.location.origin}?public=true`;
                            navigator.clipboard.writeText(url);
                            alert("Public Profile Link Copied! " + url);
                        }}>
                            Share Profile
                        </Button>
                        <Button variant="ghost" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
