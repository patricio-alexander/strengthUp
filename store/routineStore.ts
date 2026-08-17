import { create } from "zustand";

interface RoutineState {
  workoutId: number | null;
  setWorkoutId: (workoutId: number | null) => void;
}

export const useRoutineStore = create<RoutineState>()((set) => ({
  workoutId: null,
  setWorkoutId: (workoutId) => set({ workoutId }),
}));
