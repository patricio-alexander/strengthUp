import { Workout } from "@features/workouts/domain/entities/workout";

export interface WorkoutRepository {
  getUserWorkout(userId: string): Promise<Workout | null>;
  removeWorkout(workoutId: string): Promise<void>;
  updateWorkout(workout: Workout): Promise<void>;
  addWorkout(name: string, userId: string): Promise<void>;
}
