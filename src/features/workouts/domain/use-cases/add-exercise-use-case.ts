import { ExerciseRepository } from "@features/workouts/domain/repositories/exercises-repository";

export class AddExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async add(name: string, userId: string) {
    return this.exerciseRepository.addExercise(name, userId);
  }
}
