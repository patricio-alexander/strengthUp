import { Block, CreateBlock } from "@features/workouts/domain/entities/block";
export interface BlockRepository {
  addBlock(block: CreateBlock): Promise<void>;
  updateBlock(block: Block): Promise<void>;
  removeBlock(blockId: number): Promise<void>;
  getBlocksByWorkoutId(workoutId: number): Promise<Block[]>;
  orderBlocks(blocks: Block[]): Promise<void>;
  getBlockById(blockId: number): Promise<Block | null>;
}
