import { WorkoutRepository } from "@features/workouts/domain/repositories/workout-repository";
import { Workout } from "@features/workouts/domain/entities/workout";

export class GetUserWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async get(userId: string): Promise<Workout | null> {
    return await this.workoutRepository.getUserWorkout(userId);
  }
}
