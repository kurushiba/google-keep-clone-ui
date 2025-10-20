import { create } from 'zustand';
import { Label } from './label.entity';

interface LabelState {
  labels: Label[];
  isLoading: boolean;
  setLabels: (labels: Label[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  addLabel: (label: Label) => void;
  removeLabel: (id: string) => void;
}

export const useLabelStore = create<LabelState>((set, get) => ({
  labels: [],
  isLoading: false,

  setLabels: (labels: Label[]) => {
    set({ labels });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  addLabel: (label: Label) => {
    set({ labels: [...get().labels, label] });
  },

  removeLabel: (id: string) => {
    set({ labels: get().labels.filter((label) => label.id !== id) });
  },
}));
