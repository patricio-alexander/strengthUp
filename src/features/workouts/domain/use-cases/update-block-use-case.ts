import { BlockRepository } from "@features/workouts/domain/repositories/block-repository";
import { Block } from "@features/workouts/domain/entities/block";

export class UpdateBlockUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async update(block: Block) {
    return this.blockRepository.updateBlock(block);
  }
}
