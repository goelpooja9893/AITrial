import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { MapPin, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginScreen() {
    const { login } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            login(name, email);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
            {/* Vibrant Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-[2px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-6"
            >
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 mb-4 shadow-lg shadow-blue-500/30">
                            <Globe className="h-8 w-8 text-white animate-pulse-slow" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Place Tracker
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Map your journey across the world</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Name</label>
                            <Input
                                placeholder="How should we call you?"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white/50 border-slate-200 focus:bg-white transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
                            <Input
                                placeholder="your@email.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/50 border-slate-200 focus:bg-white transition-colors"
                                required
                            />
                            <p className="text-xs text-slate-400 px-1">We use this to save your places locally.</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Starting Adventure...' : (
                                <span className="flex items-center gap-2">
                                    Start Exploring <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span></div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-slate-200 hover:bg-slate-50 text-slate-600"
                            onClick={() => {
                                setName("Guest Explorer");
                                setEmail("guest@example.com");
                                setTimeout(() => login("Guest Explorer", "guest@example.com"), 500);
                            }}
                        >
                            <MapPin className="mr-2 h-4 w-4" />
                            Try as Guest
                        </Button>
                    </form>
                </div>

                <p className="text-center text-white/60 text-xs mt-6 font-medium">
                    Your data is stored securely in your browser.
                </p>
            </motion.div>
        </div>
    );
}
