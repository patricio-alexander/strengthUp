import { WorkoutRepository } from "@features/workouts/domain/repositories/workout-repository";

export class RemoveWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async remove(id: string) {
    await this.workoutRepository.removeWorkout(id);
  }
}
