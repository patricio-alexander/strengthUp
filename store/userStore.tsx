import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

export enum Role {
  Personal = "personal",
  Personalized = "personalized",
  Coach = "coach",
}
//export type Role = "personal" | "personalized" | "coach" | null;

type UserState = {
  user: string;
  setUser: ({ user, userId }: { user: string; userId: number }) => void;
  userId: number;
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
  user: "",
  userId: 0,
  isPremium: false,
  setUser: ({ user, userId }) => set({ user, userId }),
  setIsPremium: ({ premium }) => set({ isPremium: premium }),
  role: null,
  setRole: ({ role }) => set({ role }),
  isLoggedIn: false,
  setIsLoggedIn: ({ logged }) => set({ isLoggedIn: logged }),
  session: null,
  setSession: ({ session }) => set({ session }),
}));
