import { useCallback, useEffect, useState } from "react";
import {
  addExerciseToWorkoutUseCase,
  addExerciseUseCase,
  getDefaultExercisesUseCase,
  getExercisesUseCase,
  getSelectedExercisesUseCase,
  orderSelectedExercisesUseCase,
  removeExerciseFromWorkoutUseCase,
  removeExerciseUseCase,
  updateExerciseUseCase,
} from "@/src/di/container";
import {
  SelectedExercise,
  UserExercise,
} from "@features/workouts/domain/entities/exercise";
import { useUserStore } from "@/store/userStore";
import { useFocusEffect } from "expo-router";

export const useExercisesVM = (workoutId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDefaultLoading, setIsDefaultLoading] = useState(true);
  const [isSelectedLoading, setIsSelectedLoading] = useState(
    Boolean(workoutId),
  );
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<UserExercise[]>([]);
  const [defaultExercises, setDefaultExercises] = useState<UserExercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const { user } = useUserStore();

  const getExercises = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const result = await getExercisesUseCase.getExercises(user.id);
      setExercises(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultExercises = async () => {
    try {
      setError(null);
      const result = await getDefaultExercisesUseCase.get();
      setDefaultExercises(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsDefaultLoading(false);
    }
  };

  const getSelectedExercises = async () => {
    if (!workoutId) {
      setIsSelectedLoading(false);
      return;
    }

    try {
      setError(null);
      const result = await getSelectedExercisesUseCase.get(Number(workoutId));
      setSelectedExercises(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSelectedLoading(false);
    }
  };

  const addExercise = async (name: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setError(null);
      await addExerciseUseCase.add(name, user.id);
      await getExercises();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const updateExercise = async (
    name: string,
    exerciseId: number,
  ): Promise<boolean> => {
    try {
      setError(null);
      await updateExerciseUseCase.update({ name }, exerciseId);
      await getExercises();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const removeExercise = async (exerciseId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await removeExerciseUseCase.removeExercise(exerciseId);
      await getExercises();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const addExerciseToWorkout = async (exerciseId: number): Promise<boolean> => {
    if (!workoutId) return false;

    try {
      setError(null);
      await addExerciseToWorkoutUseCase.add(exerciseId, Number(workoutId));
      await getSelectedExercises();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const removeExerciseFromWorkout = async (
    exerciseId: number,
  ): Promise<boolean> => {
    if (!workoutId) return false;

    try {
      setError(null);
      await removeExerciseFromWorkoutUseCase.remove(
        exerciseId,
        Number(workoutId),
      );
      await getSelectedExercises();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const orderSelectedExercises = async (ordered: SelectedExercise[]) => {
    setSelectedExercises(ordered);

    try {
      setError(null);
      await orderSelectedExercisesUseCase.order(ordered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const isExerciseSelected = (exerciseId: number) =>
    selectedExercises.some((exercise) => exercise.id === exerciseId);

  useEffect(() => {
    getExercises();
    getDefaultExercises();
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      getSelectedExercises();
    }, [workoutId]),
  );

  return {
    exercises,
    defaultExercises,
    selectedExercises,
    isLoading,
    isDefaultLoading,
    isSelectedLoading,
    error,
    getExercises,
    getDefaultExercises,
    getSelectedExercises,
    addExercise,
    updateExercise,
    removeExercise,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    orderSelectedExercises,
    isExerciseSelected,
  };
};
