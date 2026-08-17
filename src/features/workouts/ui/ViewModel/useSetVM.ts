import { useState, useCallback, useEffect } from "react";
import {
  CreateSet,
  LastSession,
  Set,
} from "@features/workouts/domain/entities/set";
import {
  addNewSetUseCase,
  getLastSessionUseCase,
  getSetsUseCase,
  removeSetUseCase,
} from "@/src/di/container";
import { FilterSets } from "@/types/filterSets";
import { GroupSetsByDate } from "@/types/groupByDay";

export const useSetsVM = (exerciseId: number, filter: FilterSets) => {
  const [sets, setSets] = useState<GroupSetsByDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLastSessionLoading, setIsLastSessionLoading] = useState(false);
  const [lastSession, setLastSession] = useState<LastSession | null>(null);

  const getSets = async () => {
    try {
      setIsLoading(true);
      const sets = await getSetsUseCase.getSets(exerciseId, filter);
      setSets(sets);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const removeSet = async (setId: number) => {
    try {
      await removeSetUseCase.removeSet(setId);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const getLastSession = async () => {
    try {
      setIsLastSessionLoading(true);
      setError(null);
      const result = await getLastSessionUseCase.getLastSession(exerciseId);
      setLastSession(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLastSession(null);
    } finally {
      setIsLastSessionLoading(false);
    }
  };

  const addNewSet = async (exerciseId: number, set: CreateSet) => {
    try {
      setIsLoading(true);
      await addNewSetUseCase.addNewset(set, exerciseId);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSets();
  }, [filter]);

  return {
    sets,
    isLoading,
    error,
    getSets,
    addNewSet,
    getLastSession,
    isLastSessionLoading,
    lastSession,
    removeSet,
  };
};
