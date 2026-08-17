import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";

export class GetExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async getExercises(userId: string) {
    return await this.exerciseRepository.getExercises(userId);
  }
}
