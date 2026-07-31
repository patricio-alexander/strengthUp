import { Block } from "@features/workouts/domain/entities/block";
import { updateBlockUseCase } from "@/src/di/container";
import { useState } from "react";

export const useUpdateBlock = () => {
  const [error, setError] = useState<string | null>(null);

  const updateBlock = async (block: Block): Promise<boolean> => {
    setError(null);

    try {
      await updateBlockUseCase.update(block);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

  return { updateBlock, error };
};
