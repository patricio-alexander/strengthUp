import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { User, Role } from "@/src/features/user/domain/user-entity";

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  isPremium: boolean;
  setIsPremium: ({ premium }: { premium: boolean }) => void;
  role: Role | null;
  setRole: ({ role }: { role: Role | null }) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: ({ logged }: { logged: boolean }) => void;
  session?: Session | null | undefined;
  setSession: ({ session }: { session: Session | undefined | null }) => void;
};

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  isPremium: false,
  setUser: (user) => set({ user }),
  setIsPremium: ({ premium }) => set({ isPremium: premium }),
  role: null,
  setRole: ({ role }) => set({ role }),
  isLoggedIn: false,
  setIsLoggedIn: ({ logged }) => set({ isLoggedIn: logged }),
  session: null,
  setSession: ({ session }) => set({ session }),
}));
