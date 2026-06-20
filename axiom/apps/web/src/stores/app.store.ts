import { create } from "zustand";

interface AppState {
  darkMode: boolean;
  lastEvent: string;
  walletAddress: string;
  toggleDarkMode: () => void;
  setLastEvent: (event: string) => void;
  setWalletAddress: (address: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  darkMode: false,
  lastEvent: "idle",
  walletAddress: "",
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setLastEvent: (event) => set({ lastEvent: event }),
  setWalletAddress: (address) => set({ walletAddress: address })
}));
