import { create } from "zustand";
import { api } from "../api";

interface NetworkState {
  isPending: boolean;
  isOnline: boolean;
  isServerHealthy: boolean | undefined;
  setOnline: (status: boolean) => void;
  checkHealth: () => Promise<boolean>;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: navigator.onLine,
  isServerHealthy: undefined,
  isPending: false,

  setOnline: (status) => set({ isOnline: status }),

  checkHealth: async () => {
    set({ isPending: true });
    const isHealthy = await api.checkHealth();
    set({ isServerHealthy: isHealthy, isPending: false });
    return isHealthy;
  },
}));

export const isBackendReady = () => {
  const state = useNetworkStore.getState();
  return state.isOnline && state.isServerHealthy;
};
