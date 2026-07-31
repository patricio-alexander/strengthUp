import { useState } from "react";
import { addWorkoutUseCase } from "@/src/di/container";

export const useAddWorkout = () => {
  const [error, setError] = useState<string | null>(null);

  const addWorkout = async (name: string, userId: string): Promise<boolean> => {
    setError(null);

    try {
      await addWorkoutUseCase.add(name, userId);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

  return { addWorkout, error };
};
