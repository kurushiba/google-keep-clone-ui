import { create } from 'zustand';
import type { User } from '../users/user.entity';

interface CurrentUserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
