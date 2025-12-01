import { openDatabaseSync } from "expo-sqlite";
import { create } from "zustand";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { days, daysExcercises, sets, exercises, routines } from "@/db/schema";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { Set } from "@/types/set";

const DATABASE_NAME = "strengthup.db";
const expo = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expo);

type Group = {
  [date: number]: Set[];
};

type Exercise = {
  id: number;
  name: string | null;
  gifId: string;
};

export type SelectedExercise = Exercise & {
  dayExerciseId: number;
};

type Routine = {
  id: number;
  name: string | null;
  daysInRoutine: number;
};

type GroupSets = {
  date: number;
  sets: Set[];
};

type Routines = {
  exercises: Exercise[];
  
  sets: GroupSets[];
  selectedExercises: SelectedExercise[];
  loadSelectedExercises: ({ dayId }: { dayId: number }) => void;
  loadAllExercises: () => void;

  removeSet: ({ id }: { id: number }) => void;
  pastSets: GroupSets[];
  removeExercise: ({ id }: { id: number }) => void;
  allSets: GroupSets[];
  lastRoutine: { id: number | undefined; name: string };

  setSelectedExercises: ({ data }: { data: SelectedExercise[] }) => void;
};

export const useRoutineStore = create<Routines>()((set) => ({
  routines: [],
  days: [],
  sets: [],
  pastSets: [],
  selectedExercises: [],
  exercises: [],
  allSets: [],
  lastRoutine: { id: 0, name: "name" },
  

  setSelectedExercises: ({ data }) => set({ selectedExercises: data }),

  loadSelectedExercises: async ({ dayId }) => {
    const selectedExercises = await db
      .select()
      .from(exercises)
      .innerJoin(daysExcercises, eq(daysExcercises.exerciseId, exercises.id))
      .orderBy(daysExcercises.sorted)
      .where(eq(daysExcercises.dayId, dayId));

    const mapped = selectedExercises.map((selectedExercise) => ({
      ...selectedExercise.exercises,
      dayExerciseId: selectedExercise.days_exercises.id,
      sorted: selectedExercise.days_exercises.sorted,
    }));

    set({ selectedExercises: mapped });
  },

  loadAllExercises: async () => {
    const exercisesDb = await db.select().from(exercises);
    set({ exercises: exercisesDb });
  },

  removeSet: async ({ id }) => {
    set((state) => ({
      sets: state.sets.map((set) => ({
        ...set,
        sets: set.sets.filter((set) => set.id !== id),
      })),
    }));
    await db.delete(sets).where(eq(sets.id, id));
  },

  removeExercise: async ({ id }) => {
    await db.delete(exercises).where(eq(exercises.id, id));
    set((state) => ({ exercises: state.exercises.filter((e) => e.id !== id) }));
  },
}));
