import { create } from 'zustand';
import { Note } from './note.entity';

interface NotesState {
  notes: Note[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  searchQuery: string;
  setNotes: (notes: Note[]) => void;
  addNotes: (notes: Note[]) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Note) => void;
  removeNote: (id: string) => void;
  resetNotes: () => void;
  removeLabelFromNotes: (labelId: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  searchQuery: '',

  setNotes: (notes: Note[]) => {
    set({ notes });
  },

  addNotes: (notes: Note[]) => {
    set((state) => ({ notes: [...state.notes, ...notes] }));
  },

  setPage: (page: number) => {
    set({ page });
  },

  setHasMore: (hasMore: boolean) => {
    set({ hasMore });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  addNote: (note: Note) => {
    set((state) => ({ notes: [note, ...state.notes] }));
  },

  updateNote: (id: string, note: Note) => {
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? note : n)),
    }));
  },

  removeNote: (id: string) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }));
  },

  resetNotes: () => {
    set({ notes: [], page: 1, hasMore: true });
  },

  removeLabelFromNotes: (labelId: string) => {
    set((state) => ({
      notes: state.notes.map((note) => ({
        ...note,
        labels: note.labels?.filter((label) => label.id !== labelId) || [],
      })),
    }));
  },
}));
