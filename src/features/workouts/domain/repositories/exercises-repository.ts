import {
  CreateExercise,
  SelectedExercise,
  UserExercise,
} from "@features/workouts/domain/entities/exercise";

export interface ExerciseRepository {
  getExercises(userId: string): Promise<UserExercise[]>;
  addExercise(name: string, userId: string): Promise<void>;
  removeExercise(id: number): Promise<void>;
  updateExercise(update: CreateExercise, id: number): Promise<void>;
  getSelectedExercises(workoutId: number): Promise<SelectedExercise[]>;
  addExerciseToWorkout(exerciseId: number, workoutId: number): Promise<void>;
  removeExerciseFromWorkout(
    exerciseId: number,
    workoutId: number,
  ): Promise<void>;
  orderSelectedExercises(exercises: SelectedExercise[]): Promise<void>;

  getDefaultExercises(): Promise<UserExercise[]>;
}
