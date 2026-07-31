import { BlockRepository } from "@features/workouts/domain/repositories/block-repository";
import { Block } from "@features/workouts/domain/entities/block";

export class GetBlockByIdUseCase {
  constructor(private readonly blockRepository: BlockRepository) {}

  async getBlock(blockId: number): Promise<Block | null> {
    return await this.blockRepository.getBlockById(blockId);
  }
}
