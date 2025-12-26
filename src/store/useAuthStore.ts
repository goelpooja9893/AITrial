import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    login: (name: string, email: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            currentUser: null,
            isAuthenticated: false,

            login: (name, email) => set({
                currentUser: {
                    id: email, // Simple ID based on email for this demo
                    name,
                    email,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` // Free avatar API
                },
                isAuthenticated: true
            }),

            logout: () => set({ currentUser: null, isAuthenticated: false }),
        }),
        {
            name: 'place-tracker-auth',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
