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
import { UserCircle, BookOpen } from 'lucide-react';

function App() {
    const { places, addPlace, selectedPlaceId, selectPlace, viewMode, setViewMode } = usePlacesStore();
    const { currentUser, isAuthenticated } = useAuthStore();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPassportOpen, setIsPassportOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // Filter places for current user
    const userPlaces = selectUserPlaces({ places } as any, currentUser?.id);

    if (!isAuthenticated) return <LoginScreen />;

    const handleAddPlace = (input: PlaceInput, date: string, notes: string, image?: string) => {
        if (!currentUser) return;

        addPlace({
            id: uuidv4(),
            ...input,
            location: { lat: input.lat, lng: input.lng },
            visitDate: date,
            notes,
            addedAt: Date.now(),
            images: image ? [image] : undefined,
            userId: currentUser.id,
            countryCode: input.countryCode
        });
    };

    const stats = {
        totalPlaces: userPlaces.length,
        countries: new Set(userPlaces.map(p => p.country).filter(Boolean)).size,
    };

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-slate-50 relative">
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

            {/* Top Right Controls (Profile & Passport) */}
            <div className="absolute top-4 right-4 z-[40] flex gap-2 md:right-8">
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
                            Place Tracker
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
                        <div className="p-4 border-b bg-white/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">My Journey</h2>
                            <Button size="sm" onClick={() => setIsAddDialogOpen(true)} className="rounded-full h-8 w-8 p-0">
                                <Plus className="h-4 w-4" />
                            </Button>
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
