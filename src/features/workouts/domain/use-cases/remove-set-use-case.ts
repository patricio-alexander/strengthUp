import { SetsRepository } from "@features/workouts/domain/repositories/sets-repository";

export class RemoveSetUseCase {
  constructor(private setsRepository: SetsRepository) {}

  async removeSet(setId: number): Promise<void> {
    await this.setsRepository.removeSet(setId);
  }
}
