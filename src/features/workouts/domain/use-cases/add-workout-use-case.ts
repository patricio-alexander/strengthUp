import { WorkoutRepository } from "@features/workouts/domain/repositories/workout-repository";

export class AddWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}
  async add(name: string, userId: string) {
    await this.workoutRepository.addWorkout(name, userId);
  }
}
