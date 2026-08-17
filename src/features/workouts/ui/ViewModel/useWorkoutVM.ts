import { useCallback, useState } from "react";
import { Workout } from "@features/workouts/domain/entities/workout";
import {
  addWorkoutUseCase,
  getUserWorkoutUseCase,
  removeWorkoutUseCase,
} from "@/src/di/container";
import { useFocusEffect } from "expo-router";
import { useRoutineStore } from "@/store/routineStore";

export const useWorkoutVM = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setWorkoutId } = useRoutineStore();

  const fetchWorkout = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setError(null);

    try {
      setIsLoading(true);
      const result = await getUserWorkoutUseCase.get(userId);
      setWorkout(result);
      setWorkoutId(result.id);
    } catch (err: Error | any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkout = async (name: string, ownerId: string): Promise<boolean> => {
    setError(null);

    try {
      await addWorkoutUseCase.add(name, ownerId);
      return true;
    } catch (err: Error | any) {
      setError(err.message);
      return false;
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      fetchWorkout();
    }, [userId]),
  );

  return {
    workout,
    isLoading,
    error,
    fetchWorkout,
    addWorkout,
    removeWorkout,
  };
};
