import { Block } from "@features/workouts/domain/entities/block";
import { useState, useEffect } from "react";
import { getBlockByIdUseCase } from "@/src/di/container";

export const useGetBlockById = (blockId: number) => {
  const [block, setBlock] = useState<Block | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blockId) return;

    setError(null);

    getBlockByIdUseCase
      .getBlock(blockId)
      .then(setBlock)
      .catch((err: Error) => setError(err.message));
  }, [blockId]);

  return { block, error };
};
