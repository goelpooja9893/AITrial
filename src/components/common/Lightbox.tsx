import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LightboxProps {
    isOpen: boolean;
    images: string[];
    initialIndex?: number;
    onClose: () => void;
}

export function Lightbox({ isOpen, images, initialIndex = 0, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, images.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleDragEnd = (_: any, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x > swipeThreshold) {
            handlePrevious();
        } else if (info.offset.x < -swipeThreshold) {
            handleNext();
        }
    };

    if (!isOpen || images.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
                onClick={onClose}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                >
                    <X className="h-8 w-8" />
                </button>

                {/* Image counter */}
                {images.length > 1 && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/90 text-sm font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevious();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-10"
                        >
                            <ChevronLeft className="h-10 w-10" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all z-10"
                        >
                            <ChevronRight className="h-10 w-10" />
                        </button>
                    </>
                )}

                {/* Image */}
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => e.stopPropagation()}
                />
            </motion.div>
        </AnimatePresence>
    );
}
