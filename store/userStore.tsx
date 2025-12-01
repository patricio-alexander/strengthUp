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
  setRole: ({ role  }: { role: Role | null }) => void;
};

export const useUserStore = create<UserState>()((set) => ({
  user: "",
  userId: 0,
  isPremium: false,
  setUser: ({ user, userId }) => set({ user, userId }),
  setIsPremium: ({ premium }) => set({ isPremium: premium }),
  role: null,
  setRole: ({ role }) => set({ role }),
}));
