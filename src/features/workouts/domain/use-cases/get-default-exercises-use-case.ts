import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";

export class GetDefaultExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async get() {
    return this.exerciseRepository.getDefaultExercises();
  }
}
