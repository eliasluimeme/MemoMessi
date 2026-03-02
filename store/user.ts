import { TUser } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: TUser | null;
  updateUser: (updatedUser: Partial<TUser>) => void;
  setUser: (user: TUser | null) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      updateUser: (updatedUser) =>
        set(({ user }) => ({
          user: user ? { ...user, ...updatedUser } : null,
        })),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);

export default useUserStore;
