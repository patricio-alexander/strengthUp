import { Exercise } from "@features/workouts/domain/entities/exercise";

export interface Block {
  id: number;
  name: string;
  day: string
  exercises?: Exercise[];
  totalExercises?: number;
}

export interface CreateBlock {
  name: string;
  dayKey: string;
  workoutId: string;
}
