import { useCallback, useEffect, useState } from "react";
import { Block, CreateBlock } from "@features/workouts/domain/entities/block";
import {
  addBlockUseCase,
  getBlockByIdUseCase,
  getBlocksUseCase,
  orderBlocksUseCase,
  removeBlockUseCase,
  updateBlockUseCase,
} from "@/src/di/container";
import { useFocusEffect } from "expo-router";

type UseBlockVMOptions = {
  workoutId?: number;
  blockId?: number;
};

export const useBlockVM = ({ workoutId, blockId }: UseBlockVMOptions = {}) => {
  const [isLoading, setIsLoading] = useState(Boolean(workoutId));
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [block, setBlock] = useState<Block | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getBlocks = async () => {
    if (!workoutId) return;

    setError(null);

    try {
      const result = await getBlocksUseCase.getBlocksByWorkoutId(workoutId);
      setBlocks(result);
    } catch (err: Error | any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const order = async (orderedBlocks: Block[]) => {
    setError(null);

    try {
      await orderBlocksUseCase.order(orderedBlocks);
    } catch (err: Error | any) {
      setError(err.message);
    }
  };

  const addBlock = async (newBlock: CreateBlock): Promise<boolean> => {
    setError(null);

    try {
      await addBlockUseCase.add(newBlock);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

  const updateBlock = async (updatedBlock: Block): Promise<boolean> => {
    setError(null);

    try {
      await updateBlockUseCase.update(updatedBlock);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

  const removeBlock = async (id: number): Promise<boolean> => {
    setError(null);

    try {
      await removeBlockUseCase.remove(id);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (workoutId) {
        getBlocks();
      }
    }, [workoutId]),
  );

  useEffect(() => {
    if (!blockId) return;

    setError(null);

    getBlockByIdUseCase
      .getBlock(blockId)
      .then(setBlock)
      .catch((err: Error) => setError(err.message));
  }, [blockId]);

  return {
    blocks,
    block,
    isLoading,
    error,
    order,
    addBlock,
    updateBlock,
    removeBlock,
  };
};
