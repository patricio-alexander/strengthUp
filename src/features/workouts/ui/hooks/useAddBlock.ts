import { useState } from "react";
import { CreateBlock } from "@features/workouts/domain/entities/block";
import { addBlockUseCase } from "@/src/di/container";

export const useAddBlock = () => {
  const [error, setError] = useState<string | null>(null);

  const addBlock = async (block: CreateBlock): Promise<boolean> => {
    setError(null);

    try {
      await addBlockUseCase.add(block);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

  return { addBlock, error };
};
