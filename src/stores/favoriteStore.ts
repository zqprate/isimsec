import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteStore {
  favorites: string[];
  addFavorite: (nameId: string) => void;
  removeFavorite: (nameId: string) => void;
  isFavorite: (nameId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (nameId: string) => {
        set((state) => ({
          favorites: state.favorites.includes(nameId)
            ? state.favorites
            : [...state.favorites, nameId],
        }));
      },

      removeFavorite: (nameId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== nameId),
        }));
      },

      isFavorite: (nameId: string) => {
        return get().favorites.includes(nameId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: "isimsec-favorites",
    }
  )
);
