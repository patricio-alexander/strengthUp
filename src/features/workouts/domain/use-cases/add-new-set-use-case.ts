import { SetsRepository } from "@features/workouts/domain/repositories/sets-repository";
import { CreateSet } from "@features/workouts/domain/entities/set";

export class AddNewSetUseCase {
  constructor(private setsRepository: SetsRepository) {}

  async addNewset(set: CreateSet, exerciseId: number) {
    this.setsRepository.addNewSet(set, exerciseId);
  }
}
