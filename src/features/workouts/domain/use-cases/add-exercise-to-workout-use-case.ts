import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";

export class AddExerciseToWorkoutUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async add(exerciseId: number, workoutId: number) {
    return await this.exerciseRepository.addExerciseToWorkout(
      exerciseId,
      workoutId,
    );
  }
}
