import { useState } from "react";
import { removeBlockUseCase } from "@/src/di/container";

export const useRemoveBlock = () => {
  const [error, setError] = useState<string | null>(null);

  const removeBlock = async (blockId: number): Promise<boolean> => {
    setError(null);

    try {
      await removeBlockUseCase.remove(blockId);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

  return { removeBlock, error };
};
