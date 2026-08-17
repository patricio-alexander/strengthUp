import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";
import { SelectedExercise } from "@features/workouts/domain/entities/exercise";

export class GetSelectedExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async get(workoutId: number): Promise<SelectedExercise[]> {
    return this.exerciseRepository.getSelectedExercises(workoutId);
  }
}
