import { BlockRepository } from "@features/workouts/domain/repositories/block-repository";
import { CreateBlock } from "@features/workouts/domain/entities/block";
export class AddBlockUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async add(block: CreateBlock) {
    return this.blockRepository.addBlock(block);
  }
}
