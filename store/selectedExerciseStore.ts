import { create } from "zustand";

type SelectedExerciseStore = {
  selectedExercise: string | null;
  indexBlock: number | null;
  setSelectedExercise: (exercise: string, dayIndex: number) => void;
  reset: () => void;
};

export const useSelectedExerciseStore = create<SelectedExerciseStore>(
  (set) => ({
    selectedExercise: null,
    indexBlock: null,
    setSelectedExercise: (exercise, indexBlock) =>
      set({ selectedExercise: exercise, indexBlock }),
    reset: () => set({ selectedExercise: null, indexBlock: null }),
  }),
);
