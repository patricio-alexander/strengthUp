import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";
import { SelectedExercise } from "@features/workouts/domain/entities/exercise";

export class OrderSelectedExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async order(exercises: SelectedExercise[]): Promise<void> {
    return this.exerciseRepository.orderSelectedExercises(exercises);
  }
}
