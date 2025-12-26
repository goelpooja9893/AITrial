import { useState } from 'react';
import { MapCanvas } from './components/map/MapCanvas';
import { Timeline } from './components/timeline/Timeline';
import { AddPlaceDialog } from './components/dialogs/AddPlaceDialog';
import { Button } from './components/common/Button';
import { usePlacesStore } from './store/usePlacesStore';
import { Plus, LayoutList, Map as MapIcon, Globe } from 'lucide-react';
import { PlaceInput } from './types';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuthStore } from './store/useAuthStore';
import { LoginScreen } from './components/auth/LoginScreen';
import { selectUserPlaces } from './store/usePlacesStore';
import { UserProfileDialog } from './components/profile/UserProfileDialog';
import { Passport } from './components/timeline/Passport';
import { Lightbox } from './components/common/Lightbox';
import { UserCircle, BookOpen, PlayCircle, Gift } from 'lucide-react';
import { BadgeNotification } from './components/gamification/BadgeNotification';
import { YearlyRecap } from './components/recap/YearlyRecap';
import { StoriesFeed } from './components/stories/StoriesFeed';

import { ThemeSelector } from './components/common/ThemeSelector';

function App() {
    const { places, addPlace, selectedPlaceId, selectPlace, viewMode, setViewMode, theme } = usePlacesStore();
    const { currentUser, isAuthenticated } = useAuthStore();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPassportOpen, setIsPassportOpen] = useState(false);
    const [isRecapOpen, setIsRecapOpen] = useState(false);
    const [isStoriesOpen, setIsStoriesOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const [newBadge, setNewBadge] = useState<any | null>(null);
    const [filterTag, setFilterTag] = useState<string | null>(null);

    // Filter places for current user AND tag
    const userPlaces = selectUserPlaces({ places } as any, currentUser?.id)
        .filter(p => !filterTag || p.tags?.includes(filterTag as any));

    const userBadges = usePlacesStore((state) => state.badges); // Assume filtered by user in real app, but simplified here
    const unlockBadge = usePlacesStore((state) => state.unlockBadge);

    // Apply theme (In a real app, this might be a useEffect on the body)
    const themeClasses = {
        'light': 'bg-slate-50 text-slate-900',
        'dark': 'bg-slate-900 text-slate-100 dark',
        'midnight': 'bg-indigo-950 text-indigo-100' // Custom
    };

    // Public Read-Only Simulation
    const isPublicView = new URLSearchParams(window.location.search).get('public') === 'true';

    if (!isAuthenticated && !isPublicView) return <LoginScreen />;

    const handleAddPlace = (input: PlaceInput, date: string, notes: string, image?: string) => {
        if (!currentUser) return;

        const newPlace = {
            id: uuidv4(),
            ...input,
            location: { lat: input.lat, lng: input.lng },
            visitDate: date,
            notes,
            addedAt: Date.now(),
            images: image ? [image] : undefined,
            userId: currentUser.id,
            countryCode: input.countryCode,
            tags: input.tags,
            mood: input.mood
        };

        addPlace(newPlace);

        // Check for new badges
        // We need to calculate stats including the new place
        // Ideally this happens in a store middleware or listener
        // But for simplicity, we do it here.
        import('./lib/stats').then(({ calculateStats }) => {
            import('./lib/badges').then(({ checkNewBadges }) => {
                const newStats = calculateStats([newPlace, ...userPlaces]);
                const earnedBadges = checkNewBadges(newStats, userBadges);

                earnedBadges.forEach(badge => {
                    unlockBadge(badge);
                    setNewBadge(badge); // Show notification for the last one (or queue them)
                });
            });
        });
    };

    const stats = {
        totalPlaces: userPlaces.length,
        countries: new Set(userPlaces.map(p => p.country).filter(Boolean)).size,
    };

    return (
        <div className={`h-screen w-screen flex flex-col md:flex-row overflow-hidden relative transition-colors duration-500 ${themeClasses[theme]}`}>
            {/* Background for Midnight/Dark themes */}
            {(theme === 'dark' || theme === 'midnight') && (
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black opacity-50 pointer-events-none" />
            )}

            <AddPlaceDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onAdd={handleAddPlace}
            />

            <UserProfileDialog
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                places={userPlaces}
            />

            <Passport
                isOpen={isPassportOpen}
                onClose={() => setIsPassportOpen(false)}
                places={userPlaces}
                user={{ name: currentUser?.name || 'Traveler', avatar: currentUser?.avatar }}
            />

            <Lightbox
                isOpen={!!lightboxImage}
                image={lightboxImage || ''}
                onClose={() => setLightboxImage(null)}
            />

            <BadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />

            <YearlyRecap
                isOpen={isRecapOpen}
                onClose={() => setIsRecapOpen(false)}
                places={userPlaces}
            />

            <StoriesFeed
                isOpen={isStoriesOpen}
                onClose={() => setIsStoriesOpen(false)}
                places={userPlaces}
            />

            {/* Top Right Controls (Profile & Passport) */}
            <div className="absolute top-4 right-4 z-[40] flex gap-2 md:right-8 items-center">
                <ThemeSelector />
                {/* Hide personal controls in public view */}
                {!isPublicView && (
                    <>
                        <div className="w-px h-6 bg-white/30 mx-1 hidden md:block"></div>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="shadow-lg bg-white/90 backdrop-blur-md hidden md:flex"
                            onClick={() => setIsRecapOpen(true)}
                        >
                            <Gift className="h-4 w-4 mr-2 text-pink-500" />
                            Wrapped
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="shadow-lg bg-white/90 backdrop-blur-md hidden md:flex"
                            onClick={() => setIsStoriesOpen(true)}
                        >
                            <PlayCircle className="h-4 w-4 mr-2 text-orange-500" />
                            Stories
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="shadow-lg bg-white/90 backdrop-blur-md hidden md:flex"
                            onClick={() => setIsPassportOpen(true)}
                        >
                            <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                            Passport
                        </Button>
                        <Button
                            size="icon"
                            className="shadow-lg rounded-full h-10 w-10 overflow-hidden border-2 border-white"
                            onClick={() => setIsProfileOpen(true)}
                        >
                            {currentUser?.avatar ? (
                                <img src={currentUser.avatar} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <UserCircle className="h-6 w-6" />
                            )}
                        </Button>
                    </>
                )}
                {isPublicView && (
                    <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Read Only
                    </div>
                )}
            </div>

            {/* Sidebar / Overlay for Timeline */}
            <AnimatePresence>
                <motion.div
                    className="absolute z-20 top-4 left-4 bottom-4 w-full max-w-sm flex flex-col pointer-events-none"
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Header Card */}
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl mb-4 pointer-events-auto border border-white/20">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            {currentUser?.name ? `${currentUser.name}'s Tracker` : 'Place Tracker'}
                        </h1>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground font-medium">
                            <div className="flex items-center gap-1">
                                <MapIcon className="h-3 w-3" />
                                {stats.totalPlaces} Places
                            </div>
                            <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {stats.countries} Countries
                            </div>
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="flex-1 bg-white/80 backdrop-blur-md rounded-xl shadow-xl overflow-hidden flex flex-col pointer-events-auto border border-white/20">
                        <div className="p-4 border-b bg-white/50 flex flex-col gap-3 sticky top-0 z-10 backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">My Journey</h2>
                                <Button size="sm" onClick={() => setIsAddDialogOpen(true)} className="rounded-full h-8 w-8 p-0">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Filter Chips */}
                            <div className="flex gap-2 text-xs overflow-x-auto pb-1 scrollbar-hide">
                                <button
                                    onClick={() => setFilterTag(null)}
                                    className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${!filterTag ? 'bg-primary text-primary-foreground' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                >
                                    All
                                </button>
                                {['visited', 'lived', 'transit'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                                        className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${filterTag === tag ? 'bg-primary text-primary-foreground' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 scrollbar-hide">
                            <Timeline
                                places={userPlaces}
                                selectedPlaceId={selectedPlaceId}
                                onSelectPlace={selectPlace}
                                onImageClick={setLightboxImage}
                            />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Mobile Toggle (Visible only on small screens) */}
            <div className="absolute top-4 right-4 z-40 md:hidden">
                <Button
                    size="icon"
                    variant="secondary"
                    className="shadow-lg rounded-full"
                    onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                >
                    {viewMode === 'map' ? <LayoutList className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
                </Button>
            </div>

            {/* Main Map Area */}
            <main className="flex-1 h-full w-full relative">
                <MapCanvas
                    places={userPlaces}
                    selectedPlaceId={selectedPlaceId}
                    onSelectPlace={selectPlace}
                    onImageClick={setLightboxImage}
                />
            </main>
        </div>
    );
}

export default App;
