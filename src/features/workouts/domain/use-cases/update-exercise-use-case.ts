import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";
import { CreateExercise } from "@features/workouts/domain/entities/exercise";

export class UpdateExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async update(update: CreateExercise, id: number) {
    return this.exerciseRepository.updateExercise(update, id);
  }
}
