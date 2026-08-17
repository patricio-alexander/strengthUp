import { BlockRepository } from "@features/workouts/domain/repositories/block-repository";

export class RemoveBlockUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async remove(blockId: number) {
    return await this.blockRepository.removeBlock(blockId);
  }
}
