import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email, password) => {
    // Simulate API call
    if (email === 'admin@example.com' && password === 'admin') {
      set({ user: { id: '1', email, role: 'admin' } });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => set({ user: null }),
  resetPassword: async (email) => {
    // Simulate password reset
    console.log('Password reset email sent to:', email);
  },
}))