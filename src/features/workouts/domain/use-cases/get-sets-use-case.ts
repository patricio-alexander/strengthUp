import { SetsRepository } from "@features/workouts/domain/repositories/sets-repository";
import { FilterSets } from "@/types/filterSets";

export class GetSetsUseCase {
  constructor(private setsRepository: SetsRepository) {}

  async getSets(exerciseId: number, filter: FilterSets) {
    return this.setsRepository.getSets(exerciseId, filter);
  }
}
