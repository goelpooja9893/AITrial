import { Moon, Sun, CloudMoon } from "lucide-react";
import { usePlacesStore } from "../../store/usePlacesStore";

export function ThemeSelector() {
    const { theme, setTheme } = usePlacesStore();

    return (
        <div className="flex bg-white/50 backdrop-blur-sm rounded-full p-1 border border-white/20 shadow-sm">
            <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white shadow text-amber-500' : 'text-slate-500 hover:text-slate-700'}`}
                title="Light Mode"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-800 shadow text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
                title="Dark Mode"
            >
                <Moon className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme('midnight')}
                className={`p-1.5 rounded-full transition-all ${theme === 'midnight' ? 'bg-indigo-950 shadow text-indigo-300' : 'text-slate-500 hover:text-slate-700'}`}
                title="Midnight Theme"
            >
                <CloudMoon className="h-4 w-4" />
            </button>
        </div>
    );
}
