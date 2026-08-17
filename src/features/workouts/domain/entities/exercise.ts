import { Set } from "./set";

export interface UserExercise {
  id: number;
  name: string;
  user_id: string;
  default: boolean;
}

export interface SelectedExercise {
  id: number;
  name: string;
  workoutSessionExerciseId: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface CreateExercise {
  name: string;
}
