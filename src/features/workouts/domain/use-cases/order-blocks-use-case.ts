import { BlockRepository } from "@features/workouts/domain/repositories/block-repository";
import { Block } from "../entities/block";

export class OrderBlocksUseCase {
  constructor(private blockRepository: BlockRepository) {}

  async order(blocks: Block[]): Promise<void> {
    return await this.blockRepository.orderBlocks(blocks);
  }
}
