import { Block } from "@features/workouts/domain/entities/block";
import { BlockRepository } from "@features/workouts/domain/repositories/block-repository";

export class GetBlocksUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async getBlocksByWorkoutId(workoutId: number): Promise<Block[]> {
    return await this.blockRepository.getBlocksByWorkoutId(workoutId);
  }
}
