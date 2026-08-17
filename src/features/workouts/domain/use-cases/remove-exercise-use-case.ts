import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";

export class RemoveExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async removeExercise(exerciseId: number) {
    return this.exerciseRepository.removeExercise(exerciseId);
  }
}
