import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";

export class RemoveExerciseFromWorkoutUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async remove(exerciseId: number, workoutId: number) {
    return this.exerciseRepository.removeExerciseFromWorkout(
      exerciseId,
      workoutId,
    );
  }
}
