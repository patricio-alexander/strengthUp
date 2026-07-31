import { useCallback, useState } from "react";
import { getUserWorkoutUseCase } from "@/src/di/container";
import { Workout } from "@features/workouts/domain/entities/workout";
import { useFocusEffect } from "expo-router";

export const useGetUserWorkout = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkout = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setError(null);

    try {
      setIsLoading(true);
      const workout = await getUserWorkoutUseCase.get(userId);
      setWorkout(workout);
    } catch (err: Error | any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkout();
    }, [userId]),
  );

  return { isLoading, error, workout, fetchWorkout };
};
