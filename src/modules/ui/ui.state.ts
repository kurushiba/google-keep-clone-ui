import { create } from 'zustand';

export interface FlashMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIState {
  flashMessages: FlashMessage[];
  addFlashMessage: (message: string, type: FlashMessage['type']) => void;
  removeFlashMessage: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  flashMessages: [],

  addFlashMessage: (message: string, type: FlashMessage['type']) => {
    const id = crypto.randomUUID();
    const newMessage: FlashMessage = { id, message, type };

    set((state) => ({
      flashMessages: [...state.flashMessages, newMessage],
    }));

    // 3秒後に自動削除
    setTimeout(() => {
      set((state) => ({
        flashMessages: state.flashMessages.filter((msg) => msg.id !== id),
      }));
    }, 3000);
  },

  removeFlashMessage: (id: string) => {
    set((state) => ({
      flashMessages: state.flashMessages.filter((msg) => msg.id !== id),
    }));
  },
}));
