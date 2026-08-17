import { SetsRepository } from "@features/workouts/domain/repositories/sets-repository";

export class GetLastSessionUseCase {
  constructor(private setsRepository: SetsRepository) {}

  async getLastSession(exerciseId: number) {
    return await this.setsRepository.getLastSession(exerciseId);
  }
}
