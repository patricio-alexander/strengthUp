import { useCallback, useState } from "react";
import { Block } from "@features/workouts/domain/entities/block";
import { getBlocksUseCase, orderBlocksUseCase } from "@/src/di/container";
import { useFocusEffect } from "expo-router";

export const useGetBlocks = (workoutId: number) => {
  const [isLoading, setIsLoading] = useState(true);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getBlocks = async () => {
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

  const order = async (blocks: Block[]) => {
    setError(null);

    try {
      await orderBlocksUseCase.order(blocks);
    } catch (err: Error | any) {
      setError(err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBlocks();
    }, []),
  );

  return { blocks, isLoading, error, order };
};
