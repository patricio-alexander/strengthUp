import { useState } from "react";
import { removeWorkoutUseCase } from "@/src/di/container";

export const useRemoveWorkout = () => {
  const [error, setError] = useState<string | null>(null);

  const removeWorkout = async (id: string): Promise<boolean> => {
    setError(null);

    try {
      await removeWorkoutUseCase.remove(id);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

  return { removeWorkout, error };
};
