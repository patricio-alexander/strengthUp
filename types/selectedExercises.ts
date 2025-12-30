import { Exercises } from "./exercises";

export type SelectedExercises = Exercises & {
  workoutSesssionExerciseId: number;
};
