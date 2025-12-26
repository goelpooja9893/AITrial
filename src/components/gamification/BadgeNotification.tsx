import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../types';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface BadgeNotificationProps {
    badge: Badge | null;
    onClose: () => void;
}

export function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
    useEffect(() => {
        if (badge) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [badge, onClose]);

    if (!badge) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.8 }}
                className="fixed bottom-8 right-8 z-[100] max-w-sm w-full"
            >
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl shadow-2xl border-2 border-white/20 flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full text-3xl">
                        {badge.icon}
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-100">Badge Unlocked!</div>
                        <div className="text-lg font-bold">{badge.name}</div>
                        <div className="text-sm text-white/90">{badge.description}</div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
